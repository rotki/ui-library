import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue';
import { get, set } from '@vueuse/shared';

export interface UseAutoCompleteKeyboardNavigationOptions {
  /** Whether multiple items can be selected. */
  multiple: MaybeRefOrGetter<boolean>;
  /** Whether custom (free-text) values are allowed. */
  customValue: MaybeRefOrGetter<boolean>;
  /** Whether selected values are displayed as chips. */
  chips: MaybeRefOrGetter<boolean>;
}

export interface UseAutoCompleteKeyboardNavigationDeps<TItem> {
  internalSearch: Ref<string>;
  value: Ref<TItem[]>;
  filteredOptions: Ref<TItem[]>;
  isOpen: Ref<boolean>;
  highlightedIndex: Ref<number>;
  userNavigated: Ref<boolean>;
  searchInputFocused: Ref<boolean>;
  applyHighlighted: () => void;
  clear: () => void;
  removeValue: (item: TItem) => void;
  setSearchAsValue: () => void;
  getText: (item: TItem) => string | undefined;
  updateInternalSearch: (value?: string) => void;
  activator: Ref<HTMLElement | undefined> | TemplateRef<HTMLElement>;
}

export interface UseAutoCompleteKeyboardNavigationReturn {
  /**
   * The selected value (a chip) that Backspace or Delete would remove, -1 for none. It is only
   * drawn as selected: focus stays in the input, where no browser shortcut takes the key.
   */
  focusedValueIndex: Ref<number>;
  moveSelectedValueHighlight: (event: KeyboardEvent, next: boolean) => void;
  onEnter: (event: KeyboardEvent) => void;
  onTab: (event: KeyboardEvent) => void;
  onInputDeletePressed: (event: KeyboardEvent) => void;
  /** Drops the value selection on any key that does not act on it. */
  onInputKeydown: (event: KeyboardEvent) => void;
  setValueFocus: (index: number) => void;
}

export function useAutoCompleteKeyboardNavigation<TItem>(
  options: UseAutoCompleteKeyboardNavigationOptions,
  deps: UseAutoCompleteKeyboardNavigationDeps<TItem>,
): UseAutoCompleteKeyboardNavigationReturn {
  const focusedValueIndex = ref<number>(-1);

  function setValueFocus(index: number): void {
    set(focusedValueIndex, index);
  }

  function moveSelectedValueHighlight(event: KeyboardEvent, next: boolean): void {
    const multiple = toValue(options.multiple);
    const internalSearchValue = get(deps.internalSearch);

    if (!multiple || internalSearchValue.length > 0)
      return;

    event.preventDefault();
    const total = get(deps.value).length;

    let current = get(focusedValueIndex);

    if (current === -1) {
      set(focusedValueIndex, next ? 0 : total - 1);
      return;
    }

    const move = next ? 1 : -1;
    current += move;

    if (current < 0 || current >= total) {
      set(focusedValueIndex, -1);
      set(deps.searchInputFocused, true);
    }
    else {
      set(focusedValueIndex, current);
    }
  }

  function highlightedMatchesSearch(filteredOptions: TItem[], highlightedIndex: number, search: string): boolean {
    if (highlightedIndex < 0 || highlightedIndex >= filteredOptions.length)
      return false;

    const option = filteredOptions[highlightedIndex];
    if (typeof option === 'string')
      return option === search;

    if (option && typeof option === 'object')
      return (deps.getText(option) ?? '') === search;

    return false;
  }

  function applyCustomValue(event: KeyboardEvent, multiple: boolean): void {
    deps.setSearchAsValue();
    if (!multiple)
      set(deps.isOpen, false);
    event.preventDefault();
  }

  function submitClosestForm(): void {
    const activator = get(deps.activator);
    const form = activator?.closest('form');
    form?.dispatchEvent(new Event('submit'));
  }

  function tryApplyHighlight(event: KeyboardEvent): boolean {
    const filteredOptions = get(deps.filteredOptions);
    const highlightedIndex = get(deps.highlightedIndex);
    if (highlightedIndex <= -1 || filteredOptions.length === 0)
      return false;

    deps.applyHighlighted();
    event.preventDefault();
    return true;
  }

  function tryApplyCustom(event: KeyboardEvent, requireEmptyOptions: boolean): boolean {
    const customValue = toValue(options.customValue);
    const internalSearch = get(deps.internalSearch);
    if (!customValue || !internalSearch)
      return false;

    const filteredOptions = get(deps.filteredOptions);
    if (requireEmptyOptions) {
      if (filteredOptions.length > 0)
        return false;
    }
    else {
      const highlightedIndex = get(deps.highlightedIndex);
      if (highlightedMatchesSearch(filteredOptions, highlightedIndex, internalSearch))
        return false;
    }

    applyCustomValue(event, toValue(options.multiple));
    return true;
  }

  /**
   * Enter with the menu open, which takes the option the user navigated to
   * before anything the component highlighted on its own.
   */
  function handleOpenMenuEnter(event: KeyboardEvent): boolean {
    if (get(deps.userNavigated) && tryApplyHighlight(event))
      return true;

    // Fall back to a typed custom value when it differs from the highlight.
    if (tryApplyCustom(event, false))
      return true;

    // Use the (auto-)highlighted option if there is one.
    if (tryApplyHighlight(event))
      return true;

    // No options matched but custom values are allowed — accept the typed text.
    return tryApplyCustom(event, true);
  }

  function onEnter(event: KeyboardEvent): void {
    if (get(deps.isOpen)) {
      if (handleOpenMenuEnter(event))
        return;

      // Open with nothing to act on, so Enter is swallowed rather than submitting a surrounding form
      event.preventDefault();
      return;
    }

    // Nothing selected, menu closed: open menu
    if (get(deps.value).length === 0) {
      set(deps.isOpen, true);
      return event.preventDefault();
    }

    // Menu closed with a value selected: let Enter submit the parent form.
    submitClosestForm();
  }

  function onTab(event: KeyboardEvent): void {
    const isOpen = get(deps.isOpen);
    const filteredOptions = get(deps.filteredOptions);
    const highlightedIndex = get(deps.highlightedIndex);
    const multiple = toValue(options.multiple);

    if (isOpen && filteredOptions.length > 0 && highlightedIndex > -1 && !multiple) {
      deps.applyHighlighted();
      event.preventDefault();
    }
  }

  /**
   * Removes the selected value. Alt with it, where custom values are accepted, puts the value's
   * text back in the search instead of dropping it.
   *
   * @param event - the Backspace or Delete press
   * @param item - the value the highlighted chip stands for
   */
  function removeSelectedValue(event: KeyboardEvent, item: TItem): void {
    event.preventDefault();
    set(focusedValueIndex, -1);
    deps.removeValue(item);
    if (event.altKey && toValue(options.customValue))
      deps.updateInternalSearch(deps.getText(item) ?? '');
  }

  /** Backspace or Delete with nothing typed: steps onto the last value, or drops it outright. */
  function deleteFromEmptySearch(value: TItem[]): void {
    if (!toValue(options.multiple)) {
      deps.clear();
      return;
    }
    if (toValue(options.chips)) {
      set(focusedValueIndex, value.length - 1);
      return;
    }
    const lastItem = value.at(-1);
    if (lastItem !== undefined)
      deps.removeValue(lastItem);
  }

  function onInputDeletePressed(event: KeyboardEvent): void {
    const value = get(deps.value);
    const selected = value[get(focusedValueIndex)];
    if (selected !== undefined) {
      removeSelectedValue(event, selected);
      return;
    }

    if (!get(deps.internalSearch) && value.length > 0)
      deleteFromEmptySearch(value);
  }

  function onInputKeydown(event: KeyboardEvent): void {
    if (get(focusedValueIndex) === -1)
      return;
    // a modifier pressed on its own (the Alt of Alt + Backspace) keeps the selection for the key it modifies
    const keepsSelection = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Alt', 'AltGraph', 'Control', 'Meta', 'Shift'].includes(event.key);
    if (!keepsSelection)
      set(focusedValueIndex, -1);
  }

  // Watch value changes to reset focused index
  watch(deps.value, () => {
    setValueFocus(-1);
  });

  return {
    // eslint-disable-next-line @rotki/composable-return-readonly -- written by focus.ts onInputFocused
    focusedValueIndex,
    moveSelectedValueHighlight,
    onEnter,
    onInputDeletePressed,
    onInputKeydown,
    onTab,
    setValueFocus,
  };
}
