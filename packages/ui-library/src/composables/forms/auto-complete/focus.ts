import type { ComputedRef, MaybeRefOrGetter, Ref, TemplateRef } from 'vue';

export interface UseAutoCompleteFocusOptions {
  /** Whether custom (free-text) values are allowed. */
  customValue: MaybeRefOrGetter<boolean>;
  /** Whether to apply the current value as the search text when focused. */
  shouldApplyValueAsSearch: MaybeRefOrGetter<boolean>;
  /** Whether the autocomplete is disabled. */
  disabled: MaybeRefOrGetter<boolean>;
}

export interface UseAutoCompleteFocusDeps {
  activatorFocused: Ref<boolean>;
  activatorFocusedWithin: Ref<boolean>;
  focusedValueIndex: Ref<number>;
  internalSearch: Ref<string>;
  isOpen: Ref<boolean>;
  justOpened: Ref<boolean>;
  menuWrapperFocusedWithin: Ref<boolean>;
  searchInputFocused: Ref<boolean>;
  textInput: Ref<HTMLInputElement | undefined> | TemplateRef<HTMLInputElement>;
  setSearchAsValue: () => void;
  updateInternalSearch: (value?: string) => void;
}

export interface UseAutoCompleteFocusReturn {
  anyFocused: ComputedRef<boolean>;
  inputClass: ComputedRef<string>;
  onActivatorFocused: () => Promise<void>;
  onInputFocused: () => void;
  setInputFocus: () => Promise<void>;
}

export function useAutoCompleteFocus(
  options: UseAutoCompleteFocusOptions,
  deps: UseAutoCompleteFocusDeps,
): UseAutoCompleteFocusReturn {
  const anyFocused = computed<boolean>(
    () => get(deps.activatorFocusedWithin) || get(deps.menuWrapperFocusedWithin),
  );

  const inputClass = computed<string>(() => {
    const isFocused = get(anyFocused);
    const isDisabled = toValue(options.disabled);
    const shouldApply = toValue(options.shouldApplyValueAsSearch);
    const hasSearch = get(deps.internalSearch);

    if ((!isFocused || isDisabled) && !shouldApply)
      return 'w-0 h-0';
    if (hasSearch)
      return 'flex-1 min-w-[4rem]';
    return 'flex-1 min-w-0';
  });

  async function setInputFocus(): Promise<void> {
    await nextTick(() => {
      set(deps.searchInputFocused, true);
    });
  }

  async function onActivatorFocused(): Promise<void> {
    await nextTick(() => {
      if (!get(deps.activatorFocused)) {
        set(deps.searchInputFocused, true);
      }
    });
  }

  function onInputFocused(): void {
    set(deps.focusedValueIndex, -1);

    const shouldApply = toValue(options.shouldApplyValueAsSearch);
    if (shouldApply) {
      const textInput = get(deps.textInput);
      textInput?.select();
    }

    if (!get(deps.isOpen)) {
      set(deps.justOpened, true);
    }
  }

  /**
   * The search text as it stood when focus was lost, kept for the custom-value
   * blur flow: it is captured before the debounced handler runs, because the
   * watchers in value.ts clear the search when the menu closes.
   */
  let pendingCustomSearch = '';

  watch(anyFocused, (focused) => {
    if (!focused && toValue(options.customValue)) {
      pendingCustomSearch = get(deps.internalSearch);
    }
  });

  // Debounced, so the menu does not close for a moment while focus moves between its own elements
  watchDebounced(
    anyFocused,
    (focused) => {
      if (!focused) {
        set(deps.isOpen, false);

        const customValue = toValue(options.customValue);
        const searchToUse = pendingCustomSearch;
        pendingCustomSearch = '';

        if (customValue && searchToUse) {
          deps.updateInternalSearch(searchToUse);
          deps.setSearchAsValue();
        }

        const shouldApply = toValue(options.shouldApplyValueAsSearch);
        if (!shouldApply) {
          deps.updateInternalSearch();
        }
      }
    },
    {
      debounce: 100,
      maxWait: 200,
    },
  );

  return {
    anyFocused,
    inputClass,
    onActivatorFocused,
    onInputFocused,
    setInputFocus,
  };
}
