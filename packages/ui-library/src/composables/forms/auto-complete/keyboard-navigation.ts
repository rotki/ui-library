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
  searchInputFocused: Ref<boolean>;
  applyHighlighted: () => void;
  clear: () => void;
  removeValue: (item: TItem) => void;
  setSearchAsValue: () => void;
  getText: (item: TItem) => string | undefined;
  activator: Ref<HTMLElement | undefined> | TemplateRef<HTMLElement>;
}

export interface UseAutoCompleteKeyboardNavigationReturn {
  focusedValueIndex: Ref<number>;
  moveSelectedValueHighlight: (event: KeyboardEvent, next: boolean) => void;
  onEnter: (event: KeyboardEvent) => void;
  onTab: (event: KeyboardEvent) => void;
  onInputDeletePressed: () => void;
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

  function onEnter(event: KeyboardEvent): void {
    const filteredOptions = get(deps.filteredOptions);
    const highlightedIndex = get(deps.highlightedIndex);
    const isOpen = get(deps.isOpen);
    const customValue = toValue(options.customValue);
    const multiple = toValue(options.multiple);
    const internalSearch = get(deps.internalSearch);
    const hasHighlighted = highlightedIndex > -1 && filteredOptions.length > 0;

    // Custom value: use search text if highlighted option doesn't exactly match
    if (customValue && internalSearch && isOpen && !highlightedMatchesSearch(filteredOptions, highlightedIndex, internalSearch))
      return applyCustomValue(event, multiple);

    // Apply highlighted option
    if (hasHighlighted && isOpen) {
      deps.applyHighlighted();
      return event.preventDefault();
    }

    // No options but custom value allowed: use search text
    if (filteredOptions.length === 0 && customValue && internalSearch)
      return applyCustomValue(event, multiple);

    // Nothing selected, menu closed: open menu
    if (!isOpen && get(deps.value).length === 0) {
      set(deps.isOpen, true);
      return event.preventDefault();
    }

    // Fallback: submit parent form
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

  function onInputDeletePressed(): void {
    const internalSearch = get(deps.internalSearch);
    const value = get(deps.value);
    const total = value.length;
    const multiple = toValue(options.multiple);

    if (!internalSearch && total > 0) {
      if (multiple) {
        if (toValue(options.chips)) {
          set(focusedValueIndex, total - 1);
        }
        else {
          const lastItem = value[total - 1];
          if (lastItem !== undefined)
            deps.removeValue(lastItem);
        }
      }
      else {
        deps.clear();
      }
    }
  }

  // Watch value changes to reset focused index
  watch(deps.value, () => {
    setValueFocus(-1);
  });

  // Watch focused value index to handle chip focus
  watch(focusedValueIndex, async (index) => {
    const multiple = toValue(options.multiple);
    if (index === -1 || !multiple)
      return;

    await nextTick(() => {
      const activator = get(deps.activator);
      const element = activator?.querySelector<HTMLElement>(`[data-index="${index}"]`);
      element?.focus();
    });
  });

  return {
    focusedValueIndex,
    moveSelectedValueHighlight,
    onEnter,
    onInputDeletePressed,
    onTab,
    setValueFocus,
  };
}
