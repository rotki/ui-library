import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

interface UseTabScrollOptions {
  /** The scrollable bar container element */
  bar: Readonly<ShallowRef<HTMLDivElement | null>>;
  /** The wrapper element containing the tab buttons */
  wrapper: Readonly<ShallowRef<HTMLDivElement | null>>;
  /** Getter for the current vertical orientation state */
  vertical: MaybeRefOrGetter<boolean>;
}

interface UseTabScrollReturn {
  showArrows: Readonly<Ref<boolean>>;
  prevArrowDisabled: ComputedRef<boolean>;
  nextArrowDisabled: ComputedRef<boolean>;
  onPrevSliderClick: () => void;
  onNextSliderClick: () => void;
  keepActiveTabVisible: () => void;
}

/**
 * Composable that manages tab scroll behavior, overflow arrow visibility,
 * and active tab auto-scrolling for the RuiTabs component.
 */
export function useTabScroll({ bar, wrapper, vertical }: UseTabScrollOptions): UseTabScrollReturn {
  const showArrows = shallowRef<boolean>(false);

  const { width: barWidth, height: barHeight } = useElementSize(bar);
  const { arrivedState, x, y } = useScroll(bar, { behavior: 'smooth' });
  const { top, bottom, left, right } = toRefs(arrivedState);

  function checkOverflow(): void {
    const elem = get(wrapper);
    const barElem = get(bar);
    if (!elem || !barElem) {
      set(showArrows, false);
      return;
    }

    const overflows = toValue(vertical)
      ? elem.scrollHeight > barElem.offsetHeight
      : elem.scrollWidth > barElem.offsetWidth;

    set(showArrows, overflows);
  }

  useResizeObserver(bar, checkOverflow);
  useResizeObserver(wrapper, () => {
    checkOverflow();
    keepActiveTabVisible();
  });

  const prevArrowDisabled = computed<boolean>(() => toValue(vertical) ? get(top) : get(left));

  const nextArrowDisabled = computed<boolean>(() => toValue(vertical) ? get(bottom) : get(right));

  function scrollToActiveTab(): void {
    if (!get(showArrows))
      return;

    const elem = get(wrapper);
    const barElem = get(bar);

    if (!elem || !barElem)
      return;

    const activeTab = elem.querySelector<HTMLElement>('[data-active-tab]');

    if (!activeTab)
      return;

    const childLeft = activeTab.offsetLeft - elem.offsetLeft;
    const childTop = activeTab.offsetTop - elem.offsetTop;

    barElem.scrollTo({
      left: Math.max(Math.min(barElem.scrollLeft, childLeft), childLeft + activeTab.offsetWidth - barElem.offsetWidth),
      top: Math.max(Math.min(barElem.scrollTop, childTop), childTop + activeTab.offsetHeight - barElem.offsetHeight),
      behavior: 'smooth',
    });
  }

  function keepActiveTabVisible(): void {
    nextTick(scrollToActiveTab);
  }

  function onPrevSliderClick(): void {
    if (!toValue(vertical))
      set(x, get(x) - get(barWidth));
    else
      set(y, get(y) - get(barHeight));
  }

  function onNextSliderClick(): void {
    if (!toValue(vertical))
      set(x, get(x) + get(barWidth));
    else
      set(y, get(y) + get(barHeight));
  }

  return {
    showArrows: readonly(showArrows),
    prevArrowDisabled,
    nextArrowDisabled,
    onPrevSliderClick,
    onNextSliderClick,
    keepActiveTabVisible,
  };
}
