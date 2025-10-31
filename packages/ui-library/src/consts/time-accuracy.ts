export const TimeAccuracy = {
  MINUTE: 'minute',
  SECOND: 'second',
  MILLISECOND: 'millisecond',
} as const;

export type TimeAccuracy = typeof TimeAccuracy[keyof typeof TimeAccuracy];
