interface CurrencyOptions {
  currency?: string;
  locale?: string;
  style?: string;
  fractionDigits?: number;
}

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
