import { objectOmit, objectPick } from '@vueuse/shared';
import type { SetupContext } from 'vue';

interface CurrencyOptions {
  currency?: string;
  locale?: string;
  style?: string;
  fractionDigits?: number;
}

type SetupContextAttrs = SetupContext['attrs'];

type SetupContextAttrsKeys = (keyof SetupContextAttrs)[];

/**
 * Format number value to specified currency format
 * @param {number} amount
 * @param {CurrencyOptions} options
 */
export function formatCurrency(amount: number | string, {
  currency = 'EUR',
  fractionDigits = 2,
  locale = 'de-De',
  style = 'currency',
}: CurrencyOptions) {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    style,
  }).format(Number(amount));
}

/**
 * Format number value
 * @param {number} amount
 * @param {CurrencyOptions} options
 */
export function formatNumber(amount: number | string, { fractionDigits = 2 }: CurrencyOptions) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number(amount));
}

/**
 * Format number value without fraction
 * @param {number} amount
 */
export function formatInteger(amount: number | string) {
  return formatNumber(amount, { fractionDigits: 0 });
}

/**
 * Generates and returns the array of root allowed attributes
 * @param {SetupContextAttrs} data
 * @returns {SetupContextAttrsKeys}
 */
export function getRootKeys(data: SetupContextAttrs) {
  return Object.keys(data).filter(key =>
    key.startsWith('data-'),
  ) as SetupContextAttrsKeys;
}

/**
 * Picks only required attributes for root element
 * @param {SetupContextAttrs} data
 * @param {SetupContextAttrsKeys} include
 * @returns {Pick<SetupContextAttrs, any>}
 */
export function getRootAttrs(data: SetupContextAttrs, include: SetupContextAttrsKeys = ['class']) {
  return objectPick(data, [...getRootKeys(data), ...include]);
}

/**
 * Omits root attributes from component's attributes
 * @param {SetupContextAttrs} data
 * @param {SetupContextAttrsKeys} exclude
 * @returns {Omit<SetupContextAttrs, any>}
 */
export function getNonRootAttrs(data: SetupContextAttrs, exclude: SetupContextAttrsKeys = ['class']) {
  return objectOmit(data, [...getRootKeys(data), ...exclude]);
}
