export const ChipSize = {
  /** 20px with 11px tabular figures, for counts beside a heading or in a row */
  xs: 'xs',
  sm: 'sm',
  md: 'md',
} as const;

export type ChipSize = (typeof ChipSize)[keyof typeof ChipSize];

export const ChipVariant = {
  filled: 'filled',
  outlined: 'outlined',
  /** A soft tint of the color with deeper text, for status tags in dense views */
  tonal: 'tonal',
} as const;

export type ChipVariant = (typeof ChipVariant)[keyof typeof ChipVariant];

export const CHIP_CLOSE_ICON_SIZES: Record<ChipSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
};
