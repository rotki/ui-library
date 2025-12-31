import type { SegmentData } from '@/components/date-time-picker/types';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { useInputHandler } from './use-input-handler';

function createMockSegmentData(): SegmentData {
  return {
    DD: ref<number | undefined>(undefined),
    HH: ref<number | undefined>(undefined),
    MM: ref<number | undefined>(undefined),
    SSS: ref<number | undefined>(undefined),
    YYYY: ref<number | undefined>(undefined),
    mm: ref<number | undefined>(undefined),
    ss: ref<number | undefined>(undefined),
  };
}

describe('use-input-handler', () => {
  describe('setValue', () => {
    it('should set a segment value', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { setValue } = useInputHandler(segmentData, currentValue);

      setValue('YYYY', 2023);
      expect(get(segmentData.YYYY)).toBe(2023);
      expect(get(currentValue)).toBe(2023);
    });

    it('should set different segment types correctly', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { setValue } = useInputHandler(segmentData, currentValue);

      setValue('DD', 15);
      expect(get(segmentData.DD)).toBe(15);

      setValue('MM', 6);
      expect(get(segmentData.MM)).toBe(6);

      setValue('HH', 14);
      expect(get(segmentData.HH)).toBe(14);

      setValue('mm', 30);
      expect(get(segmentData.mm)).toBe(30);

      setValue('ss', 45);
      expect(get(segmentData.ss)).toBe(45);

      setValue('SSS', 123);
      expect(get(segmentData.SSS)).toBe(123);
    });

    it('should set undefined to clear a segment', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { setValue } = useInputHandler(segmentData, currentValue);

      setValue('YYYY', 2023);
      expect(get(segmentData.YYYY)).toBe(2023);

      setValue('YYYY', undefined);
      expect(get(segmentData.YYYY)).toBeUndefined();
      expect(get(currentValue)).toBeUndefined();
    });

    it('should not update segment if value is the same', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { setValue } = useInputHandler(segmentData, currentValue);

      set(segmentData.YYYY, 2023);
      setValue('YYYY', 2023);
      // Value should remain the same but currentValue should be updated
      expect(get(segmentData.YYYY)).toBe(2023);
      expect(get(currentValue)).toBe(2023);
    });
  });

  describe('getCurrent', () => {
    it('should return current value of a segment', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, setValue } = useInputHandler(segmentData, currentValue);

      setValue('YYYY', 2023);
      expect(getCurrent('YYYY')).toBe(2023);
    });

    it('should return undefined for unset segments', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent } = useInputHandler(segmentData, currentValue);

      expect(getCurrent('YYYY')).toBeUndefined();
      expect(getCurrent('MM')).toBeUndefined();
      expect(getCurrent('DD')).toBeUndefined();
    });

    it('should return values for all segment types', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, setValue } = useInputHandler(segmentData, currentValue);

      setValue('DD', 15);
      setValue('MM', 6);
      setValue('YYYY', 2023);
      setValue('HH', 14);
      setValue('mm', 30);
      setValue('ss', 45);
      setValue('SSS', 123);

      expect(getCurrent('DD')).toBe(15);
      expect(getCurrent('MM')).toBe(6);
      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('HH')).toBe(14);
      expect(getCurrent('mm')).toBe(30);
      expect(getCurrent('ss')).toBe(45);
      expect(getCurrent('SSS')).toBe(123);
    });
  });

  describe('update', () => {
    it('should update all segments from a dayjs date with minute accuracy', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      const date = dayjs('2023-06-15 14:30:45.123');
      update(date, TimeAccuracy.MINUTE);

      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(6);
      expect(getCurrent('DD')).toBe(15);
      expect(getCurrent('HH')).toBe(14);
      expect(getCurrent('mm')).toBe(30);
      expect(getCurrent('ss')).toBeUndefined();
      expect(getCurrent('SSS')).toBeUndefined();
    });

    it('should update all segments from a dayjs date with second accuracy', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      const date = dayjs('2023-06-15 14:30:45.123');
      update(date, TimeAccuracy.SECOND);

      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(6);
      expect(getCurrent('DD')).toBe(15);
      expect(getCurrent('HH')).toBe(14);
      expect(getCurrent('mm')).toBe(30);
      expect(getCurrent('ss')).toBe(45);
      expect(getCurrent('SSS')).toBeUndefined();
    });

    it('should update all segments from a dayjs date with millisecond accuracy', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      const date = dayjs('2023-06-15 14:30:45.123');
      update(date, TimeAccuracy.MILLISECOND);

      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(6);
      expect(getCurrent('DD')).toBe(15);
      expect(getCurrent('HH')).toBe(14);
      expect(getCurrent('mm')).toBe(30);
      expect(getCurrent('ss')).toBe(45);
      expect(getCurrent('SSS')).toBe(123);
    });

    it('should handle midnight (00:00:00)', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      const date = dayjs('2023-01-01 00:00:00.000');
      update(date, TimeAccuracy.MILLISECOND);

      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(1);
      expect(getCurrent('DD')).toBe(1);
      expect(getCurrent('HH')).toBe(0);
      expect(getCurrent('mm')).toBe(0);
      expect(getCurrent('ss')).toBe(0);
      expect(getCurrent('SSS')).toBe(0);
    });

    it('should handle end of year (December 31, 23:59:59.999)', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      const date = dayjs('2023-12-31 23:59:59.999');
      update(date, TimeAccuracy.MILLISECOND);

      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(12);
      expect(getCurrent('DD')).toBe(31);
      expect(getCurrent('HH')).toBe(23);
      expect(getCurrent('mm')).toBe(59);
      expect(getCurrent('ss')).toBe(59);
      expect(getCurrent('SSS')).toBe(999);
    });

    it('should not update segment if value is the same (onlySet behavior)', () => {
      const segmentData = createMockSegmentData();
      const currentValue = ref<number | undefined>(undefined);
      const { getCurrent, update } = useInputHandler(segmentData, currentValue);

      // First update
      const date1 = dayjs('2023-06-15 14:30:00');
      update(date1, TimeAccuracy.MINUTE);
      expect(getCurrent('YYYY')).toBe(2023);

      // Second update with same year - should still work
      const date2 = dayjs('2023-07-20 10:15:00');
      update(date2, TimeAccuracy.MINUTE);
      expect(getCurrent('YYYY')).toBe(2023);
      expect(getCurrent('MM')).toBe(7);
      expect(getCurrent('DD')).toBe(20);
    });
  });
});
