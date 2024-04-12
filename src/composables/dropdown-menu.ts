import type { Ref } from 'vue';

export interface DropdownOptions<T, K extends keyof T = keyof T> {
  options: Ref<T[]>;
  dense?: Ref<boolean>;
  value: Ref<T | undefined>;
  menuRef: Ref<HTMLElement>;
  keyAttr?: K;
  textAttr?: keyof T;
  appendWidth?: number;
  prependWidth?: number;
  itemHeight?: number;
  overscan?: number;
}

export function useDropdownMenu<T extends object | string, K extends keyof T>({
  appendWidth,
  dense,
  itemHeight = 48,
  keyAttr,
  menuRef,
  options,
  overscan = 5,
  prependWidth,
  textAttr,
  value,
}: DropdownOptions<T, K>) {
  const { containerProps, list, wrapperProps } = useVirtualList<T>(
    options,
    {
      itemHeight,
      overscan,
    },
  );

  const renderedData: ComputedRef<T[]> = useArrayMap(list, ({ data }) => data);

  const isOpen = ref(false);

  const valueKey = computed(() => {
    const selected = get(value);
    if (!keyAttr || !selected)
      return selected;
    return selected[keyAttr];
  });

  const menuWidth = computed(() => {
    const widths = { max: 0, min: 0 };
    const maxWidth = 30;
    const paddingX = 1.5;
    const fontMultiplier = get(dense) ? 12 : 13;

    get(options).forEach((option) => {
      const length = getText(option)?.toString()?.length ?? 0;
      if (widths.min === 0 && widths.max === 0) {
        widths.min = length;
        widths.max = length;
      }
      else if (length < widths.min) {
        widths.min = length;
      }
      else if (length > widths.max) {
        widths.max = length;
      }
    });

    const difference = widths.max - widths.min;

    function computeValue(width: number) {
      const additionalWidths = (prependWidth ? prependWidth + 0.5 : 0) + (appendWidth ? appendWidth + 0.5 : 0);
      return `${Math.min((width * fontMultiplier) / 16 + paddingX + additionalWidths, maxWidth)}rem`;
    }

    if (difference <= 5)
      return computeValue(widths.max);

    return computeValue(widths.min + difference / 2);
  });

  function toggle(state: boolean = false) {
    set(isOpen, state);
  }

  function getText(item: T): T[keyof T] | T {
    if (textAttr)
      return item[textAttr];

    return item;
  }

  function getIdentifier(item: T): T[K] | T {
    if (keyAttr)
      return item[keyAttr];

    return item;
  }

  function isActiveItem(item: T): boolean {
    const selected = get(value);
    if (!selected)
      return false;

    if (keyAttr)
      return item[keyAttr] === selected[keyAttr];

    return selected === item;
  }

  async function updateOpen(open: boolean) {
    await nextTick(() => {
      const container = get(menuRef)?.parentElement;
      if (open && get(value) && container) {
        const index = get(options).findIndex(isActiveItem);
        container.scrollTop = index * itemHeight;
      }
    });
  }

  watchDebounced(isOpen, updateOpen, { debounce: 100 });

  watch(isOpen, updateOpen);

  return {
    containerProps,
    getIdentifier,
    getText,
    isActiveItem,
    isOpen,
    menuWidth,
    renderedData,
    toggle,
    valueKey,
    wrapperProps,
  };
}
