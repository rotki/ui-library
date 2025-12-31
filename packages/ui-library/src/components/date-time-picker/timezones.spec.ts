import { describe, expect, it } from 'vitest';
import { timezones } from './timezones';

describe('date-time-picker/timezones', () => {
  describe('timezones array', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones.length).toBeGreaterThan(0);
    });

    it('should contain strings only', () => {
      timezones.forEach((tz) => {
        expect(typeof tz).toBe('string');
      });
    });

    it('should contain common US timezones', () => {
      const usTimezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Phoenix',
        'US/Eastern',
        'US/Central',
        'US/Mountain',
        'US/Pacific',
      ];

      usTimezones.forEach((tz) => {
        expect(timezones).toContain(tz);
      });
    });

    it('should contain common European timezones', () => {
      const euTimezones = [
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Rome',
        'Europe/Madrid',
        'Europe/Amsterdam',
        'Europe/Brussels',
        'Europe/Vienna',
        'Europe/Warsaw',
        'Europe/Moscow',
      ];

      euTimezones.forEach((tz) => {
        expect(timezones).toContain(tz);
      });
    });

    it('should contain common Asian timezones', () => {
      const asiaTimezones = [
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Hong_Kong',
        'Asia/Singapore',
        'Asia/Seoul',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Bangkok',
        'Asia/Jakarta',
      ];

      asiaTimezones.forEach((tz) => {
        expect(timezones).toContain(tz);
      });
    });

    it('should contain common Australian timezones', () => {
      const ausTimezones = [
        'Australia/Sydney',
        'Australia/Melbourne',
        'Australia/Brisbane',
        'Australia/Perth',
        'Australia/Adelaide',
      ];

      ausTimezones.forEach((tz) => {
        expect(timezones).toContain(tz);
      });
    });

    it('should contain UTC and GMT timezones', () => {
      const utcTimezones = [
        'UTC',
        'GMT',
        'Etc/UTC',
        'Etc/GMT',
      ];

      utcTimezones.forEach((tz) => {
        expect(timezones).toContain(tz);
      });
    });

    it('should contain timezone offset variations', () => {
      expect(timezones).toContain('Etc/GMT+0');
      expect(timezones).toContain('Etc/GMT-0');
      expect(timezones).toContain('Etc/GMT+12');
      expect(timezones).toContain('Etc/GMT-12');
    });

    it('should contain timezones from all major regions', () => {
      const regions = ['Africa/', 'America/', 'Antarctica/', 'Asia/', 'Atlantic/', 'Australia/', 'Europe/', 'Indian/', 'Pacific/'];

      regions.forEach((region) => {
        const hasRegion = timezones.some(tz => tz.startsWith(region));
        expect(hasRegion).toBe(true);
      });
    });

    it('should not contain duplicates', () => {
      const uniqueTimezones = new Set(timezones);
      expect(uniqueTimezones.size).toBe(timezones.length);
    });

    it('should have timezones in valid format (no spaces)', () => {
      timezones.forEach((tz) => {
        expect(tz).not.toContain(' ');
      });
    });

    it('should include deprecated but commonly used timezone aliases', () => {
      const aliases = [
        'Japan',
        'Singapore',
        'Hongkong',
        'Iceland',
        'Cuba',
        'Egypt',
        'Israel',
        'Poland',
        'Portugal',
        'Turkey',
      ];

      aliases.forEach((alias) => {
        expect(timezones).toContain(alias);
      });
    });
  });
});
