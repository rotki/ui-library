import { describe, expect, it } from 'vitest';
import { DATE_TIME_SEGMENT_TYPES, isDateTimeSegmentType } from './types';

describe('date-time-picker/types', () => {
  describe('date time segment types', () => {
    it('should contain all expected segment types', () => {
      expect(DATE_TIME_SEGMENT_TYPES).toContain('DD');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('MM');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('YYYY');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('HH');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('mm');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('ss');
      expect(DATE_TIME_SEGMENT_TYPES).toContain('SSS');
    });

    it('should be a non-empty array', () => {
      // Verify the array has at least the expected types without hardcoding exact count
      expect(DATE_TIME_SEGMENT_TYPES.length).toBeGreaterThan(0);
    });
  });

  describe('isDateTimeSegmentType', () => {
    it('should return true for valid date segment types', () => {
      expect(isDateTimeSegmentType('DD')).toBe(true);
      expect(isDateTimeSegmentType('MM')).toBe(true);
      expect(isDateTimeSegmentType('YYYY')).toBe(true);
    });

    it('should return true for valid time segment types', () => {
      expect(isDateTimeSegmentType('HH')).toBe(true);
      expect(isDateTimeSegmentType('mm')).toBe(true);
      expect(isDateTimeSegmentType('ss')).toBe(true);
      expect(isDateTimeSegmentType('SSS')).toBe(true);
    });

    it('should return false for invalid segment types', () => {
      expect(isDateTimeSegmentType('YY')).toBe(false);
      expect(isDateTimeSegmentType('D')).toBe(false);
      expect(isDateTimeSegmentType('M')).toBe(false);
      expect(isDateTimeSegmentType('h')).toBe(false);
      expect(isDateTimeSegmentType('s')).toBe(false);
      expect(isDateTimeSegmentType('ms')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isDateTimeSegmentType('')).toBe(false);
    });

    it('should return false for random strings', () => {
      expect(isDateTimeSegmentType('random')).toBe(false);
      expect(isDateTimeSegmentType('date')).toBe(false);
      expect(isDateTimeSegmentType('time')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(isDateTimeSegmentType('dd')).toBe(false);
      expect(isDateTimeSegmentType('Mm')).toBe(false);
      expect(isDateTimeSegmentType('yyyy')).toBe(false);
      expect(isDateTimeSegmentType('hh')).toBe(false);
      expect(isDateTimeSegmentType('MM')).toBe(true);
      expect(isDateTimeSegmentType('mm')).toBe(true);
    });
  });
});
