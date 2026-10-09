import type { MaybeRefOrGetter, Ref } from 'vue';

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
