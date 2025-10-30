import type { ComputedRef, MaybeRef, Ref } from 'vue';
import { get, set } from '@vueuse/shared';
import { assert } from '@/utils/assert';

export interface UseAutoCompleteValueOptions<TItem> {
  keyAttr?: MaybeRef<keyof TItem | undefined>;
  returnObject?: MaybeRef<boolean>;
  customValue?: MaybeRef<boolean>;
}

export interface UseAutoCompleteValueReturn<TItem> {
  value: ComputedRef<TItem[]>;
  setSelected: (selected: TItem[]) => void;
}

export interface UseAutoCompleteValueDeps<TItem> {
  getIdentifier: (item: TItem) => any;
  getText: (item: TItem) => string | undefined;
  textValueToProperValue: (val: any, returnObject?: boolean) => TItem;
  shouldApplyValueAsSearch: MaybeRef<boolean>;
  isOpen: MaybeRef<boolean>;
  updateInternalSearch: (value?: string) => void;
}

export function useAutoCompleteValue<TValue, TItem>(
  modelValue: Ref<TValue | undefined>,
  options: MaybeRef<TItem[]>,
  opts: UseAutoCompleteValueOptions<TItem>,
  deps: UseAutoCompleteValueDeps<TItem>,
): UseAutoCompleteValueReturn<TItem> {
  const multiple = computed<boolean>(() => Array.isArray(get(modelValue)));

  // Create maps for O(1) lookup performance
  const optionsMap = computed<Map<any, TItem>>(() => {
    const map = new Map<any, TItem>();
    const optionsData = get(options);
    for (const item of optionsData) {
      map.set(deps.getIdentifier(item), item);
    }
    return map;
  });

  function convertModelValueToArray(modelValueData: TValue | undefined): any[] {
    if (!modelValueData)
      return [];
    return Array.isArray(modelValueData) ? modelValueData : [modelValueData];
  }

  function filterValuesByOptions(
    valueArray: any[],
    optionsMapData: Map<any, TItem>,
    customValue: boolean,
    returnObject: boolean,
  ): TItem[] {
    const filtered: TItem[] = [];
    filtered.length = valueArray.length; // Pre-allocate array size
    let index = 0;

    for (const val of valueArray) {
      const identifier = deps.getIdentifier(val);
      const inOptions = optionsMapData.get(identifier);

      if (inOptions) {
        filtered[index++] = inOptions;
      }
      else if (customValue) {
        filtered[index++] = deps.textValueToProperValue(val, returnObject);
      }
    }

    filtered.length = index; // Trim to actual size
    return filtered;
  }

  function filterValuesByIdentifier(
    valueArray: any[],
    optionsMapData: Map<any, TItem>,
    customValue: boolean,
    returnObject: boolean,
  ): TItem[] {
    const filtered: TItem[] = [];
    filtered.length = valueArray.length; // Pre-allocate array size
    let index = 0;

    for (const val of valueArray) {
      const inOptions = optionsMapData.get(val);

      if (inOptions) {
        filtered[index++] = inOptions;
      }
      else if (customValue) {
        filtered[index++] = deps.textValueToProperValue(val, returnObject);
      }
    }

    filtered.length = index; // Trim to actual size
    return filtered;
  }

  function processReturnObjectValue(
    modelValueData: TValue | undefined,
    optionsMapData: Map<any, TItem>,
    returnObject: boolean,
    customValue: boolean,
    shouldUpdateInternalSearch: boolean,
  ): TItem[] {
    const multipleValue = Array.isArray(modelValueData);
    const valueArray = convertModelValueToArray(modelValueData);
    const filtered = filterValuesByOptions(valueArray, optionsMapData, customValue, returnObject);

    if (multipleValue || filtered.length === 0) {
      if (shouldUpdateInternalSearch)
        deps.updateInternalSearch();
      return filtered;
    }

    const val = filtered[0];
    assert(val);
    if (shouldUpdateInternalSearch)
      deps.updateInternalSearch(deps.getText(val));
    return [val];
  }

  function processStandardValue(
    modelValueData: TValue | undefined,
    optionsMapData: Map<any, TItem>,
    returnObject: boolean,
    customValue: boolean,
    shouldUpdateInternalSearch: boolean,
  ): TItem[] {
    const valueArray = convertModelValueToArray(modelValueData);
    const filtered = filterValuesByIdentifier(valueArray, optionsMapData, customValue, returnObject);

    if (shouldUpdateInternalSearch) {
      if (filtered.length > 0) {
        const firstItem = filtered[0];
        assert(firstItem);
        deps.updateInternalSearch(deps.getText(firstItem));
      }
      else {
        deps.updateInternalSearch();
      }
    }

    return filtered;
  }

  function onUpdateModelValue(value: TValue | undefined): void {
    set(modelValue, value);
  }

  function setSelected(selected: TItem[]): void {
    const keyAttr = get(opts.keyAttr);
    const returnObject = get(opts.returnObject);
    const selection = keyAttr && !returnObject ? selected.map(item => item[keyAttr]) : selected;

    if (get(multiple))
      return onUpdateModelValue(selection as TValue);

    if (selection.length === 0)
      return onUpdateModelValue(undefined);

    return onUpdateModelValue(selection[0] as TValue);
  }

  const value = computed<TItem[]>({
    get: () => {
      const modelValueData = get(modelValue);
      const keyAttr = get(opts.keyAttr);
      const returnObject = get(opts.returnObject) ?? false;
      const customValue = get(opts.customValue) ?? false;
      const optionsMapData = get(optionsMap);
      const shouldUpdateInternalSearch = get(deps.shouldApplyValueAsSearch) && !get(deps.isOpen);

      if (keyAttr && returnObject) {
        return processReturnObjectValue(
          modelValueData,
          optionsMapData,
          returnObject,
          customValue,
          shouldUpdateInternalSearch,
        );
      }

      return processStandardValue(
        modelValueData,
        optionsMapData,
        returnObject,
        customValue,
        shouldUpdateInternalSearch,
      );
    },
    set: (selected: TItem[]): void => {
      setSelected(selected);
    },
  });

  return {
    setSelected,
    value,
  };
}
