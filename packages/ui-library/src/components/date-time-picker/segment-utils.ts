import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs, { type Dayjs } from 'dayjs';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';

import '@/components/date-time-picker/dayjs-setup';

export interface SegmentValues {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

/**
 * Builds a date from the segments that have been entered so far. Segments the
 * accuracy does not expose are zeroed rather than inherited from the clock the
 * base date started at, so a value cannot pick up a stray second.
 */
export function buildDateTime(segments: SegmentValues, accuracy: TimeAccuracy, base: Dayjs = dayjs()): Dayjs {
  const { day, hour, millisecond, minute, month, second, year } = segments;
  let dateTime = base;

  if (year !== undefined)
    dateTime = dateTime.year(year);

  if (month !== undefined)
    dateTime = dateTime.month(month - 1);

  if (day !== undefined)
    dateTime = dateTime.date(Math.min(day, dateTime.daysInMonth()));

  if (hour !== undefined)
    dateTime = dateTime.hour(hour);

  if (minute !== undefined)
    dateTime = dateTime.minute(minute);

  if (second !== undefined)
    dateTime = dateTime.second(second);
  else if (!includeSeconds(accuracy))
    dateTime = dateTime.second(0);

  if (millisecond !== undefined)
    dateTime = dateTime.millisecond(millisecond);
  else if (!includeMilliseconds(accuracy))
    dateTime = dateTime.millisecond(0);

  return dateTime;
}

/**
 * Pulls a date inside the allowed range. Used by the `now` and `today` actions,
 * which have no partial state: typed input is left to diverge and explain
 * itself through the error message instead, since clamping a keystroke would
 * rewrite a year the moment its first digit landed below the minimum.
 */
export function clampToBounds(date: Dayjs, min: Date, max?: Date): Dayjs {
  const lower = dayjs(min);
  if (date.isBefore(lower)) {
    return lower;
  }

  if (max && date.isAfter(max)) {
    return dayjs(max);
  }

  return date;
}

export function getClickPosition(
  event: MouseEvent,
  input: HTMLInputElement,
  useCaretPosition: boolean,
): number {
  const fallback = input.selectionStart ?? 0;
  if (!useCaretPosition)
    return fallback;
  const caretPos = document.caretPositionFromPoint?.(event.clientX, event.clientY);
  if (caretPos)
    return caretPos.offset;
  return document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startOffset ?? fallback;
}

export function parseAndSetDateValues(
  pastedText: string,
  dateFormat: string,
  accuracy: TimeAccuracy,
  setValue: (segment: DateTimeSegmentType, value?: number) => void,
): void {
  try {
    const parsedDate = dayjs(pastedText, dateFormat);

    if (!parsedDate.isValid()) {
      return;
    }

    const date = parsedDate.toDate();
    setValue('YYYY', date.getFullYear());
    setValue('MM', date.getMonth() + 1);
    setValue('DD', date.getDate());
    setValue('HH', date.getHours());
    setValue('mm', date.getMinutes());
    if (includeSeconds(accuracy)) {
      setValue('ss', date.getSeconds());
    }
    if (includeMilliseconds(accuracy)) {
      setValue('SSS', date.getMilliseconds());
    }
  }
  catch {
    // Invalid format, ignore paste
  }
}
