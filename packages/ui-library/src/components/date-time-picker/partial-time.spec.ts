import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { completePartialEntry } from './partial-time';

describe('completePartialEntry', () => {
  const date = { day: 15, month: 6, year: 2023 };
  const bounds = { maxDate: undefined, minDate: new Date(1970, 0, 1) };

  function format(value: ReturnType<typeof completePartialEntry>): string | undefined {
    return value?.format('DD/MM/YYYY HH:mm:ss.SSS');
  }

  it('should give a bare date the start of its day', () => {
    const result = completePartialEntry(date, { ...bounds, accuracy: 'second', mode: 'start' });

    expect(format(result)).toBe('15/06/2023 00:00:00.000');
  });

  it('should give a bare date the end of its day', () => {
    const result = completePartialEntry(date, { ...bounds, accuracy: 'second', mode: 'end' });

    // the accuracy stops at the second, so the milliseconds are not the fill's to set
    expect(format(result)).toBe('15/06/2023 23:59:59.000');
  });

  it('should run to the last millisecond when the accuracy exposes them', () => {
    const result = completePartialEntry(date, { ...bounds, accuracy: 'millisecond', mode: 'end' });

    expect(format(result)).toBe('15/06/2023 23:59:59.999');
  });

  it('should keep the segments the entry did reach', () => {
    const result = completePartialEntry({ ...date, hour: 9 }, { ...bounds, accuracy: 'second', mode: 'end' });

    expect(format(result)).toBe('15/06/2023 09:59:59.000');
  });

  it('should return nothing for an entry with no gaps left', () => {
    const complete = { ...date, hour: 9, minute: 30, second: 15 };

    expect(completePartialEntry(complete, { ...bounds, accuracy: 'second', mode: 'end' })).toBeUndefined();
  });

  // at this accuracy the second is not a segment the entry could have reached
  it('should ignore a missing second the accuracy does not expose', () => {
    const entry = { ...date, hour: 9, minute: 30 };

    expect(completePartialEntry(entry, { ...bounds, accuracy: 'minute', mode: 'end' })).toBeUndefined();
  });

  it('should return nothing while the date itself is incomplete', () => {
    const entry = { day: 15, month: 6 };

    expect(completePartialEntry(entry, { ...bounds, accuracy: 'second', mode: 'start' })).toBeUndefined();
  });

  it('should pull a fill that overshot back to the bound', () => {
    const maxDate = new Date(2023, 5, 15, 14, 30, 45);

    const result = completePartialEntry(date, { ...bounds, accuracy: 'second', maxDate, mode: 'end' });

    expect(result?.valueOf()).toBe(dayjs(maxDate).valueOf());
  });

  // clamping here would move the day the user typed, which is theirs to fix
  it('should leave a date that is out of range where it is', () => {
    const maxDate = new Date(2023, 5, 10, 12, 0);

    const result = completePartialEntry(date, { ...bounds, accuracy: 'second', maxDate, mode: 'end' });

    expect(format(result)).toBe('15/06/2023 23:59:59.000');
  });
});
