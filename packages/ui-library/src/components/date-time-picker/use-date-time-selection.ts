import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import type { SegmentData } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs, { type Dayjs } from 'dayjs';
import { guessTimezone, includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';
import '@/components/date-time-picker/dayjs-setup';

type DateTimeModelType = 'date' | 'epoch-ms' | 'epoch';

type ModelValueType<T extends DateTimeModelType> =
  T extends 'date' ? Date | undefined :
    T extends 'epoch-ms' ? number | undefined :
      T extends 'epoch' ? number | undefined :
        Date | number | undefined;

interface DateTimeSelectionOptions<T extends DateTimeModelType> {
  modelValue: Ref<ModelValueType<T>>;
  type: T;
  accuracy: TimeAccuracy;
  minDate: Date | number | undefined;
  maxDate: Date | number | 'now' | undefined;
  allowEmpty: boolean;
}

interface DateTimeSelectionReturn {
  selectedYear: Ref<number | undefined>;
  selectedMonth: Ref<number | undefined>;
  selectedDay: Ref<number | undefined>;
  selectedHour: Ref<number | undefined>;
  selectedMinute: Ref<number | undefined>;
  selectedSecond: Ref<number | undefined>;
  selectedMillisecond: Ref<number | undefined>;
  selectedTimezone: Ref<string | undefined>;
  selectedDate: WritableComputedRef<Date | undefined>;
  selectedTime: WritableComputedRef<Date | undefined>;
  valueSet: ComputedRef<boolean>;
  internalErrorMessages: Ref<string[]>;
  now: Ref<Dayjs>;
  segmentData: SegmentData;
  minAllowedDate: ComputedRef<Date>;
  maxAllowedDate: ComputedRef<Date | undefined>;
  getDateTime: () => Dayjs;
  setNow: () => void;
  clear: () => void;
  isDateValid: (date: Dayjs) => boolean;
}

const MILLISECONDS = 1000;

export function useDateTimeSelection<T extends DateTimeModelType>(
  options: DateTimeSelectionOptions<T>,
): DateTimeSelectionReturn {
  const {
    accuracy,
    allowEmpty,
    maxDate,
    minDate,
    modelValue,
    type,
  } = options;

  const { t } = useRuiI8n();

  const selectedYear = ref<number | undefined>();
  const selectedMonth = ref<number | undefined>();
  const selectedDay = ref<number | undefined>();

  const selectedHour = ref<number | undefined>();
  const selectedMinute = ref<number | undefined>();
  const selectedSecond = ref<number | undefined>();
  const selectedMillisecond = ref<number | undefined>();
  const selectedTimezone = ref<string | undefined>(guessTimezone());

  const internalErrorMessages = ref<string[]>([]);
  const now = ref<Dayjs>(dayjs.tz(undefined, guessTimezone()));

  const minAllowedDate = computed<Date>(() => {
    if (minDate === undefined) {
      return new Date(1970, 0, 1);
    }

    if (type === 'epoch' && typeof minDate === 'number') {
      return new Date(minDate * MILLISECONDS);
    }

    return new Date(minDate);
  });

  const maxAllowedDate = computed<Date | undefined>(() => {
    if (maxDate === undefined) {
      return undefined;
    }
    if (maxDate === 'now') {
      return get(now).toDate();
    }
    if (type === 'epoch' && typeof maxDate === 'number') {
      return new Date(maxDate * MILLISECONDS);
    }
    return new Date(maxDate);
  });

  const segmentData: SegmentData = {
    DD: selectedDay,
    HH: selectedHour,
    MM: selectedMonth,
    SSS: selectedMillisecond,
    YYYY: selectedYear,
    mm: selectedMinute,
    ss: selectedSecond,
  };

  const selectedDate = computed<Date | undefined>({
    get() {
      if (!(isDefined(selectedYear) && isDefined(selectedMonth) && isDefined(selectedDay))) {
        return undefined;
      }
      const date = new Date();
      date.setFullYear(get(selectedYear));
      // Set day to 1 first to prevent month overflow when today's day > days in target month
      // e.g., if today is Dec 30 and we set month to Feb, day 30 would overflow to March
      date.setDate(1);
      date.setMonth(get(selectedMonth) - 1);
      date.setDate(get(selectedDay));
      return date;
    },
    set(value?: Date) {
      set(selectedYear, value?.getFullYear());
      set(selectedMonth, value ? value.getMonth() + 1 : undefined);
      set(selectedDay, value?.getDate());
    },
  });

  const selectedTime = computed<Date | undefined>({
    get() {
      if (!(isDefined(selectedHour) && isDefined(selectedMinute))) {
        return undefined;
      }
      const date = new Date();
      date.setHours(
        get(selectedHour),
        get(selectedMinute),
        get(selectedSecond) ?? 0,
        get(selectedMillisecond) ?? 0,
      );
      return date;
    },
    set(value?: Date) {
      set(selectedHour, value?.getHours());
      set(selectedMinute, value?.getMinutes());
      set(selectedSecond, value?.getSeconds());
      set(selectedMillisecond, value?.getMilliseconds());
    },
  });

  const valueSet = computed<boolean>(() => isDefined(selectedDate) && isDefined(selectedTime));

  function getDateTime(): Dayjs {
    let dateTime = dayjs();

    if (isDefined(selectedYear)) {
      dateTime = dateTime.year(get(selectedYear));
    }

    if (isDefined(selectedMonth)) {
      dateTime = dateTime.month(get(selectedMonth) - 1);
    }

    if (isDefined(selectedDay)) {
      const daysInMonth = dateTime.daysInMonth();
      const day = Math.min(get(selectedDay), daysInMonth);
      dateTime = dateTime.date(day);
    }

    if (isDefined(selectedHour)) {
      dateTime = dateTime.hour(get(selectedHour));
    }

    if (isDefined(selectedMinute)) {
      dateTime = dateTime.minute(get(selectedMinute));
    }

    if (isDefined(selectedSecond)) {
      dateTime = dateTime.second(get(selectedSecond));
    }

    if (isDefined(selectedMillisecond)) {
      dateTime = dateTime.millisecond(get(selectedMillisecond));
    }

    return dateTime;
  }

  function isDateValid(date: Dayjs): boolean {
    const min = get(minAllowedDate);
    const max = get(maxAllowedDate);

    set(internalErrorMessages, []);

    if (min && date.isBefore(min)) {
      const errorMessage = t(RUI_I18N_KEYS.dateTimePicker.dateBeforeMin, {
        date: min.toLocaleDateString(),
      }, `Date cannot be before ${min.toLocaleDateString()}`);
      set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
      return false;
    }

    if (max && date.isAfter(max)) {
      const nowError = t(RUI_I18N_KEYS.dateTimePicker.dateInFuture, 'The selected date cannot be in the future');
      const maxError = t(RUI_I18N_KEYS.dateTimePicker.dateAfterMax, { date: max.toLocaleDateString() }, `Date cannot be after ${max.toLocaleDateString()}`);
      const errorMessage = maxDate === 'now' ? nowError : maxError;
      set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
      return false;
    }

    return true;
  }

  function emitUpdate(updatedModel: Dayjs): void {
    const typeMap = {
      'date': () => updatedModel.toDate(),
      'epoch': () => updatedModel.valueOf() / MILLISECONDS,
      'epoch-ms': () => updatedModel.valueOf(),
    } as const;

    set(modelValue, typeMap[type]() as ModelValueType<T>);
  }

  function updateModelValue(): void {
    if (!isDefined(selectedDate) || !isDefined(selectedTime)) {
      return;
    }

    if (!(isDefined(selectedDate) && isDefined(selectedTime))) {
      set(modelValue, undefined as ModelValueType<T>);
    }
    else {
      const date = get(selectedDate);
      const time = get(selectedTime);

      const updatedModel = dayjs.tz(isDefined(modelValue) ? get(modelValue) : undefined, get(selectedTimezone))
        .year(date.getFullYear())
        .month(date.getMonth())
        .date(date.getDate())
        .hour(time.getHours())
        .minute(time.getMinutes())
        .second(includeSeconds(accuracy) ? time.getSeconds() : 0)
        .millisecond(includeMilliseconds(accuracy) ? time.getMilliseconds() : 0);

      if (!isDateValid(updatedModel)) {
        return;
      }

      emitUpdate(updatedModel);
    }
  }

  function clear(): void {
    set(internalErrorMessages, []);
    set(selectedYear, undefined);
    set(selectedMonth, undefined);
    set(selectedDay, undefined);
    set(selectedHour, undefined);
    set(selectedMinute, undefined);
    set(selectedSecond, undefined);
    set(selectedMillisecond, undefined);
    set(modelValue, undefined as ModelValueType<T>);
  }

  function setNow(): void {
    set(internalErrorMessages, []);

    const date = dayjs();
    set(now, date);
    set(selectedYear, date.year());
    set(selectedMonth, date.month() + 1);
    set(selectedDay, date.date());
    set(selectedHour, date.hour());
    set(selectedMinute, date.minute());
    set(selectedSecond, includeSeconds(accuracy) ? date.second() : 0);
    set(selectedMillisecond, includeMilliseconds(accuracy) ? date.millisecond() : 0);

    nextTick(() => {
      updateModelValue();
    });
  }

  function updateSegments(date: Dayjs): void {
    const year = date.year();
    const month = date.month() + 1;
    const day = date.date();
    const hour = date.hour();
    const minute = date.minute();
    const second = includeSeconds(accuracy) ? date.second() : undefined;
    const millisecond = includeMilliseconds(accuracy) ? date.millisecond() : undefined;

    if (get(selectedYear) !== year)
      set(selectedYear, year);
    if (get(selectedMonth) !== month)
      set(selectedMonth, month);
    if (get(selectedDay) !== day)
      set(selectedDay, day);
    if (get(selectedHour) !== hour)
      set(selectedHour, hour);
    if (get(selectedMinute) !== minute)
      set(selectedMinute, minute);
    if (get(selectedSecond) !== second)
      set(selectedSecond, second);
    if (get(selectedMillisecond) !== millisecond)
      set(selectedMillisecond, millisecond);
  }

  const { ignoreUpdates } = watchIgnorable([selectedDate, selectedTime], ([newSelectedDate, newSelectedTime], [prevSelectedDate, prevSelectedTime]) => {
    const currentTimezone = get(selectedTimezone);
    const newDate = dayjs.tz(newSelectedDate, currentTimezone);
    const oldDate = dayjs.tz(prevSelectedDate, currentTimezone);
    const newTime = dayjs.tz(newSelectedTime, currentTimezone);
    const oldTime = dayjs.tz(prevSelectedTime, currentTimezone);

    if (newDate.isSame(oldDate) && newTime.isSame(oldTime)) {
      return;
    }

    set(now, dayjs());
    updateModelValue();
  });

  function updateInternalModel(value: ModelValueType<T>): void {
    ignoreUpdates(() => {
      const updatedValue = type === 'epoch' && typeof value === 'number'
        ? value * MILLISECONDS
        : value;
      const date = dayjs.tz(updatedValue, get(selectedTimezone));
      isDateValid(date);
      updateSegments(date);
    });
  }

  watch(selectedTimezone, (newTimezone: string | undefined) => {
    if (newTimezone && isDefined(selectedDate) && isDefined(selectedTime)) {
      set(now, dayjs());
      updateModelValue();
    }
  });

  watch(modelValue, (value) => {
    set(now, dayjs());
    if (value === undefined) {
      clear();
    }
    else {
      updateInternalModel(value);
    }
  });

  onMounted(() => {
    if (isDefined(modelValue)) {
      updateInternalModel(get(modelValue));
    }
    else if (!allowEmpty) {
      setNow();
    }
  });

  return {
    clear,
    getDateTime,
    internalErrorMessages,
    isDateValid,
    maxAllowedDate,
    minAllowedDate,
    now,
    segmentData,
    selectedDate,
    selectedDay,
    selectedHour,
    selectedMillisecond,
    selectedMinute,
    selectedMonth,
    selectedSecond,
    selectedTime,
    selectedTimezone,
    selectedYear,
    setNow,
    valueSet,
  };
}
