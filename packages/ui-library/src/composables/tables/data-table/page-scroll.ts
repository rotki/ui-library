import type { MaybeRefOrGetter, Ref } from 'vue';
import type { MaybeElementRef } from '@/types/dom';

export interface UsePageScrollReturn {
  /** Scroll the table's top into view, if it has scrolled above the visible area. */
  revealTableTop: () => Promise<void>;
}

/**
 * How much of a table, from its top, must be on screen before its pagination bar sticks: the
 * column header and the first rows. A table just scrolling in from below keeps its bar under the
 * rows, rather than showing the bar on top of the header.
 */
const STICK_AFTER = 128;

/**
 * The nearest ancestor that scrolls vertically. `undefined` means the page itself does, through
 * the window or a scrolling `<body>`, which is where a sticky offset such as an app bar applies.
 */
function findScroller(element: HTMLElement): HTMLElement | undefined {
  let node = element.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight)
      return node;
    node = node.parentElement;
  }
  return undefined;
}

function scrollPageBy(top: number): void {
  const body = document.body;
  if (body.scrollHeight > body.clientHeight && ['auto', 'scroll'].includes(getComputedStyle(body).overflowY))
    body.scrollBy({ top });
  else
    window.scrollBy({ top });
}

/**
 * After a page change, brings the table's first row back into view so the new page reads from the
 * top. It scrolls only when the table's top sits above the visible area, as it does after paging
 * from the bottom bar of a long page; a table that already shows its top stays put, so paging never
 * makes the view jump.
 */
export function usePageScroll(
  wrapper: Readonly<Ref<HTMLElement | null | undefined>>,
  stickyOffset: MaybeRefOrGetter<number | undefined>,
): UsePageScrollReturn {
  async function revealTableTop(): Promise<void> {
    await nextTick();
    const element = get(wrapper);
    if (!element)
      return;

    const scroller = findScroller(element);
    const viewTop = scroller ? scroller.getBoundingClientRect().top : (toValue(stickyOffset) ?? 0);
    const distance = element.getBoundingClientRect().top - viewTop;
    if (distance >= 0)
      return;

    if (scroller)
      scroller.scrollBy({ top: distance });
    else
      scrollPageBy(distance);
  }

  return { revealTableTop };
}

/**
 * Whether the pagination bar may stick: true once the top {@link STICK_AFTER}px of the table are
 * inside its scrolling area. It starts true, so a page without IntersectionObserver keeps the bar
 * sticky.
 */
export function useStickyPaginationBar(
  wrapper: Readonly<Ref<HTMLElement | null | undefined>>,
  enabled: MaybeRefOrGetter<boolean>,
): Readonly<Ref<boolean>> {
  const canStick = shallowRef<boolean>(true);
  const root = shallowRef<HTMLElement>();

  onMounted(() => {
    const element = get(wrapper);
    if (element)
      set(root, findScroller(element));
  });

  useIntersectionObserver(
    () => (toValue(enabled) ? get(wrapper) : undefined),
    ([entry]) => {
      if (!entry)
        return;
      // also true once the table has scrolled past the top, when the bar is out of view anyway
      set(canStick, entry.isIntersecting || entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0));
    },
    { root, rootMargin: `0px 0px -${STICK_AFTER}px 0px` },
  );

  return canStick;
}

/**
 * How far above the bar a bar resting at its own place still counts as covered: a part docked in the
 * bottom corner (rotki's task dock is 82px with its offset) reaches over the bar's top by about this much.
 */
const RESTING_CLEARANCE = 48;

/** How much of the view's bottom each pagination bar covers, by table; the page's floating parts clear the most. */
const stuckBarHeights = new Map<symbol, number>();

function publishStickyBottom(): void {
  if (typeof document === 'undefined')
    return;
  const style = document.documentElement.style;
  if (stuckBarHeights.size === 0)
    style.removeProperty('--rui-sticky-bottom');
  else
    style.setProperty('--rui-sticky-bottom', `${Math.max(...stuckBarHeights.values())}px`);
}

/**
 * Publishes how much of the view's bottom a stuck pagination bar covers, as `--rui-sticky-bottom` on
 * the document root, so the page's own floating parts (a dock, a FAB) can rise above the bar instead of
 * covering its page buttons. A bar resting at its own place in the bottom band of the view counts too,
 * since it sits in the same corner; it covers from its top down, which is more than its height when it
 * rests above the view's bottom, so the parts keep the same gap above it as above a stuck bar. Only a
 * bar at page level counts: one inside a scrolling area sits under nothing the page floats.
 *
 * @param sentinel - an empty element at the bar's own place after the rows; while it is below the view's bottom band, the bar covers that corner
 * @param bar - the bar, measured for its height
 * @param canStick - whether the bar may stick at all
 */
export function useStickyBottomInset(
  sentinel: Readonly<Ref<HTMLElement | null | undefined>>,
  bar: MaybeElementRef,
  canStick: MaybeRefOrGetter<boolean>,
): void {
  const id = Symbol('sticky-pagination-bar');
  const belowView = shallowRef<boolean>(false);
  const pageLevel = shallowRef<boolean>(false);
  const covered = shallowRef<number>(0);
  const { height } = useElementSize(bar, undefined, { box: 'border-box' });
  const { height: viewHeight } = useWindowSize();
  let frame = 0;

  /** From the bar's top to the view's bottom; a stuck bar sits on that bottom, so this is its height. */
  function measureCovered(): void {
    frame = 0;
    const element = unrefElement(bar);
    if (!element)
      return;
    set(covered, Math.max(get(height), Math.ceil(get(viewHeight) - element.getBoundingClientRect().top)));
  }

  /** A resting bar moves with the page, so while it is in the band, follow it once per frame. */
  function scheduleMeasure(): void {
    if (get(belowView) && !frame)
      frame = requestAnimationFrame(measureCovered);
  }

  useEventListener('scroll', scheduleMeasure, { capture: true, passive: true });

  onMounted(() => {
    const element = get(sentinel);
    set(pageLevel, !!element && !findScroller(element));
  });

  useIntersectionObserver(sentinel, ([entry]) => {
    if (!entry)
      return;
    // no root bounds (a cross-origin frame) reads as not stuck, which leaves the floating parts where they are
    set(belowView, !entry.isIntersecting && entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? Number.POSITIVE_INFINITY));
  }, {
    // the view's bottom edge, raised by the band a resting bar covers
    rootMargin: () => `0px 0px -${Math.ceil(get(height)) + RESTING_CLEARANCE}px 0px`,
  });

  watch([belowView, height, viewHeight], () => measureCovered());

  watchEffect(() => {
    if (get(pageLevel) && toValue(canStick) && get(belowView) && get(height) > 0)
      stuckBarHeights.set(id, Math.max(get(height), get(covered)));
    else
      stuckBarHeights.delete(id);
    publishStickyBottom();
  });

  onScopeDispose(() => {
    if (frame)
      cancelAnimationFrame(frame);
    stuckBarHeights.delete(id);
    publishStickyBottom();
  });
}
