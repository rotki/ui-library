import dayjs from 'dayjs';
import { timezones } from '@/components/date-time-picker/timezones';
import { TimeAccuracy } from '@/consts/time-accuracy';
import '@/components/date-time-picker/dayjs-setup';

export function guessTimezone() {
  const timezone = dayjs.tz.guess();
  return timezones.find(tz => tz === timezone);
}

export function includeSeconds(accuracy: TimeAccuracy): boolean {
  return accuracy === TimeAccuracy.SECOND || accuracy === TimeAccuracy.MILLISECOND;
}

export function includeMilliseconds(accuracy: TimeAccuracy): boolean {
  return accuracy === TimeAccuracy.MILLISECOND;
}

/**
 * Formats the picked date and time as a timezone-less wall-clock reading, so it
 * can be parsed in the selected timezone and pick up that date's own UTC offset.
 */
export function formatWallClock(date: Date, time: Date, accuracy: TimeAccuracy): string {
  const pad = (value: number, length = 2): string => value.toString().padStart(length, '0');

  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const seconds = includeSeconds(accuracy) ? time.getSeconds() : 0;
  const milliseconds = includeMilliseconds(accuracy) ? time.getMilliseconds() : 0;

  return `${day}T${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}
