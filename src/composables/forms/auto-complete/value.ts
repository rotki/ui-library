import type { ComputedRef, MaybeRef, Ref } from 'vue';

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

  function convertModelValueToArray(modelValueData: TValue | undefined): any[] {
    if (!modelValueData)
      return [];
    return Array.isArray(modelValueData) ? modelValueData : [modelValueData];
  }

  function filterValuesByOptions(
    valueArray: any[],
    optionsData: TItem[],
    customValue: boolean,
    returnObject: boolean,
  ): TItem[] {
    const filtered: TItem[] = [];

    valueArray.forEach((val) => {
      const inOptions = optionsData.find(item => deps.getIdentifier(item) === deps.getIdentifier(val));

      if (inOptions) {
        filtered.push(inOptions);
      }
      else if (customValue) {
        filtered.push(deps.textValueToProperValue(val, returnObject));
      }
    });

    return filtered;
  }

  function filterValuesByIdentifier(
    valueArray: any[],
    optionsData: TItem[],
    customValue: boolean,
    returnObject: boolean,
  ): TItem[] {
    const filtered: TItem[] = [];

    valueArray.forEach((val) => {
      const inOptions = optionsData.find(item => deps.getIdentifier(item) === val);

      if (inOptions) {
        filtered.push(inOptions);
      }
      else if (customValue) {
        filtered.push(deps.textValueToProperValue(val, returnObject));
      }
    });

    return filtered;
  }

  function processReturnObjectValue(
    modelValueData: TValue | undefined,
    optionsData: TItem[],
    returnObject: boolean,
    customValue: boolean,
    shouldUpdateInternalSearch: boolean,
  ): TItem[] {
    const multipleValue = Array.isArray(modelValueData);
    const valueArray = convertModelValueToArray(modelValueData);
    const filtered = filterValuesByOptions(valueArray, optionsData, customValue, returnObject);

    if (multipleValue || filtered.length === 0) {
      if (shouldUpdateInternalSearch)
        deps.updateInternalSearch();
      return filtered;
    }

    const val = filtered[0];
    if (shouldUpdateInternalSearch)
      deps.updateInternalSearch(deps.getText(val));
    return [val];
  }

  function processStandardValue(
    modelValueData: TValue | undefined,
    optionsData: TItem[],
    returnObject: boolean,
    customValue: boolean,
    shouldUpdateInternalSearch: boolean,
  ): TItem[] {
    const valueArray = convertModelValueToArray(modelValueData);
    const filtered = filterValuesByIdentifier(valueArray, optionsData, customValue, returnObject);

    if (shouldUpdateInternalSearch) {
      if (filtered.length > 0) {
        deps.updateInternalSearch(deps.getText(filtered[0]));
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
      const optionsData = get(options);
      const shouldUpdateInternalSearch = get(deps.shouldApplyValueAsSearch) && !get(deps.isOpen);

      if (keyAttr && returnObject) {
        return processReturnObjectValue(
          modelValueData,
          optionsData,
          returnObject,
          customValue,
          shouldUpdateInternalSearch,
        );
      }

      return processStandardValue(
        modelValueData,
        optionsData,
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
