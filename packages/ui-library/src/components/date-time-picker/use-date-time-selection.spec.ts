import { mount } from '@vue/test-utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useDateTimeSelection } from './use-date-time-selection';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

vi.mock('@/components/date-time-picker/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/date-time-picker/utils')>();
  return {
    ...actual,
    guessTimezone: () => 'UTC',
  };
});

// Helper to test composable with proper lifecycle hooks
function withSetup<T>(composable: () => T): { result: T; unmount: () => void } {
  let result!: T;
  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);
  return { result, unmount: () => wrapper.unmount() };
}

describe('use-date-time-selection', () => {
  const fixedDate = new Date(2023, 5, 15, 14, 30, 45, 500);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with undefined values when allowEmpty is true and modelValue is undefined', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(get(result.selectedYear)).toBeUndefined();
      expect(get(result.selectedMonth)).toBeUndefined();
      expect(get(result.selectedDay)).toBeUndefined();
      expect(get(result.selectedHour)).toBeUndefined();
      expect(get(result.selectedMinute)).toBeUndefined();
      expect(get(result.valueSet)).toBe(false);

      unmount();
    });

    it('should initialize with current date when allowEmpty is false and modelValue is undefined', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      expect(get(modelValue)).toBeDefined();
      const emittedDate = dayjs(get(modelValue));
      expect(emittedDate.year()).toBe(2023);
      expect(emittedDate.month()).toBe(5);
      expect(emittedDate.date()).toBe(15);

      unmount();
    });

    it('should initialize with provided modelValue for epoch-ms type', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<number | undefined>(testDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      expect(get(result.selectedYear)).toBe(2022);
      expect(get(result.selectedMonth)).toBe(4); // April (1-indexed)
      expect(get(result.selectedDay)).toBe(20);
      expect(get(result.selectedHour)).toBe(10);
      expect(get(result.selectedMinute)).toBe(15);

      unmount();
    });

    it('should initialize with provided modelValue for epoch type', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15);
      const epochSeconds = Math.floor(testDate.getTime() / 1000);
      const modelValue = ref<number | undefined>(epochSeconds);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch',
      }));

      await nextTick();

      expect(get(result.selectedYear)).toBe(2022);
      expect(get(result.selectedMonth)).toBe(4);
      expect(get(result.selectedDay)).toBe(20);
      expect(get(result.selectedHour)).toBe(10);
      expect(get(result.selectedMinute)).toBe(15);

      unmount();
    });

    it('should initialize with provided modelValue for date type', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<Date | undefined>(testDate);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'date',
      }));

      await nextTick();

      expect(get(result.selectedYear)).toBe(2022);
      expect(get(result.selectedMonth)).toBe(4);
      expect(get(result.selectedDay)).toBe(20);
      expect(get(result.selectedHour)).toBe(10);
      expect(get(result.selectedMinute)).toBe(15);

      unmount();
    });

    it('should initialize with seconds when accuracy is second', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15, 30);
      const modelValue = ref<number | undefined>(testDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'second',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      expect(get(result.selectedSecond)).toBe(30);

      unmount();
    });

    it('should initialize with milliseconds when accuracy is millisecond', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15, 30, 456);
      const modelValue = ref<number | undefined>(testDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'millisecond',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      expect(get(result.selectedSecond)).toBe(30);
      expect(get(result.selectedMillisecond)).toBe(456);

      unmount();
    });
  });

  describe('selectedDate computed', () => {
    it('should return undefined when not all date fields are set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 6);
      // selectedDay is not set

      expect(get(result.selectedDate)).toBeUndefined();

      unmount();
    });

    it('should return a Date when all date fields are set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 6);
      set(result.selectedDay, 15);

      const selectedDate = get(result.selectedDate);
      expect(selectedDate).toBeInstanceOf(Date);
      expect(selectedDate?.getFullYear()).toBe(2023);
      expect(selectedDate?.getMonth()).toBe(5); // June (0-indexed)
      expect(selectedDate?.getDate()).toBe(15);

      unmount();
    });

    it('should handle month overflow correctly when setting date', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      // Setting December 30, 2023 then changing to February
      set(result.selectedYear, 2023);
      set(result.selectedMonth, 12); // December
      set(result.selectedDay, 30);

      // Now change to February - should not overflow
      set(result.selectedDate, new Date(2023, 1, 15)); // February 15

      expect(get(result.selectedMonth)).toBe(2); // February (1-indexed)
      expect(get(result.selectedDay)).toBe(15);

      unmount();
    });
  });

  describe('selectedTime computed', () => {
    it('should return undefined when hour or minute are not set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedHour, 14);
      // selectedMinute is not set

      expect(get(result.selectedTime)).toBeUndefined();

      unmount();
    });

    it('should return a Date when hour and minute are set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedHour, 14);
      set(result.selectedMinute, 30);

      const selectedTime = get(result.selectedTime);
      expect(selectedTime).toBeInstanceOf(Date);
      expect(selectedTime?.getHours()).toBe(14);
      expect(selectedTime?.getMinutes()).toBe(30);

      unmount();
    });
  });

  describe('valueSet computed', () => {
    it('should return false when date or time is not fully set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 6);
      set(result.selectedDay, 15);
      // Time is not set

      expect(get(result.valueSet)).toBe(false);

      unmount();
    });

    it('should return true when both date and time are fully set', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 6);
      set(result.selectedDay, 15);
      set(result.selectedHour, 14);
      set(result.selectedMinute, 30);

      expect(get(result.valueSet)).toBe(true);

      unmount();
    });
  });

  describe('minAllowedDate computed', () => {
    it('should return default min date (1970-01-01) when minDate is undefined', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      const minDate = get(result.minAllowedDate);
      expect(minDate.getFullYear()).toBe(1970);
      expect(minDate.getMonth()).toBe(0);
      expect(minDate.getDate()).toBe(1);

      unmount();
    });

    it('should return the provided minDate as Date', () => {
      const modelValue = ref<number | undefined>(undefined);
      const minDate = new Date(2020, 0, 1);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(get(result.minAllowedDate)).toEqual(minDate);

      unmount();
    });

    it('should convert epoch to Date for minDate when type is epoch', () => {
      const modelValue = ref<number | undefined>(undefined);
      const minDateTimestamp = new Date(2020, 0, 1);
      const minDateEpoch = Math.floor(minDateTimestamp.getTime() / 1000);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: minDateEpoch,
        modelValue,
        type: 'epoch',
      }));

      const minAllowed = get(result.minAllowedDate);
      expect(minAllowed.getFullYear()).toBe(2020);
      expect(minAllowed.getMonth()).toBe(0);
      expect(minAllowed.getDate()).toBe(1);

      unmount();
    });
  });

  describe('maxAllowedDate computed', () => {
    it('should return undefined when maxDate is undefined', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(get(result.maxAllowedDate)).toBeUndefined();

      unmount();
    });

    it('should return the provided maxDate as Date', () => {
      const modelValue = ref<number | undefined>(undefined);
      const maxDate = new Date(2025, 11, 31);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(get(result.maxAllowedDate)).toEqual(maxDate);

      unmount();
    });

    it('should return current time when maxDate is "now"', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: 'now',
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      const maxAllowed = get(result.maxAllowedDate);
      expect(maxAllowed).toBeDefined();
      expect(maxAllowed?.getFullYear()).toBe(fixedDate.getFullYear());
      expect(maxAllowed?.getMonth()).toBe(fixedDate.getMonth());
      expect(maxAllowed?.getDate()).toBe(fixedDate.getDate());

      unmount();
    });

    it('should convert epoch to Date for maxDate when type is epoch', () => {
      const modelValue = ref<number | undefined>(undefined);
      const maxDateTimestamp = new Date(2025, 11, 31);
      const maxDateEpoch = Math.floor(maxDateTimestamp.getTime() / 1000);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: maxDateEpoch,
        minDate: undefined,
        modelValue,
        type: 'epoch',
      }));

      const maxAllowed = get(result.maxAllowedDate);
      expect(maxAllowed?.getFullYear()).toBe(2025);
      expect(maxAllowed?.getMonth()).toBe(11);
      expect(maxAllowed?.getDate()).toBe(31);

      unmount();
    });
  });

  describe('isDateValid', () => {
    it('should return true for valid date within bounds', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: new Date(2025, 11, 31),
        minDate: new Date(2020, 0, 1),
        modelValue,
        type: 'epoch-ms',
      }));

      const testDate = dayjs('2023-06-15');
      expect(result.isDateValid(testDate)).toBe(true);
      expect(get(result.internalErrorMessages)).toHaveLength(0);

      unmount();
    });

    it('should return false and set error when date is before minDate', () => {
      const modelValue = ref<number | undefined>(undefined);
      const minDate = new Date(2020, 0, 10);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate,
        modelValue,
        type: 'epoch-ms',
      }));

      const testDate = dayjs('2019-12-31');
      expect(result.isDateValid(testDate)).toBe(false);
      expect(get(result.internalErrorMessages).length).toBeGreaterThan(0);
      expect(get(result.internalErrorMessages)[0]).toContain('Date cannot be before');

      unmount();
    });

    it('should return false and set error when date is after maxDate', () => {
      const modelValue = ref<number | undefined>(undefined);
      const maxDate = new Date(2023, 5, 1);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      const testDate = dayjs('2023-06-15');
      expect(result.isDateValid(testDate)).toBe(false);
      expect(get(result.internalErrorMessages).length).toBeGreaterThan(0);
      expect(get(result.internalErrorMessages)[0]).toContain('Date cannot be after');

      unmount();
    });

    it('should show future date error when maxDate is "now"', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: 'now',
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      const futureDate = dayjs('2024-01-01');
      expect(result.isDateValid(futureDate)).toBe(false);
      expect(get(result.internalErrorMessages)[0]).toContain('cannot be in the future');

      unmount();
    });
  });

  describe('clear', () => {
    it('should clear all selected values', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15, 30, 456);
      const modelValue = ref<number | undefined>(testDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'millisecond',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      // Verify values are set (via onMounted)
      expect(get(result.selectedYear)).toBe(2022);
      expect(get(result.selectedMonth)).toBe(4);

      // Clear
      result.clear();

      expect(get(result.selectedYear)).toBeUndefined();
      expect(get(result.selectedMonth)).toBeUndefined();
      expect(get(result.selectedDay)).toBeUndefined();
      expect(get(result.selectedHour)).toBeUndefined();
      expect(get(result.selectedMinute)).toBeUndefined();
      expect(get(result.selectedSecond)).toBeUndefined();
      expect(get(result.selectedMillisecond)).toBeUndefined();
      expect(get(modelValue)).toBeUndefined();

      unmount();
    });

    it('should clear internal error messages', async () => {
      const modelValue = ref<number | undefined>(undefined);
      const minDate = new Date(2023, 5, 1);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate,
        modelValue,
        type: 'epoch-ms',
      }));

      // Trigger an error
      const invalidDate = dayjs('2022-01-01');
      result.isDateValid(invalidDate);
      expect(get(result.internalErrorMessages).length).toBeGreaterThan(0);

      // Clear
      result.clear();

      expect(get(result.internalErrorMessages)).toHaveLength(0);

      unmount();
    });
  });

  describe('setNow', () => {
    it('should set all fields to current date and time', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      result.setNow();
      await nextTick();

      expect(get(result.selectedYear)).toBe(2023);
      expect(get(result.selectedMonth)).toBe(6); // June (1-indexed)
      expect(get(result.selectedDay)).toBe(15);
      expect(get(result.selectedHour)).toBe(14);
      expect(get(result.selectedMinute)).toBe(30);

      unmount();
    });

    it('should set seconds when accuracy is second', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'second',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      result.setNow();
      await nextTick();

      expect(get(result.selectedSecond)).toBe(45);

      unmount();
    });

    it('should set milliseconds when accuracy is millisecond', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'millisecond',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      result.setNow();
      await nextTick();

      expect(get(result.selectedSecond)).toBe(45);
      expect(get(result.selectedMillisecond)).toBe(500);

      unmount();
    });

    it('should emit correct epoch-ms value', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      result.setNow();
      await nextTick();

      const expected = dayjs(fixedDate).set('second', 0).set('millisecond', 0).valueOf();
      expect(get(modelValue)).toBe(expected);

      unmount();
    });

    it('should emit correct epoch value', async () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch',
      }));

      result.setNow();
      await nextTick();

      const expected = dayjs(fixedDate).set('second', 0).set('millisecond', 0).valueOf() / 1000;
      expect(get(modelValue)).toBe(expected);

      unmount();
    });

    it('should emit correct Date value', async () => {
      const modelValue = ref<Date | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'date',
      }));

      result.setNow();
      await nextTick();

      expect(get(modelValue)).toBeInstanceOf(Date);
      const emittedDate = get(modelValue) as Date;
      expect(emittedDate.getFullYear()).toBe(2023);
      expect(emittedDate.getMonth()).toBe(5);
      expect(emittedDate.getDate()).toBe(15);

      unmount();
    });
  });

  describe('getDateTime', () => {
    it('should return a dayjs object with all set values', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'millisecond',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 6);
      set(result.selectedDay, 15);
      set(result.selectedHour, 14);
      set(result.selectedMinute, 30);
      set(result.selectedSecond, 45);
      set(result.selectedMillisecond, 500);

      const dateTime = result.getDateTime();
      expect(dateTime.year()).toBe(2023);
      expect(dateTime.month()).toBe(5); // June (0-indexed)
      expect(dateTime.date()).toBe(15);
      expect(dateTime.hour()).toBe(14);
      expect(dateTime.minute()).toBe(30);
      expect(dateTime.second()).toBe(45);
      expect(dateTime.millisecond()).toBe(500);

      unmount();
    });

    it('should handle day overflow when month has fewer days', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      set(result.selectedYear, 2023);
      set(result.selectedMonth, 2); // February
      set(result.selectedDay, 31); // Invalid for February

      const dateTime = result.getDateTime();
      // Should clamp to max days in February
      expect(dateTime.date()).toBe(28);

      unmount();
    });
  });

  describe('segmentData', () => {
    it('should return the correct segment data structure', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(result.segmentData).toHaveProperty('DD');
      expect(result.segmentData).toHaveProperty('MM');
      expect(result.segmentData).toHaveProperty('YYYY');
      expect(result.segmentData).toHaveProperty('HH');
      expect(result.segmentData).toHaveProperty('mm');
      expect(result.segmentData).toHaveProperty('ss');
      expect(result.segmentData).toHaveProperty('SSS');

      unmount();
    });

    it('should update model value when segment data is modified', async () => {
      const testDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<number | undefined>(testDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      // Modify through segmentData (simulating what useInputHandler does)
      set(result.segmentData.DD, 25);
      await nextTick();

      expect(get(result.selectedDay)).toBe(25);

      unmount();
    });
  });

  describe('model value updates', () => {
    it('should update internal state when modelValue changes externally', async () => {
      const initialDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<number | undefined>(initialDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      // Verify initial values
      expect(get(result.selectedYear)).toBe(2022);

      // Update modelValue externally
      const newDate = new Date(2024, 7, 10, 16, 45);
      set(modelValue, newDate.getTime());
      await nextTick();

      expect(get(result.selectedYear)).toBe(2024);
      expect(get(result.selectedMonth)).toBe(8); // August (1-indexed)
      expect(get(result.selectedDay)).toBe(10);
      expect(get(result.selectedHour)).toBe(16);
      expect(get(result.selectedMinute)).toBe(45);

      unmount();
    });

    it('should clear internal state when modelValue becomes undefined', async () => {
      const initialDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<number | undefined>(initialDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      // Verify values are set
      expect(get(result.selectedYear)).toBe(2022);

      // Clear modelValue
      set(modelValue, undefined);
      await nextTick();

      expect(get(result.selectedYear)).toBeUndefined();
      expect(get(result.selectedMonth)).toBeUndefined();
      expect(get(result.selectedDay)).toBeUndefined();

      unmount();
    });

    it('should emit updated model value when selection changes', async () => {
      const initialDate = new Date(2022, 3, 20, 10, 15);
      const modelValue = ref<number | undefined>(initialDate.getTime());

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: false,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      await nextTick();

      // Change the year through selectedDate
      const newDate = new Date(2025, 3, 20, 10, 15);
      set(result.selectedDate, newDate);
      await nextTick();

      const updatedValue = get(modelValue);
      expect(updatedValue).toBeDefined();
      const updatedDate = new Date(updatedValue!);
      expect(updatedDate.getFullYear()).toBe(2025);

      unmount();
    });
  });

  describe('timezone handling', () => {
    it('should use guessed timezone by default', () => {
      const modelValue = ref<number | undefined>(undefined);

      const { result, unmount } = withSetup(() => useDateTimeSelection({
        accuracy: 'minute',
        allowEmpty: true,
        maxDate: undefined,
        minDate: undefined,
        modelValue,
        type: 'epoch-ms',
      }));

      expect(get(result.selectedTimezone)).toBe('UTC');

      unmount();
    });
  });
});
