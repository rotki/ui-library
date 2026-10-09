import type { ComputedRef, Ref } from 'vue';

export interface UseAutoCompleteSelectionDeps<TItem> {
  value: Ref<TItem[]>;
  multiple: ComputedRef<boolean>;
  /** Whether a single pick shows its text in the input, rather than a slot or chip drawing it. */
  shouldApplyValueAsSearch: ComputedRef<boolean>;
  isOpen: Ref<boolean>;
  searchInputFocused: Ref<boolean>;
  internalSearch: Ref<string>;
  /** The item's place in the selection, -1 when it is not picked. */
  itemIndexInValue: (item: TItem) => number;
  getText: (item: TItem) => string | undefined;
  textValueToProperValue: (text: string) => TItem;
  updateInternalSearch: (value?: string) => void;
  /** Keeps focus on the input after a pick, showing the value rather than an empty search. */
  settleOnInput: () => void;
  /** Empties the model: an empty list when several values are picked, undefined otherwise. */
  resetModel: () => void;
}

export interface UseAutoCompleteSelectionReturn<TItem> {
  /**
   * Picks an item, or drops it when several values are picked and it already is one.
   * `skipRefocused` leaves focus where it is, for a value set from typed text.
   */
  setValue: (item: TItem, skipRefocused?: boolean) => Promise<void>;
  /** Turns the typed search into a value, where custom values are accepted. */
  setSearchAsValue: () => void;
  clear: () => void;
}

/**
 * The changes to the auto-complete's selection: picking or dropping an item, taking the typed text
 * as a value, and clearing, with the search and focus that follow each.
 *
 * @param deps - the selection state and the operations it calls
 * @returns the selection operations
 */
export function useAutoCompleteSelection<TItem>(deps: UseAutoCompleteSelectionDeps<TItem>): UseAutoCompleteSelectionReturn<TItem> {
  function toggleInSelection(item: TItem): void {
    const newValue = [...get(deps.value)];
    const indexInValue = deps.itemIndexInValue(item);
    if (indexInValue === -1) {
      deps.updateInternalSearch();
      newValue.push(item);
    }
    else {
      newValue.splice(indexInValue, 1);
    }
    set(deps.value, newValue);
  }

  function replaceSelection(item: TItem): void {
    if (get(deps.shouldApplyValueAsSearch))
      deps.updateInternalSearch(deps.getText(item));
    else deps.updateInternalSearch();
    set(deps.value, [item]);
  }

  async function setValue(item: TItem, skipRefocused = false): Promise<void> {
    if (get(deps.multiple)) {
      toggleInSelection(item);
      if (!skipRefocused)
        set(deps.searchInputFocused, true);
      return;
    }

    replaceSelection(item);
    if (skipRefocused) {
      set(deps.isOpen, false);
      return;
    }
    // focus stays on the combobox, which keeps showing the value just picked
    deps.settleOnInput();
    await nextTick(() => {
      set(deps.isOpen, false);
    });
  }

  function setSearchAsValue(): void {
    const searchToBeValue = get(deps.internalSearch);
    if (!searchToBeValue)
      return;

    setValue(deps.textValueToProperValue(searchToBeValue), true);
  }

  function clear(): void {
    deps.updateInternalSearch();
    deps.resetModel();
  }

  return { clear, setSearchAsValue, setValue };
}
