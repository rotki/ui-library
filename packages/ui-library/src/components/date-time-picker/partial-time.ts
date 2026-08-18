import type { Dayjs } from 'dayjs';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import { buildDateTime, clampToBounds, type SegmentValues } from '@/components/date-time-picker/segment-utils';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';

/**
 * Which end of the entered precision an incomplete entry stands for. `start`
 * fills the segments it never reached with their lowest value and `end` with
 * their highest, so a bare date means the whole day from either side.
 */
export type PartialTimeMode = 'start' | 'end';

interface PartialTimeOptions {
  mode: PartialTimeMode;
  accuracy: TimeAccuracy;
  minDate: Date;
  maxDate: Date | undefined;
}

type TimeSegments = Pick<SegmentValues, 'hour' | 'minute' | 'second' | 'millisecond'>;

/** What each side of the day fills a segment the entry never reached with. */
const FALLBACKS: Record<PartialTimeMode, Required<TimeSegments>> = {
  end: { hour: 23, millisecond: 999, minute: 59, second: 59 },
  start: { hour: 0, millisecond: 0, minute: 0, second: 0 },
};

/**
 * Reads the segments an entry does hold, with the ones its accuracy does not
 * expose already answered: those cannot be left out, so they never count as
 * missing.
 */
function timeSegments(segments: SegmentValues, accuracy: TimeAccuracy): TimeSegments {
  return {
    hour: segments.hour,
    millisecond: includeMilliseconds(accuracy) ? segments.millisecond : 0,
    minute: segments.minute,
    second: includeSeconds(accuracy) ? segments.second : 0,
  };
}

/**
 * Completes an entry that stopped short of the full format, so a bare date - or
 * a date and an hour - can still become a value. Returns nothing when there is
 * nothing to complete: no date to build on, or every segment already entered.
 *
 * The result is pulled back inside the bounds when the fill overshot them. The
 * date is the user's and the filled time is ours, so an `end` fill on today
 * against a `now` maximum is answered with that maximum rather than refused.
 * A clamp landing on another day means the date itself is out of range, which
 * is the user's to fix, so that is handed back unclamped to be rejected with an
 * error the user can read.
 *
 * The fill reaches as far as the entry does. A date and a time down to the
 * minute is already a value, which its field emits and reads back with a zero
 * second, and from then on that second is part of the entry rather than a gap
 * in it: `end` therefore means the last second of a bare date, and the zeroth
 * second of a date entered with its minutes.
 */
export function completePartialEntry(
  segments: SegmentValues,
  { accuracy, maxDate, minDate, mode }: PartialTimeOptions,
): Dayjs | undefined {
  const { day, month, year } = segments;
  if (year === undefined || month === undefined || day === undefined)
    return undefined;

  const time = timeSegments(segments, accuracy);
  const complete = time.hour !== undefined && time.minute !== undefined
    && time.second !== undefined && time.millisecond !== undefined;
  if (complete)
    return undefined;

  const fallback = FALLBACKS[mode];
  const candidate = buildDateTime({
    day,
    hour: time.hour ?? fallback.hour,
    millisecond: time.millisecond ?? fallback.millisecond,
    minute: time.minute ?? fallback.minute,
    month,
    second: time.second ?? fallback.second,
    year,
  }, accuracy);

  const clamped = clampToBounds(candidate, minDate, maxDate);
  return clamped.isSame(candidate, 'day') ? clamped : candidate;
}
