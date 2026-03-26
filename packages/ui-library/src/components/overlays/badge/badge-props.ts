export const BadgePlacement = {
  top: 'top',
  center: 'center',
  bottom: 'bottom',
} as const;

export type BadgePlacement = (typeof BadgePlacement)[keyof typeof BadgePlacement];

export const BadgeSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export type BadgeSize = (typeof BadgeSize)[keyof typeof BadgeSize];

export const BadgeRounded = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const;

export type BadgeRounded = (typeof BadgeRounded)[keyof typeof BadgeRounded];
