import type { DateTimeSegmentType } from '@/components/date-time-picker/types';

export interface Segment {
  start: number;
  end: number;
  type: DateTimeSegmentType;
}

type SegmentMethod = 'date' | 'hour' | 'month' | 'minute' | 'second' | 'millisecond' | 'year';

export const SEGMENT_METHODS: Record<DateTimeSegmentType, SegmentMethod> = {
  DD: 'date',
  HH: 'hour',
  MM: 'month',
  SSS: 'millisecond',
  YYYY: 'year',
  mm: 'minute',
  ss: 'second',
};

export interface SegmentBounds {
  maxValue: number;
  minValue?: number;
}

export const SEGMENT_CONFIG: Record<DateTimeSegmentType, SegmentBounds> = {
  DD: { maxValue: 31, minValue: 1 },
  HH: { maxValue: 23, minValue: 0 },
  MM: { maxValue: 12, minValue: 1 },
  SSS: { maxValue: 999, minValue: 0 },
  YYYY: { maxValue: 9999, minValue: 1 },
  mm: { maxValue: 59, minValue: 0 },
  ss: { maxValue: 59, minValue: 0 },
};
