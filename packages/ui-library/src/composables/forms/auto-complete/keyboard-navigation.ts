import type { MaybeRef, Ref, TemplateRef } from 'vue';
import { get, set } from '@vueuse/shared';

export interface UseAutoCompleteKeyboardNavigationOptions {
  multiple: MaybeRef<boolean>;
  customValue: MaybeRef<boolean>;
}

export interface UseAutoCompleteKeyboardNavigationDeps<TItem> {
  internalSearch: Ref<string>;
  value: Ref<TItem[]>;
  filteredOptions: Ref<TItem[]>;
  options: Ref<TItem[]>;
  isOpen: Ref<boolean>;
  highlightedIndex: Ref<number>;
  searchInputFocused: Ref<boolean>;
  applyHighlighted: () => void;
  clear: () => void;
  setSearchAsValue: () => void;
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
  const chipElementsCache = ref<Map<number, HTMLElement>>(new Map());

  function setValueFocus(index: number): void {
    set(focusedValueIndex, index);
  }

  function moveSelectedValueHighlight(event: KeyboardEvent, next: boolean): void {
    const multiple = get(options.multiple);
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

  function onEnter(event: KeyboardEvent): void {
    const filteredOptions = get(deps.filteredOptions);
    const highlightedIndex = get(deps.highlightedIndex);
    const isOpen = get(deps.isOpen);
    const customValue = get(options.customValue);
    const multiple = get(options.multiple);
    const value = get(deps.value);
    const internalSearch = get(deps.internalSearch);

    // Check if we should use custom value
    if (customValue && internalSearch && isOpen) {
      // Check if any option exactly matches the search term
      let hasExactMatch = false;

      if (highlightedIndex > -1 && highlightedIndex < filteredOptions.length) {
        const highlightedOption = filteredOptions[highlightedIndex];
        if (typeof highlightedOption === 'string') {
          hasExactMatch = highlightedOption === internalSearch;
        }
        else if (highlightedOption && typeof highlightedOption === 'object') {
          const label = (highlightedOption as any).label || (highlightedOption as any).value || '';
          hasExactMatch = label === internalSearch;
        }
      }

      // If no exact match with highlighted option, use custom value
      if (!hasExactMatch) {
        deps.setSearchAsValue();
        if (!multiple)
          set(deps.isOpen, false);
        event.preventDefault();
        return;
      }
    }

    if (filteredOptions.length > 0 && highlightedIndex > -1 && isOpen) {
      deps.applyHighlighted();
      event.preventDefault();
    }
    else if (filteredOptions.length === 0 && customValue && internalSearch) {
      deps.setSearchAsValue();
      if (!multiple)
        set(deps.isOpen, false);
      event.preventDefault();
    }
    else if (!isOpen && value.length === 0) {
      set(deps.isOpen, true);
      event.preventDefault();
    }
    else {
      const activator = get(deps.activator);
      const form = activator?.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  }

  function onTab(event: KeyboardEvent): void {
    const isOpen = get(deps.isOpen);
    const filteredOptions = get(deps.filteredOptions);
    const highlightedIndex = get(deps.highlightedIndex);
    const multiple = get(options.multiple);

    if (isOpen && filteredOptions.length > 0 && highlightedIndex > -1 && !multiple) {
      deps.applyHighlighted();
      event.preventDefault();
    }
  }

  function onInputDeletePressed(): void {
    const internalSearch = get(deps.internalSearch);
    const value = get(deps.value);
    const total = value.length;
    const multiple = get(options.multiple);

    if (!internalSearch && total > 0) {
      if (multiple)
        set(focusedValueIndex, total - 1);
      else deps.clear();
    }
  }

  // Watch value changes to reset focused index and clear cache
  watch(deps.value, () => {
    setValueFocus(-1);
    get(chipElementsCache).clear();
  });

  // Watch focused value index to handle chip focus
  watch(focusedValueIndex, async (index) => {
    const multiple = get(options.multiple);
    if (index === -1 || !multiple)
      return;

    await nextTick(() => {
      const cache = get(chipElementsCache);
      let activeChip = cache.get(index);

      if (!activeChip) {
        const activator = get(deps.activator);
        const element = activator?.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
        if (element) {
          activeChip = element;
          cache.set(index, element);
        }
      }

      if (activeChip && 'focus' in activeChip && typeof activeChip.focus === 'function')
        activeChip.focus();
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
