export const ProgressVariant = {
  determinate: 'determinate',
  indeterminate: 'indeterminate',
  buffer: 'buffer',
} as const;

export type ProgressVariant = (typeof ProgressVariant)[keyof typeof ProgressVariant];
