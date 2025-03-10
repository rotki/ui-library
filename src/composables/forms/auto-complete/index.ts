import { defaultDisabledProp, defaultKeyProp } from '@/consts/forms/auto-complete';
import { getStringValue, getText } from '@/utils/forms/auto-complete';

export function useAutoCompleteProps<T extends object>(props: {
  keyProp?: Extract<keyof T, string>;
  textProp?: Extract<keyof T, string>;
  itemDisabledProp?: Extract<keyof T, string>;
}) {
  function getTextValue(item: T): string | undefined {
    return getText(item, props.keyProp);
  }

  function isItemDisabled(item: T): boolean {
    const disabledProp = props.itemDisabledProp;
    if (disabledProp)
      return !!item[disabledProp];
    else if (defaultDisabledProp in item)
      return !!item[defaultDisabledProp];

    return false;
  }

  function getItemKey(item: T): string | undefined {
    const keyProp = props.keyProp;

    if (keyProp)
      return getStringValue(item[keyProp]);

    if (defaultKeyProp in item)
      return getStringValue(item[defaultKeyProp] as T[Extract<keyof T, string>]);

    return undefined;
  }

  return {
    getItemKey,
    getTextValue,
    isItemDisabled,
  };
}
