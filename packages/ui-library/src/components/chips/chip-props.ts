export const ChipSize = {
  sm: 'sm',
  md: 'md',
} as const;

export type ChipSize = (typeof ChipSize)[keyof typeof ChipSize];

export const ChipVariant = {
  filled: 'filled',
  outlined: 'outlined',
} as const;

export type ChipVariant = (typeof ChipVariant)[keyof typeof ChipVariant];

export const CHIP_CLOSE_ICON_SIZES: Record<ChipSize, number> = {
  sm: 16,
  md: 24,
};
