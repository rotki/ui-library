import type { DateTimeSegmentType, SegmentData } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import type { Dayjs } from 'dayjs';
import type { Ref } from 'vue';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';

export function useInputHandler(data: SegmentData, currentValue: Ref<number | undefined>) {
  function setValue(segment: DateTimeSegmentType, value?: number) {
    if (get(data[segment]) !== value)
      set(data[segment], value);

    set(currentValue, value);
  }

  function onlySet(segment: DateTimeSegmentType, value?: number): void {
    if (get(data[segment]) === value)
      return;

    set(data[segment], value);
  }

  function update(date: Dayjs, accuracy: TimeAccuracy) {
    onlySet('YYYY', date.year());
    onlySet('MM', date.month() + 1);
    onlySet('DD', date.date());
    onlySet('hh', date.hour());
    onlySet('mm', date.minute());
    onlySet('ss', includeSeconds(accuracy) ? date.second() : undefined);
    onlySet('SSS', includeMilliseconds(accuracy) ? date.millisecond() : undefined);
  }

  function getCurrent(segment: DateTimeSegmentType): number | undefined {
    return get(data[segment]);
  }

  return { getCurrent, setValue, update };
}
