import dayjs from 'dayjs';
import { timezones } from '@/components/date-time-picker/timezones';
import { TimeAccuracy } from '@/consts/time-accuracy';

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
