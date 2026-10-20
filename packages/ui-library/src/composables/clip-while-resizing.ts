import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';

/** A little past the 200ms height transition, for when no `transitionend` arrives. */
const SETTLE_FALLBACK_MS = 300;

/**
 * Whether a box that animates its height should clip its content right now.
 *
 * A permanent `overflow: hidden` makes the box the scroll container of everything inside it, so a
 * `position: sticky` child sticks to the box and never to the page. This clips only while the
 * height changes: from the moment the height value changes until the box's `height` transition
 * ends. The timer covers a change that runs no transition (reduced motion, a hidden box, an equal
 * computed height), which fires no `transitionend`.
 *
 * @param element - the box whose `height` transitions
 * @param height - the height the box is given; any change starts a clip
 * @returns true while the height is changing
 */
export function useClipWhileResizing(
  element: Readonly<Ref<HTMLElement | null>>,
  height: MaybeRefOrGetter<string | number>,
): ComputedRef<boolean> {
  const resizing = shallowRef<boolean>(false);

  const { start, stop } = useTimeoutFn(() => {
    set(resizing, false);
  }, SETTLE_FALLBACK_MS, { immediate: false });

  watch(() => toValue(height), () => {
    set(resizing, true);
    start();
  });

  /**
   * Ends the clip when the box's own height transition ends; a child's transition bubbles up too.
   *
   * @param event - the transition event that reached the box
   */
  function settle(event: TransitionEvent): void {
    if (event.target !== get(element) || event.propertyName !== 'height')
      return;
    stop();
    set(resizing, false);
  }

  useEventListener(element, 'transitionend', settle);
  useEventListener(element, 'transitioncancel', settle);

  return computed<boolean>(() => get(resizing));
}
