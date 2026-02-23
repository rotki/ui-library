import type { ComputedRef, MaybeRef, Ref, TemplateRef } from 'vue';

export interface UseAutoCompleteFocusOptions {
  /** Whether custom (free-text) values are allowed. */
  customValue: MaybeRef<boolean>;
  /** Whether to apply the current value as the search text when focused. */
  shouldApplyValueAsSearch: MaybeRef<boolean>;
  /** Whether the autocomplete is disabled. */
  disabled: MaybeRef<boolean>;
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
    const isDisabled = get(options.disabled);
    const shouldApply = get(options.shouldApplyValueAsSearch);
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

    const shouldApply = get(options.shouldApplyValueAsSearch);
    if (shouldApply) {
      const textInput = get(deps.textInput);
      textInput?.select();
    }

    if (!get(deps.isOpen)) {
      set(deps.justOpened, true);
    }
  }

  // Capture the search value immediately when focus is lost, before the debounced
  // handler fires. Other watchers (value.ts) may clear internalSearch when isOpen
  // changes, so we need to preserve it for the custom value blur flow.
  let pendingCustomSearch = '';

  watch(anyFocused, (focused) => {
    if (!focused && get(options.customValue)) {
      pendingCustomSearch = get(deps.internalSearch);
    }
  });

  // Close menu if the activator is not focused anymore
  // Using debounced to avoid the menu closing momentarily while focus switches.
  watchDebounced(
    anyFocused,
    (focused) => {
      if (!focused) {
        set(deps.isOpen, false);

        const customValue = get(options.customValue);
        const searchToUse = pendingCustomSearch;
        pendingCustomSearch = '';

        if (customValue && searchToUse) {
          deps.updateInternalSearch(searchToUse);
          deps.setSearchAsValue();
        }

        const shouldApply = get(options.shouldApplyValueAsSearch);
        if (!shouldApply) {
          deps.updateInternalSearch();
        }
      }
    },
    {
      debounce: 200,
      maxWait: 400,
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
