import { type SetupContext } from 'vue';
import { objectOmit, objectPick } from '@vueuse/shared';

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
export const formatCurrency = (
  amount: number | string,
  {
    currency = 'EUR',
    style = 'currency',
    fractionDigits = 2,
    locale = 'de-De',
  }: CurrencyOptions,
) =>
  new Intl.NumberFormat(locale, {
    style,
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number(amount));

/**
 * Format number value
 * @param {number} amount
 * @param {CurrencyOptions} options
 */
export const formatNumber = (
  amount: number | string,
  { fractionDigits = 2 }: CurrencyOptions,
) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number(amount));

/**
 * Format number value without fraction
 * @param {number} amount
 */
export const formatInteger = (amount: number | string) =>
  formatNumber(amount, { fractionDigits: 0 });

/**
 * Generates and returns the array of root allowed attributes
 * @param {SetupContextAttrs} data
 * @returns {SetupContextAttrsKeys}
 */
export const getRootKeys = (data: SetupContextAttrs) =>
  Object.keys(data).filter((key) =>
    key.startsWith('data-'),
  ) as SetupContextAttrsKeys;

/**
 * Picks only required attributes for root element
 * @param {SetupContextAttrs} data
 * @param {SetupContextAttrsKeys} include
 * @returns {Pick<SetupContextAttrs, any>}
 */
export const getRootAttrs = (
  data: SetupContextAttrs,
  include: SetupContextAttrsKeys = ['class'],
) => objectPick(data, [...getRootKeys(data), ...include]);

/**
 * Omits root attributes from component's attributes
 * @param {SetupContextAttrs} data
 * @param {SetupContextAttrsKeys} exclude
 * @returns {Omit<SetupContextAttrs, any>}
 */
export const getNonRootAttrs = (
  data: SetupContextAttrs,
  exclude: SetupContextAttrsKeys = ['class'],
) => objectOmit(data, [...getRootKeys(data), ...exclude]);
