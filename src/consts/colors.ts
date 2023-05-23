export const baseColors = [
  'grey',
  'indigo',
  'deep-purple',
  'amber',
  'orange',
  'pink',
  'deep-orange',
  'green',
  'red',
  'light-green',
  'purple',
  'lime',
  'light-blue',
  'yellow',
  'cyan',
  'teal',
  'blue',
  'blue-gray',
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
