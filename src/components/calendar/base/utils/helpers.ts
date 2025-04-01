import type { ComponentPublicInstance } from 'vue';
import has from 'lodash/has';
import _isDate from 'lodash/isDate';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import some from 'lodash/some';

export { has, isFunction, isString, some };

export { default as defaults } from 'lodash/defaults';

export { default as defaultsDeep } from 'lodash/defaultsDeep';

export { default as get } from 'lodash/get';

export { default as head } from 'lodash/head';

export { default as isBoolean } from 'lodash/isBoolean';

export { default as isNumber } from 'lodash/isNumber';

export { default as last } from 'lodash/last';

export { default as map } from 'lodash/map';

export { default as mapValues } from 'lodash/mapValues';

export { default as set } from 'lodash/set';

// Type checkers
export function getType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function isDate(value: unknown): value is Date {
  return _isDate(value) && !isNaN(value.getTime());
}

export function isObject(value: unknown): value is object {
  return getType(value) === 'Object';
}

// Object utils
export function hasAny(obj: object, props: string[]) {
  return some(props, p => has(obj, p));
}

export function pad(val: string | number, len: number, char = '0') {
  val = val !== null && val !== undefined ? String(val) : '';
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
}

export function roundTenth(n: number) {
  return Math.round(n * 100) / 100;
}

export const isArray = (val: any): val is any[] => Array.isArray(val);

export function arrayHasItems(array: any): boolean {
  return isArray(array) && array.length > 0;
}

export function resolveEl(target: unknown): Node | null {
  if (target == null)
    return null;
  if (document && isString(target))
    return document.querySelector(target);
  return (target as ComponentPublicInstance).$el ?? target;
}

export interface ElementPosition {
  top: number;
  left: number;
}

export interface CustomElement {
  addEventListener: (event: any, handler: ((e: any) => void), opts: any) => void;
  removeEventListener: (event: any, handler: ((e: any) => void), opts: any) => void;
}

export function off(element: CustomElement, event: string, handler: (e: any) => void, opts: boolean | EventListenerOptions | undefined = undefined) {
  element.removeEventListener(event, handler, opts);
}

export function on(element: CustomElement, event: string, handler: (e: any) => void, opts: boolean | AddEventListenerOptions | undefined = undefined) {
  element.addEventListener(event, handler, opts);
  return () => off(element, event, handler, opts);
}

export function elementContains(element: Node, child: Node) {
  return !!element && !!child && (element === child || element.contains(child));
}

export function onSpaceOrEnter(event: KeyboardEvent, handler: (e: KeyboardEvent) => void) {
  if (event.key === ' ' || event.key === 'Enter') {
    handler(event);
    event.preventDefault();
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function omit<T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K) {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key) => {
    if (key in obj)
      ret[key] = obj[key];
  });
  return ret;
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
