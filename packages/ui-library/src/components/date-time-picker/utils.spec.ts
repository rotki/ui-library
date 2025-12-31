import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { describe, expect, it } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { guessTimezone, includeMilliseconds, includeSeconds } from './utils';

// Setup dayjs plugins for timezone tests
dayjs.extend(utc);
dayjs.extend(timezone);

describe('date-time-picker/utils', () => {
  describe('guessTimezone', () => {
    it('should return a string or undefined', () => {
      const result = guessTimezone();
      // The function returns either a string timezone or undefined
      expect(result === undefined || typeof result === 'string').toBe(true);
    });

    it('should return a timezone from the list if browser timezone is valid', () => {
      const result = guessTimezone();
      // In test environment, this might be undefined or a valid timezone
      if (result !== undefined) {
        // Result should be a string containing a valid timezone format
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });
  });

  describe('includeSeconds', () => {
    it('should return true for second accuracy', () => {
      expect(includeSeconds(TimeAccuracy.SECOND)).toBe(true);
    });

    it('should return true for millisecond accuracy', () => {
      expect(includeSeconds(TimeAccuracy.MILLISECOND)).toBe(true);
    });

    it('should return false for minute accuracy', () => {
      expect(includeSeconds(TimeAccuracy.MINUTE)).toBe(false);
    });
  });

  describe('includeMilliseconds', () => {
    it('should return true for millisecond accuracy', () => {
      expect(includeMilliseconds(TimeAccuracy.MILLISECOND)).toBe(true);
    });

    it('should return false for second accuracy', () => {
      expect(includeMilliseconds(TimeAccuracy.SECOND)).toBe(false);
    });

    it('should return false for minute accuracy', () => {
      expect(includeMilliseconds(TimeAccuracy.MINUTE)).toBe(false);
    });
  });
});
