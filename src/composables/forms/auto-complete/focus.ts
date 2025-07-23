import type { ComputedRef, MaybeRef, Ref } from 'vue';

export interface UseAutoCompleteFocusOptions {
  customValue: MaybeRef<boolean>;
  shouldApplyValueAsSearch: MaybeRef<boolean>;
  disabled: MaybeRef<boolean>;
}

export interface UseAutoCompleteFocusDeps<TItem> {
  activatorFocused: Ref<boolean>;
  activatorFocusedWithin: Ref<boolean>;
  focusedValueIndex: Ref<number>;
  filteredOptions: Ref<TItem[]>;
  internalSearch: Ref<string>;
  isOpen: Ref<boolean>;
  justOpened: Ref<boolean>;
  menuWrapperFocusedWithin: Ref<boolean>;
  searchInputFocused: Ref<boolean>;
  textInput: Ref<HTMLInputElement | undefined>;
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

export function useAutoCompleteFocus<TItem>(
  options: UseAutoCompleteFocusOptions,
  deps: UseAutoCompleteFocusDeps<TItem>,
): UseAutoCompleteFocusReturn {
  const anyFocused = computed<boolean>(() =>
    get(deps.activatorFocusedWithin) || get(deps.menuWrapperFocusedWithin),
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

  // Close menu if the activator is not focused anymore
  // Using debounced to avoid the menu closing momentarily while focus switches.
  watchDebounced(anyFocused, (focused) => {
    if (!focused) {
      set(deps.isOpen, false);

      const customValue = get(options.customValue);
      const filteredOptions = get(deps.filteredOptions);
      const internalSearch = get(deps.internalSearch);

      if (customValue && filteredOptions.length === 0 && internalSearch) {
        deps.setSearchAsValue();
      }

      const shouldApply = get(options.shouldApplyValueAsSearch);
      if (!shouldApply) {
        deps.updateInternalSearch();
      }
    }
  }, {
    debounce: 200,
    maxWait: 400,
  });

  return {
    anyFocused,
    inputClass,
    onActivatorFocused,
    onInputFocused,
    setInputFocus,
  };
}
