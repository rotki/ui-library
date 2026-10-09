import type { MaybeRefOrGetter, ShallowRef } from 'vue';

interface UseTabKeyboardOptions {
  /** The tablist element */
  wrapper: Readonly<ShallowRef<HTMLDivElement | null>>;
  /** Whether the tabs run top to bottom, which moves with the up and down arrows */
  vertical: MaybeRefOrGetter<boolean>;
}

interface UseTabKeyboardReturn {
  onKeydown: (event: KeyboardEvent) => void;
}

/**
 * The index a key moves to among `count` tabs, wrapping at both ends.
 *
 * @param step - -1 or 1 for the arrows, or `first` and `last` for Home and End
 * @param current - the focused tab's index
 * @param count - the number of enabled tabs
 * @returns the index to move to
 */
function targetIndex(step: -1 | 1 | 'first' | 'last', current: number, count: number): number {
  if (step === 'first')
    return 0;
  if (step === 'last')
    return count - 1;
  return (current + step + count) % count;
}

/**
 * The WAI-ARIA tabs keys: the arrows along the bar move to the next or
 * previous enabled tab and select it, Home and End jump to the ends. Selecting
 * goes through a click, so a link tab navigates as it would with the mouse.
 */
export function useTabKeyboard({ wrapper, vertical }: UseTabKeyboardOptions): UseTabKeyboardReturn {
  function steps(list: HTMLElement): Record<string, -1 | 1 | 'first' | 'last'> {
    if (toValue(vertical))
      return { ArrowUp: -1, ArrowDown: 1, Home: 'first', End: 'last' };

    const rtl = getComputedStyle(list).direction === 'rtl';
    return { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, Home: 'first', End: 'last' };
  }

  function onKeydown(event: KeyboardEvent): void {
    const list = get(wrapper);
    const step = list ? steps(list)[event.key] : undefined;
    if (!list || step === undefined)
      return;

    const enabled = [...list.querySelectorAll<HTMLElement>('[role=tab]:not([disabled]):not([aria-disabled=true])')];
    // the key lands on the focused tab
    const focused = event.target;
    const current = focused instanceof HTMLElement ? enabled.indexOf(focused) : -1;
    if (current === -1)
      return;

    const tab = enabled[targetIndex(step, current, enabled.length)];
    if (!tab)
      return;

    event.preventDefault();
    tab.focus();
    tab.click();
  }

  return { onKeydown };
}
