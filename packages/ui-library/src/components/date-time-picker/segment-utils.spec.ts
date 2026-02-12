import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { describe, expect, it, vi } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { getClickPosition, parseAndSetDateValues } from './segment-utils';

dayjs.extend(customParseFormat);

describe('date-time-picker/segment-utils', () => {
  describe('getClickPosition', () => {
    function createMockInput(selectionStart: number | null): HTMLInputElement {
      return { selectionStart } as HTMLInputElement;
    }

    function createMockMouseEvent(clientX: number, clientY: number): MouseEvent {
      return { clientX, clientY } as MouseEvent;
    }

    it('should return selectionStart when useCaretPosition is false', () => {
      const input = createMockInput(5);
      const event = createMockMouseEvent(100, 200);
      expect(getClickPosition(event, input, false)).toBe(5);
    });

    it('should return 0 when selectionStart is null and useCaretPosition is false', () => {
      const input = createMockInput(null);
      const event = createMockMouseEvent(100, 200);
      expect(getClickPosition(event, input, false)).toBe(0);
    });

    it('should use caretPositionFromPoint when available and useCaretPosition is true', () => {
      const input = createMockInput(3);
      const event = createMockMouseEvent(100, 200);
      const original = document.caretPositionFromPoint;
      document.caretPositionFromPoint = vi.fn().mockReturnValue({ offset: 7 });
      try {
        expect(getClickPosition(event, input, true)).toBe(7);
        expect(document.caretPositionFromPoint).toHaveBeenCalledWith(100, 200);
      }
      finally {
        document.caretPositionFromPoint = original;
      }
    });

    it('should fall back to caretRangeFromPoint when caretPositionFromPoint is unavailable', () => {
      const input = createMockInput(3);
      const event = createMockMouseEvent(100, 200);
      const originalCaretPosition = document.caretPositionFromPoint;
      const originalCaretRange = document.caretRangeFromPoint;
      document.caretPositionFromPoint = undefined as any;
      document.caretRangeFromPoint = vi.fn().mockReturnValue({ startOffset: 9 });
      try {
        expect(getClickPosition(event, input, true)).toBe(9);
      }
      finally {
        document.caretPositionFromPoint = originalCaretPosition;
        document.caretRangeFromPoint = originalCaretRange;
      }
    });

    it('should fall back to selectionStart when neither caret API is available', () => {
      const input = createMockInput(4);
      const event = createMockMouseEvent(100, 200);
      const originalCaretPosition = document.caretPositionFromPoint;
      const originalCaretRange = document.caretRangeFromPoint;
      document.caretPositionFromPoint = undefined as any;
      document.caretRangeFromPoint = vi.fn().mockReturnValue(null);
      try {
        expect(getClickPosition(event, input, true)).toBe(4);
      }
      finally {
        document.caretPositionFromPoint = originalCaretPosition;
        document.caretRangeFromPoint = originalCaretRange;
      }
    });
  });

  describe('parseAndSetDateValues', () => {
    function createSetValueSpy(): {
      setValue: (segment: DateTimeSegmentType, value?: number) => void;
      calls: [DateTimeSegmentType, number | undefined][];
    } {
      const calls: [DateTimeSegmentType, number | undefined][] = [];
      return {
        calls,
        setValue(segment: DateTimeSegmentType, value?: number): void {
          calls.push([segment, value]);
        },
      };
    }

    it('should parse a valid date string and set all base segments', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('2024/01/15 10:30', 'YYYY/MM/DD HH:mm', TimeAccuracy.MINUTE, setValue);

      expect(calls).toContainEqual(['YYYY', 2024]);
      expect(calls).toContainEqual(['MM', 1]);
      expect(calls).toContainEqual(['DD', 15]);
      expect(calls).toContainEqual(['HH', 10]);
      expect(calls).toContainEqual(['mm', 30]);
    });

    it('should include seconds when accuracy is SECOND', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('2024/01/15 10:30:45', 'YYYY/MM/DD HH:mm:ss', TimeAccuracy.SECOND, setValue);

      expect(calls).toContainEqual(['ss', 45]);
      expect(calls.find(([seg]) => seg === 'SSS')).toBeUndefined();
    });

    it('should include seconds and milliseconds when accuracy is MILLISECOND', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('2024/01/15 10:30:45.123', 'YYYY/MM/DD HH:mm:ss.SSS', TimeAccuracy.MILLISECOND, setValue);

      expect(calls).toContainEqual(['ss', 45]);
      expect(calls).toContainEqual(['SSS', 123]);
    });

    it('should not include seconds when accuracy is MINUTE', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('2024/01/15 10:30', 'YYYY/MM/DD HH:mm', TimeAccuracy.MINUTE, setValue);

      expect(calls.find(([seg]) => seg === 'ss')).toBeUndefined();
      expect(calls.find(([seg]) => seg === 'SSS')).toBeUndefined();
    });

    it('should not call setValue for invalid date string', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('not-a-date', 'YYYY/MM/DD HH:mm', TimeAccuracy.MINUTE, setValue);

      expect(calls).toHaveLength(0);
    });

    it('should not throw on malformed input', () => {
      const { setValue } = createSetValueSpy();
      expect(() => {
        parseAndSetDateValues('', 'YYYY/MM/DD HH:mm', TimeAccuracy.MINUTE, setValue);
      }).not.toThrow();
    });

    it('should correctly adjust month to 1-based', () => {
      const { calls, setValue } = createSetValueSpy();
      parseAndSetDateValues('2024/12/25 00:00', 'YYYY/MM/DD HH:mm', TimeAccuracy.MINUTE, setValue);

      const monthCall = calls.find(([seg]) => seg === 'MM');
      expect(monthCall).toEqual(['MM', 12]);
    });
  });
});
