import type { ComputedRef, MaybeRefOrGetter } from 'vue';

export interface UseAutoCompleteComboboxReturn {
  /** Prefix of each option's id, an option's id being `${prefix}-${index}` in the flat option list. */
  optionIdPrefix: string;
  /** The highlighted option, which a screen reader announces while focus stays in the input. */
  activeDescendant: ComputedRef<string | undefined>;
}

/**
 * The ARIA 1.2 combobox wiring of the auto-complete: the input is the combobox, and since focus
 * never leaves it while the user arrows through the list, it names the highlighted option.
 *
 * @param isOpen - whether the listbox is open
 * @param highlightedIndex - the highlighted option's place in the flat option list, -1 for none
 * @returns the option id prefix and the active descendant to bind on the input
 */
export function useAutoCompleteCombobox(
  isOpen: MaybeRefOrGetter<boolean>,
  highlightedIndex: MaybeRefOrGetter<number>,
): UseAutoCompleteComboboxReturn {
  const optionIdPrefix = useId();

  const activeDescendant = computed<string | undefined>(() => {
    const index = toValue(highlightedIndex);
    return toValue(isOpen) && index > -1 ? `${optionIdPrefix}-${index}` : undefined;
  });

  return { activeDescendant, optionIdPrefix };
}

/**
 * Splits a caller's attributes between the visual box and the input, which is the combobox: an
 * `aria-label` or `aria-describedby` passed to the component has to name the combobox.
 *
 * @param attrs - the attributes passed to the component
 * @param aria - true for the `aria-*` ones, false for the rest
 * @returns the matching attributes
 */
export function splitAriaAttrs(attrs: Record<string, unknown>, aria: boolean): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('aria-') === aria));
}
