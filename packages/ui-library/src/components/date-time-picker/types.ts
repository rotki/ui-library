import type { Ref } from 'vue';

export const DATE_TIME_SEGMENT_TYPES = [
  'DD',
  'MM',
  'YYYY',
  'HH',
  'mm',
  'ss',
  'SSS',
] as const;

export type DateTimeSegmentType = typeof DATE_TIME_SEGMENT_TYPES[number];

export function isDateTimeSegmentType(value: string): value is DateTimeSegmentType {
  return (DATE_TIME_SEGMENT_TYPES as readonly string[]).includes(value);
}

export type SegmentData = Record<DateTimeSegmentType, Ref<number | undefined>>;
