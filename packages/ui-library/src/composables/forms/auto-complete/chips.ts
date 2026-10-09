export interface UseAutoCompleteChipsDeps<TItem> {
  /** Moves focus to the search input, which keeps it while a chip is selected. */
  focusInput: () => void;
  getIdentifier: (item: TItem) => unknown;
  /** Toggles an item in the selection, which removes a chip's item. */
  setValue: (item: TItem) => void;
  setValueFocus: (index: number) => void;
}

export interface UseAutoCompleteChipsReturn<TItem> {
  chipAttrs: (item: TItem, index: number) => Record<string, unknown>;
  /** Selects a clicked chip for Backspace and the arrow keys, with focus left in the input. */
  selectChip: (index: number) => void;
}

/**
 * The attributes and handlers each selected chip takes. A chip never takes focus: the input keeps
 * it, where no browser shortcut can claim Backspace, and the chip the keys act on is only drawn as
 * selected. A click selects a chip and its close button removes it.
 *
 * @param deps - the selection operations the handlers call
 * @returns a function building one chip's attributes, and the click selection
 */
export function useAutoCompleteChips<TItem>(deps: UseAutoCompleteChipsDeps<TItem>): UseAutoCompleteChipsReturn<TItem> {
  /**
   * Focuses the input before selecting, since the input's focus handler clears any selection.
   *
   * @param index - the clicked chip's place among the values
   */
  function selectChip(index: number): void {
    deps.focusInput();
    deps.setValueFocus(index);
  }

  function chipAttrs(item: TItem, index: number): Record<string, unknown> {
    return {
      'data-index': index,
      'data-value': deps.getIdentifier(item),
      'onClick': (event: MouseEvent): void => {
        event.stopPropagation();
        selectChip(index);
      },
      'onClick:close': (): void => {
        deps.focusInput();
        deps.setValue(item);
      },
    };
  }

  return { chipAttrs, selectChip };
}
