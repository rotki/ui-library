import type { DateTimeSegmentType, SegmentData } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';

export function useInputHandler(data: SegmentData, currentValue: Ref<number | undefined>) {
  function setValue(segment: DateTimeSegmentType, value?: number) {
    set(data[segment], value);
    set(currentValue, value);
  }

  function update(date: Date, accuracy: TimeAccuracy) {
    setValue('YYYY', date.getFullYear());
    setValue('MM', date.getMonth() + 1);
    setValue('DD', date.getDate());
    setValue('hh', date.getHours());
    setValue('mm', date.getMinutes());
    setValue('ss', includeSeconds(accuracy) ? date.getSeconds() : 0);
    setValue('SSS', includeMilliseconds(accuracy) ? date.getMilliseconds() : 0);
  }

  return { setValue, update };
}
