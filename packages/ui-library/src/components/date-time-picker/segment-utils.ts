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
 * Applies the entered date segments, keeping the day inside the month the year
 * and month land on.
 *
 * @param base - the date to apply them to
 * @param segments - the segments entered so far
 * @returns the date with its year, month and day set
 */
function applyDateSegments(base: Dayjs, { day, month, year }: SegmentValues): Dayjs {
  let dateTime = base;

  if (year !== undefined)
    dateTime = dateTime.year(year);

  if (month !== undefined)
    dateTime = dateTime.month(month - 1);

  if (day !== undefined)
    dateTime = dateTime.date(Math.min(day, dateTime.daysInMonth()));

  return dateTime;
}

/**
 * Builds a date from the segments that have been entered so far. Segments the
 * accuracy does not expose are zeroed rather than inherited from the clock the
 * base date started at, so a value cannot pick up a stray second.
 */
export function buildDateTime(segments: SegmentValues, accuracy: TimeAccuracy, base: Dayjs = dayjs()): Dayjs {
  const { hour, millisecond, minute, second } = segments;
  let dateTime = applyDateSegments(base, segments);

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

const MILLISECONDS = 1000;

/**
 * Turns a `minDate` / `maxDate` prop into a Date. An `epoch` picker states its
 * bounds in whole seconds, so those are widened to milliseconds first.
 */
export function resolveBound(bound: Date | number | undefined, epochSeconds: boolean): Date | undefined {
  if (bound === undefined) {
    return undefined;
  }

  if (epochSeconds && typeof bound === 'number') {
    return new Date(bound * MILLISECONDS);
  }

  return new Date(bound);
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

const UNIX_SECONDS = /^\d{9,10}$/;
const UNIX_MILLISECONDS = /^\d{12,13}$/;
const UTC_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/i;
const UTC_NAME = /\s+(?:UTC|GMT)$/i;
const ZONE_NAME = /\s+[A-Z]{2,5}$/i;
const ISO_FORMATS = ['YYYY-MM-DD[T]HH:mm:ss.SSS', 'YYYY-MM-DD HH:mm:ss.SSS'];

/**
 * Lists a format followed by its shorter forms, dropping the millisecond, the
 * second and then the whole time, so a paste may stop short of the field's
 * accuracy.
 *
 * @param format - the full format
 * @returns the format and every shorter form of it
 */
function withTruncations(format: string): string[] {
  const truncations = [format];
  for (const suffix of ['.SSS', ':ss', /[\sT[\]]+HH:mm$/]) {
    const last = truncations.at(-1)!;
    const shorter = last.replace(suffix, '');
    if (shorter !== last)
      truncations.push(shorter);
  }
  return truncations;
}

/**
 * Reads a pasted date into the wall-clock time of the field's timezone.
 *
 * Accepts the field's own format and ISO dates, either cut short at any
 * segment, as well as unix timestamps in seconds or milliseconds. A trailing
 * `Z`, numeric offset, `UTC` or `GMT` makes the text an instant that is moved
 * into the timezone. Any other zone name, such as `CEST`, cannot be resolved
 * reliably and is dropped, reading the rest as wall-clock time.
 *
 * @param pastedText - the text from the clipboard
 * @param dateFormat - the field's format
 * @param timezone - the field's timezone, the local one when undefined
 * @returns the date, or undefined when the text is not one
 */
export function parsePastedDate(pastedText: string, dateFormat: string, timezone?: string): Dayjs | undefined {
  const text = pastedText.trim();

  if (UNIX_SECONDS.test(text))
    return dayjs.unix(Number(text)).tz(timezone);
  if (UNIX_MILLISECONDS.test(text))
    return dayjs(Number(text)).tz(timezone);

  if (UTC_OFFSET.test(text)) {
    const instant = dayjs(text.replace(' ', 'T'));
    return instant.isValid() ? instant.tz(timezone) : undefined;
  }

  const formats = [dateFormat, ...ISO_FORMATS].flatMap(format => withTruncations(format));
  if (UTC_NAME.test(text))
    return parseWallClock(text.replace(UTC_NAME, ''), formats, true)?.tz(timezone);
  return parseWallClock(text.replace(ZONE_NAME, ''), formats, false);
}

function parseWallClock(text: string, formats: string[], utc: boolean): Dayjs | undefined {
  for (const format of formats) {
    const date = utc ? dayjs.utc(text, format, true) : dayjs(text, format, true);
    if (date.isValid())
      return date;
  }
  return undefined;
}

export function parseAndSetDateValues(
  pastedText: string,
  dateFormat: string,
  accuracy: TimeAccuracy,
  setValue: (segment: DateTimeSegmentType, value?: number) => void,
  timezone?: string,
): boolean {
  const date = parsePastedDate(pastedText, dateFormat, timezone);
  if (!date)
    return false;

  setValue('YYYY', date.year());
  setValue('MM', date.month() + 1);
  setValue('DD', date.date());
  setValue('HH', date.hour());
  setValue('mm', date.minute());
  if (includeSeconds(accuracy))
    setValue('ss', date.second());
  if (includeMilliseconds(accuracy))
    setValue('SSS', date.millisecond());
  return true;
}
