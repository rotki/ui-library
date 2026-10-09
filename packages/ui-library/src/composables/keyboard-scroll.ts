import type { ComputedRef, Ref } from 'vue';
import { useMutationObserver, useResizeObserver } from '@vueuse/core';

/** What a keyboard user can tab to inside a scrolling box, and so scroll it by. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type=hidden])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Whether a box scrolls while holding nothing a keyboard user can reach, the case WCAG 2.1.1 and
 * axe's scrollable-region-focusable rule cover: the arrow keys only scroll what has focus.
 *
 * @param element - the scrolling box
 * @returns true when the box overflows and has no focusable content
 */
export function needsOwnFocus(element: HTMLElement): boolean {
  const overflows = element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
  return overflows && element.querySelector(FOCUSABLE) === null;
}

/**
 * Makes a scrolling box a tab stop while, and only while, it overflows with nothing focusable
 * inside, so keyboard users can scroll it without a stray tab stop on every box that fits.
 *
 * @param target - the scrolling box
 * @returns the `tabindex` to bind on the box: 0 when it needs focus, otherwise undefined
 */
export function useKeyboardScroll(target: Readonly<Ref<HTMLElement | null | undefined>>): ComputedRef<0 | undefined> {
  const focusable = shallowRef<boolean>(false);
  let scheduled = false;

  function update(): void {
    scheduled = false;
    const element = get(target);
    set(focusable, element ? needsOwnFocus(element) : false);
  }

  /** Reading the scroll sizes forces layout, so a burst of resizes and mutations is checked once a frame. */
  function schedule(): void {
    if (scheduled)
      return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  // the first check runs at mount, so the box is reachable from its first render, not a frame later
  onMounted(update);
  useResizeObserver(target, schedule);
  // the box keeps its size while its content grows or swaps, which changes whether it overflows
  useMutationObserver(target, schedule, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'tabindex'] });

  return computed<0 | undefined>(() => (get(focusable) ? 0 : undefined));
}
