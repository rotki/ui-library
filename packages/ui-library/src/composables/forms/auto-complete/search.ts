import type { MaybeRef, Ref } from 'vue';
import { get, set } from '@vueuse/shared';
import { getTextToken } from '@/utils/helpers';

export interface UseAutoCompleteSearchOptions<TItem> {
  keyAttr?: MaybeRef<keyof TItem | undefined>;
  textAttr?: MaybeRef<keyof TItem | undefined>;
  noFilter?: MaybeRef<boolean>;
  filter?: MaybeRef<((item: TItem, queryText: string) => boolean) | undefined>;
  customValue?: MaybeRef<boolean>;
  hideCustomValue?: MaybeRef<boolean>;
  returnObject?: MaybeRef<boolean>;
}

export interface UseAutoCompleteSearchReturn<TItem> {
  internalSearch: Ref<string>;
  debouncedInternalSearch: Readonly<Ref<string>>;
  filteredOptions: Readonly<Ref<TItem[]>>;
  justOpened: Ref<boolean>;
  updateInternalSearch: (value?: string) => void;
  textValueToProperValue: (val: any, returnObject?: boolean) => TItem;
}

export function useAutoCompleteSearch<TItem>(
  options: MaybeRef<TItem[]>,
  searchModel: Ref<string>,
  opts: UseAutoCompleteSearchOptions<TItem>,
): UseAutoCompleteSearchReturn<TItem> {
  const internalSearch = ref<string>('');
  const debouncedInternalSearch = refDebounced(internalSearch, 50);
  const justOpened = ref<boolean>(false);

  // Memoize token computation to avoid repeated string processing
  const tokenCache = new Map<string, string>();
  const getCachedTextToken = (text: string): string => {
    if (tokenCache.has(text)) {
      return tokenCache.get(text)!;
    }
    const token = getTextToken(text);
    tokenCache.set(text, token);
    return token;
  };

  const filteredOptions = computed<TItem[]>(() => {
    const search = get(debouncedInternalSearch);
    const optionsValue = get(options);

    const noFilter = get(opts.noFilter);
    if (noFilter || !search || get(justOpened))
      return optionsValue;

    const keyAttr = get(opts.keyAttr);
    const textAttr = get(opts.textAttr);
    const filter = get(opts.filter);

    // Cache the search token once
    const searchToken = getCachedTextToken(search);

    const usedFilter = filter || ((item) => {
      if (!item)
        return false;

      const keywords: string[] = [keyAttr ? getCachedTextToken((item as any)[keyAttr]) : item.toString()];

      if (textAttr && typeof item === 'object')
        keywords.push(getCachedTextToken((item as any)[textAttr]));

      return keywords.some(keyword => getCachedTextToken(keyword).includes(searchToken));
    });

    const filtered = optionsValue.filter(item => usedFilter(item, search));

    const customValue = get(opts.customValue);
    const hideCustomValue = get(opts.hideCustomValue);
    if (!customValue || hideCustomValue || !search) {
      return filtered;
    }

    // Use a more efficient check for custom value inclusion
    const isCustomValueIncluded = filtered.some((item) => {
      if (!item) {
        return false;
      }

      const val = textAttr ? (item as any)[textAttr] : item.toString();
      return val === search;
    });

    if (isCustomValueIncluded) {
      return filtered;
    }

    return [textValueToProperValue(search, {
      keyAttr,
      returnObject: get(opts.returnObject),
      textAttr,
    }), ...filtered];
  });

  function textValueToProperValue(val: any, options: { keyAttr?: keyof TItem; textAttr?: keyof TItem; returnObject?: boolean }): TItem {
    const { keyAttr, returnObject, textAttr } = options;
    if (!keyAttr || returnObject)
      return val;

    return {
      [keyAttr]: val,
      ...(
        textAttr
          ? { [textAttr]: val }
          : {}
      ),
    } as TItem;
  }

  function updateInternalSearch(value: string = ''): void {
    set(searchModel, value);
    set(internalSearch, value);
  }

  watch(searchModel, (search) => {
    set(internalSearch, search);
  }, { immediate: true });

  // Clear token cache when component unmounts to prevent memory leaks
  onUnmounted(() => {
    tokenCache.clear();
  });

  return {
    debouncedInternalSearch,
    filteredOptions,
    internalSearch,
    justOpened,
    textValueToProperValue: (val: any, returnObjectOverride: boolean = false) => textValueToProperValue(val, {
      keyAttr: get(opts.keyAttr),
      returnObject: returnObjectOverride || get(opts.returnObject),
      textAttr: get(opts.textAttr),
    }),
    updateInternalSearch,
  };
}
