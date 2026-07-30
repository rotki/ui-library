import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { describe, expect, it } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { formatWallClock, guessTimezone, includeMilliseconds, includeSeconds } from './utils';

function dateWithYear(year: number): Date {
  const date = new Date(2024, 0, 5);
  date.setFullYear(year);
  return date;
}

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
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result!.length).toBeGreaterThan(0);
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

  describe('formatWallClock', () => {
    const time = new Date(2024, 0, 5, 9, 7, 3, 42);

    it('should pad every segment to a parseable wall-clock string', () => {
      expect(formatWallClock(new Date(2024, 0, 5), time, TimeAccuracy.MILLISECOND))
        .toBe('2024-01-05T09:07:03.042');
    });

    // typing a year goes through 2, 20 and 202 before it reads 2024, and an
    // unpadded `2-01-05T…` made `dayjs.tz()` throw a RangeError
    it.each([
      [2, '0002-01-05T09:07:03.042'],
      [20, '0020-01-05T09:07:03.042'],
      [202, '0202-01-05T09:07:03.042'],
    ])('should pad a partially typed year %i to four digits', (year, expected) => {
      const formatted = formatWallClock(dateWithYear(year), time, TimeAccuracy.MILLISECOND);
      expect(formatted).toBe(expected);
      expect(dayjs.tz(formatted, 'Europe/Berlin').isValid()).toBe(true);
    });

    it('should zero the segments below the accuracy', () => {
      expect(formatWallClock(new Date(2024, 0, 5), time, TimeAccuracy.MINUTE))
        .toBe('2024-01-05T09:07:00.000');
      expect(formatWallClock(new Date(2024, 0, 5), time, TimeAccuracy.SECOND))
        .toBe('2024-01-05T09:07:03.000');
    });
  });
});
