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
  /** Whether the user is searching: the input has focus and is not just showing a picked value. */
  editing: ComputedRef<boolean>;
  inputClass: ComputedRef<string>;
  onInputFocused: () => void;
  onSettledKeydown: (event: KeyboardEvent) => void;
  setInputFocus: () => Promise<void>;
  settleOnInput: () => void;
  unsettle: () => void;
}

export function useAutoCompleteFocus(
  options: UseAutoCompleteFocusOptions,
  deps: UseAutoCompleteFocusDeps,
): UseAutoCompleteFocusReturn {
  /**
   * The input holds focus after a pick, as the combobox, but shows the picked value rather than an
   * empty search until the user types, clicks or opens the list again.
   */
  const settled = shallowRef<boolean>(false);

  const anyFocused = computed<boolean>(
    () => get(deps.activatorFocusedWithin) || get(deps.menuWrapperFocusedWithin),
  );

  const editing = computed<boolean>(() => get(deps.searchInputFocused) && !get(settled));

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

  function unsettle(): void {
    set(settled, false);
  }

  /** Puts focus on the input, as the combobox, while it keeps showing the value just picked. */
  function settleOnInput(): void {
    set(settled, true);
    set(deps.searchInputFocused, true);
  }

  /**
   * The first character typed after a pick replaces the shown value, as it would after tabbing in,
   * rather than adding to it.
   *
   * @param event - the key press on the input
   */
  function onSettledKeydown(event: KeyboardEvent): void {
    if (!get(settled) || event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey)
      return;
    get(deps.textInput)?.select();
    unsettle();
  }

  async function setInputFocus(): Promise<void> {
    unsettle();
    await nextTick(() => {
      set(deps.searchInputFocused, true);
    });
  }

  function onInputFocused(): void {
    set(deps.focusedValueIndex, -1);

    // focus coming back after a pick keeps the value as it is, unselected
    const shouldApply = toValue(options.shouldApplyValueAsSearch);
    if (shouldApply && !get(settled)) {
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
    if (focused)
      return;
    unsettle();
    if (toValue(options.customValue))
      pendingCustomSearch = get(deps.internalSearch);
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
    editing,
    inputClass,
    onInputFocused,
    onSettledKeydown,
    setInputFocus,
    settleOnInput,
    unsettle,
  };
}
