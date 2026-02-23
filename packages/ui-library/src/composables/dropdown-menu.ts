import type { Ref, TemplateRef } from 'vue';

export type KeyOfType<T, V> = T extends string | number | boolean | symbol | null | undefined
  ? never
  : V extends object
    ? keyof T
    : keyof {
      [P in keyof T as T[P] extends V ? P : V extends T[P] ? P : never]: any;
    };

export interface DropdownItemAttr<TValue, TItem> {
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem | ((item: TItem) => string);
}

export interface DropdownOptions<TValue, TItem> {
  options: Ref<TItem[]>;
  dense?: Ref<boolean>;
  disabled?: Ref<boolean>;
  value: Ref<TItem | TItem[] | undefined>;
  menuRef: Ref<HTMLElement> | TemplateRef<HTMLElement>;
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem | ((item: TItem) => string);
  appendWidth?: number;
  prependWidth?: number;
  itemHeight?: number;
  overscan?: number;
  autoSelectFirst?: boolean;
  autoFocus?: boolean;
  setValue?: (val: TItem) => void;
  hideSelected?: boolean;
  isOpen?: Ref<boolean>;
  getText?: (item: TItem) => string | undefined;
  getIdentifier?: (item: TItem) => any;
}

export function useDropdownOptionProperty<TValue, TItem>({
  keyAttr,
  textAttr,
}: DropdownItemAttr<TValue, TItem>) {
  function getText(item: TItem): string | undefined {
    if (textAttr) {
      if (typeof textAttr === 'function')
        return textAttr(item);
      else return item[textAttr]?.toString();
    }

    return item?.toString();
  }

  function getIdentifier(
    item: TItem,
  ): TItem | TItem[KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>] {
    if (keyAttr)
      return item[keyAttr];

    return item;
  }

  return {
    getIdentifier,
    getText,
  };
}

function toSelectedArray<TItem>(val: TItem | TItem[] | undefined): TItem[] {
  if (Array.isArray(val))
    return val;
  if (val !== null && val !== undefined)
    return [val];
  return [];
}

export function useDropdownMenu<TValue, TItem>({
  appendWidth,
  autoFocus,
  autoSelectFirst,
  dense,
  disabled = shallowRef(false),
  getIdentifier: externalGetIdentifier,
  getText: externalGetText,
  hideSelected,
  isOpen: externalIsOpen,
  itemHeight = 48,
  keyAttr,
  menuRef,
  options: allOptions,
  overscan = 5,
  prependWidth,
  setValue,
  textAttr,
  value,
}: DropdownOptions<TValue, TItem>) {
  const { getIdentifier: defaultGetIdentifier, getText: defaultGetText } = useDropdownOptionProperty({
    keyAttr,
    textAttr,
  });

  const getIdentifier = externalGetIdentifier ?? defaultGetIdentifier;
  const getText = externalGetText ?? defaultGetText;

  const activeIdentifiers = computed<Set<any>>(() => {
    const val = get(value);
    const selected: TItem[] = toSelectedArray(val);
    const identifiers = new Set<any>();
    for (const item of selected) {
      identifiers.add(getIdentifier(item));
    }
    return identifiers;
  });

  function isActiveItem(item: TItem): boolean {
    return get(activeIdentifiers).has(getIdentifier(item));
  }

  const options = computed<TItem[]>(() => {
    const options = get(allOptions);
    if (!hideSelected)
      return options;

    return options.filter(item => !isActiveItem(item));
  });

  const { containerProps, list, scrollTo, wrapperProps } = useVirtualList<TItem>(options, {
    itemHeight,
    overscan,
  });

  const renderedData = useArrayMap(list, ({ data, index: _index }) => ({ _index, item: data }));

  const isOpen = externalIsOpen ?? shallowRef<boolean>(false);

  const valueKey = computed(() => {
    const selected = get(value);
    if (!keyAttr || !selected)
      return selected;
    return Array.isArray(selected) ? selected.map(item => item[keyAttr]) : selected[keyAttr];
  });

  const highlightedIndex: Ref<number> = ref(get(autoSelectFirst) ? 0 : -1);

  const optionWidthBounds = computed<{ min: number; max: number }>(() => {
    let min = 0;
    let max = 0;
    for (const option of get(options)) {
      const length = getText(option)?.toString()?.length ?? 0;
      if (min === 0 && max === 0) {
        min = length;
        max = length;
      }
      else if (length < min) {
        min = length;
      }
      else if (length > max) {
        max = length;
      }
    }
    return { min, max };
  });

  const menuWidth = computed<string>(() => {
    const { min, max } = get(optionWidthBounds);
    const maxWidth = 30;
    const paddingX = 1.5;
    const fontMultiplier = get(dense) ? 12 : 13;
    const difference = max - min;

    function computeValue(width: number): string {
      const additionalWidths =
        (prependWidth ? prependWidth + 0.5 : 0) + (appendWidth ? appendWidth + 0.5 : 0);
      return `${Math.min((width * fontMultiplier) / 16 + paddingX + additionalWidths, maxWidth)}rem`;
    }

    if (difference <= 5)
      return computeValue(max);

    return computeValue(min + difference / 2);
  });

  function toggle(state: boolean = false): void {
    set(isOpen, state);
  }

  function itemIndexInValue(item: TItem): number {
    const val = get(value);
    const selected: TItem[] = toSelectedArray(val);

    if (selected.length === 0)
      return -1;

    const itemId = getIdentifier(item);
    return selected.findIndex(selectedItem => getIdentifier(selectedItem) === itemId);
  }

  async function adjustScrollByHighlightedIndex(smooth: boolean = false): Promise<void> {
    const index = get(highlightedIndex);
    if (index > -1) {
      await nextTick(() => {
        const menuEl = get(menuRef);
        const container = menuEl?.parentElement;
        if (container && menuEl) {
          const highlightedElem = menuEl.getElementsByClassName('highlighted')[0];

          if (highlightedElem) {
            highlightedElem.scrollIntoView?.({
              behavior: smooth ? 'smooth' : 'auto',
              block: 'nearest',
            });
            if (
              get(autoFocus) &&
              'focus' in highlightedElem &&
              typeof highlightedElem.focus === 'function'
            ) {
              highlightedElem?.focus();
            }
          }
          else {
            scrollTo(index);
            if (get(autoFocus)) {
              const elem = menuEl.getElementsByClassName('highlighted')[0];
              if (elem && 'focus' in elem && typeof elem.focus === 'function')
                elem.focus();
            }
          }
        }
      });
    }
  }

  async function updateOpen(open: boolean): Promise<void> {
    await nextTick(() => {
      if (open) {
        const val = get(value);

        // set highlighted index to active item
        if ((Array.isArray(val) && val.length > 0) || (val !== null && val !== undefined)) {
          const index = get(options).findIndex(isActiveItem);
          if (index > -1)
            set(highlightedIndex, index);
        }

        watchOnce(list, async () => {
          await adjustScrollByHighlightedIndex();
        });
      }
    });
  }

  watch([isOpen, disabled], async ([open, _]) => {
    await updateOpen(open);
  });

  watch(highlightedIndex, async (curr, prev) => {
    if (curr !== prev)
      await adjustScrollByHighlightedIndex(true);
  });

  watch(options, async () => {
    if (get(highlightedIndex) !== -1) {
      if (get(autoSelectFirst)) {
        set(highlightedIndex, 0);
        await adjustScrollByHighlightedIndex();
      }
      else {
        set(highlightedIndex, -1);
        scrollTo(0);
      }
    }
    else {
      scrollTo(0);
    }
  });

  const moveHighlight = (up: boolean): void => {
    if (!get(isOpen)) {
      toggle(true);
      return;
    }

    let position = get(highlightedIndex);
    const move = up ? -1 : 1;

    position += move;

    const total = get(options).length;

    if (position >= total)
      set(highlightedIndex, 0);
    else if (position < 0)
      set(highlightedIndex, total - 1);
    else set(highlightedIndex, position);
  };

  const applyHighlighted = (): void => {
    if (!setValue || !get(isOpen))
      return;

    const highlightedIndexVal = get(highlightedIndex);
    if (highlightedIndexVal === -1)
      return;

    const entry = get(options)[highlightedIndexVal];
    if (entry !== undefined)
      setValue(entry);
  };

  return {
    applyHighlighted,
    containerProps,
    getIdentifier,
    getText,
    highlightedIndex,
    isActiveItem,
    isOpen,
    itemIndexInValue,
    menuWidth,
    moveHighlight,
    optionsWithSelectedHidden: options,
    renderedData,
    toggle,
    valueKey,
    wrapperProps,
  };
}
