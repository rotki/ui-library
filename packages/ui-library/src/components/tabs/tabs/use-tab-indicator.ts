import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';
import { TabVariant } from '@/components/tabs/tab-props';

interface UseTabIndicatorOptions {
  /** The scrolling bar, the indicator's positioning context */
  bar: Readonly<ShallowRef<HTMLDivElement | null>>;
  /** The tablist inside the bar */
  wrapper: Readonly<ShallowRef<HTMLDivElement | null>>;
  /** Whether the tabs run top to bottom, so the underline follows their height */
  vertical: MaybeRefOrGetter<boolean>;
  /** The bar's look, which decides whether the indicator is a line or a pill */
  variant: MaybeRefOrGetter<TabVariant>;
}

interface UseTabIndicatorReturn {
  /** The indicator's box, or undefined while no tab is active */
  style: ComputedRef<CSSProperties | undefined>;
  /** False until the first placement, so the indicator appears in place rather than sliding in */
  animated: Readonly<Ref<boolean>>;
  update: () => void;
}

interface TabRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Tracks the active tab's box so one indicator can slide between tabs. It lives
 * in the bar, next to the tablist, so it scrolls with the tabs while the
 * tablist holds only tabs. The underline takes the tab's span along the bar;
 * the segmented pill takes its whole box.
 */
export function useTabIndicator({ bar, wrapper, vertical, variant }: UseTabIndicatorOptions): UseTabIndicatorReturn {
  const rect = shallowRef<TabRect>();
  const animated = shallowRef<boolean>(false);

  function update(): void {
    const tab = get(bar)?.querySelector<HTMLElement>('[role=tab][data-active-tab]');
    if (!tab) {
      set(rect, undefined);
      return;
    }

    set(rect, { left: tab.offsetLeft, top: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight });

    if (!get(animated))
      requestAnimationFrame(() => set(animated, true));
  }

  const style = computed<CSSProperties | undefined>(() => {
    const box = get(rect);
    if (!box)
      return undefined;

    const px = (value: number): string => `${value}px`;
    if (toValue(variant) === TabVariant.segmented)
      return { left: px(box.left), top: px(box.top), width: px(box.width), height: px(box.height) };

    return toValue(vertical)
      ? { top: px(box.top), height: px(box.height) }
      : { left: px(box.left), width: px(box.width) };
  });

  useResizeObserver(wrapper, update);
  useMutationObserver(wrapper, update, { subtree: true, attributes: true, attributeFilter: ['data-active-tab'], childList: true });

  onMounted(() => {
    update();
    // a web font that loads later changes every label's width
    document.fonts?.ready.then(update).catch(() => {});
  });

  return { style, animated: readonly(animated), update };
}
