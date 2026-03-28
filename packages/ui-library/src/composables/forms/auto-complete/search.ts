import type { MaybeRefOrGetter, Ref } from 'vue';
import { get, set } from '@vueuse/shared';
import { getTextToken } from '@/utils/helpers';

export interface UseAutoCompleteSearchOptions<TItem> {
  /** The property used as the unique identifier for each item. */
  keyAttr?: MaybeRefOrGetter<keyof TItem | undefined>;
  /** The property used to display text for each item. */
  textAttr?: MaybeRefOrGetter<keyof TItem | undefined>;
  /** Whether to disable client-side filtering of options. */
  noFilter?: MaybeRefOrGetter<boolean>;
  /** Custom filter function to match items against the search query. */
  filter?: MaybeRefOrGetter<((item: TItem, queryText: string) => boolean) | undefined>;
  /** Whether custom (free-text) values are allowed. */
  customValue?: MaybeRefOrGetter<boolean>;
  /** Whether to hide the custom value option from the dropdown. */
  hideCustomValue?: MaybeRefOrGetter<boolean>;
  /** Whether to return the full item object instead of just the key. */
  returnObject?: MaybeRefOrGetter<boolean>;
}

export interface UseAutoCompleteSearchReturn<TItem> {
  internalSearch: Readonly<Ref<string>>;
  debouncedInternalSearch: Readonly<Ref<string>>;
  filteredOptions: Readonly<Ref<TItem[]>>;
  justOpened: Ref<boolean>;
  updateInternalSearch: (value?: string) => void;
  textValueToProperValue: (val: any, returnObject?: boolean) => TItem;
}

export function useAutoCompleteSearch<TItem>(
  options: MaybeRefOrGetter<TItem[]>,
  searchModel: Ref<string>, // eslint-disable-line @rotki/composable-input-flexibility -- needs write access
  opts: UseAutoCompleteSearchOptions<TItem>,
): UseAutoCompleteSearchReturn<TItem> {
  const internalSearch = shallowRef<string>('');
  const debouncedInternalSearch = refDebounced(internalSearch, 50);
  const justOpened = shallowRef<boolean>(false);

  // Memoize token computation to avoid repeated string processing.
  // Map iteration order is insertion order, so deleting the first key
  // gives us simple LRU eviction without a separate data structure.
  const MAX_CACHE_SIZE = 100;
  const tokenCache = new Map<string, string>();
  const getCachedTextToken = (text: string): string => {
    const cached = tokenCache.get(text);
    if (cached !== undefined)
      return cached;

    if (tokenCache.size >= MAX_CACHE_SIZE) {
      const oldest = tokenCache.keys().next().value;
      if (oldest !== undefined)
        tokenCache.delete(oldest);
    }

    const token = getTextToken(text);
    tokenCache.set(text, token);
    return token;
  };

  const filteredOptions = computed<TItem[]>(() => {
    const search = get(debouncedInternalSearch);
    const optionsValue = toValue(options);

    const noFilter = toValue(opts.noFilter);
    if (noFilter || !search || get(justOpened))
      return optionsValue;

    const keyAttr = toValue(opts.keyAttr);
    const textAttr = toValue(opts.textAttr);
    const filter = toValue(opts.filter);

    // Cache the search token once
    const searchToken = getCachedTextToken(search);

    const filtered = filter
      ? optionsValue.filter(item => filter(item, search))
      : optionsValue.filter((item) => {
          if (!item)
            return false;

          const keywords: string[] = [getCachedTextToken(keyAttr ? String((item as any)[keyAttr]) : item.toString())];

          if (textAttr && typeof item === 'object')
            keywords.push(getCachedTextToken(String((item as any)[textAttr])));

          return keywords.some(keyword => keyword.includes(searchToken));
        });

    const customValue = toValue(opts.customValue);
    const hideCustomValue = toValue(opts.hideCustomValue);
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
      returnObject: toValue(opts.returnObject),
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
    internalSearch: readonly(internalSearch),
    justOpened, // eslint-disable-line @rotki/composable-return-readonly -- written by focus.ts onInputFocused and component setValue
    textValueToProperValue: (val: any, returnObjectOverride: boolean = false) => textValueToProperValue(val, {
      keyAttr: toValue(opts.keyAttr),
      returnObject: returnObjectOverride || toValue(opts.returnObject),
      textAttr: toValue(opts.textAttr),
    }),
    updateInternalSearch,
  };
}
