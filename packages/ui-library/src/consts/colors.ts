/**
 * The Material palette the library kept from 2.x. Only `grey` is left, because consumers still use
 * it widely; new code takes the zinc `neutral` ramp, and the other Material hues were dropped in 3.0.
 */
export const baseColors = [
  'grey',
];

export const baseColorsIntensities = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  'a100',
  'a200',
  'a400',
  'a700',
];

/**
 * The available context colors.
 * Keep in sync with build-web-types.mjs
 */
export const contextColors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
] as const;

export type ContextColorsType = (typeof contextColors)[number];

export const contextColorsIntensities = [
  { name: 'Regular', prefix: '' },
  { name: 'Darker', prefix: '-darker' },
  { name: 'Lighter', prefix: '-lighter' },
];
