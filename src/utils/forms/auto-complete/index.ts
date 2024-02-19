import { defaultTextProp } from '@/consts/forms/auto-complete';

export function getStringValue<
  T extends object,
  K extends keyof T = keyof T,
>(item: T[K]): string | undefined {
  return typeof item === 'string' ? item : undefined;
}

export function getText<
  T extends object,
  K extends keyof T = keyof T,
>(item: T, key?: K): string | undefined {
  if (key) {
    return getStringValue(item[key]);
  }
  else {
    if (defaultTextProp in item)
      return getStringValue(item[defaultTextProp] as T[Extract<keyof T, string>]);
    else
      return undefined;
  }
}
