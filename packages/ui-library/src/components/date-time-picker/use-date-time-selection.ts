import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import type { SegmentData } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs, { type Dayjs } from 'dayjs';
import { completePartialEntry, type PartialTimeMode } from '@/components/date-time-picker/partial-time';
import { buildDateTime, clampToBounds } from '@/components/date-time-picker/segment-utils';
import { useDateBounds } from '@/components/date-time-picker/use-date-bounds';
import { formatWallClock, guessTimezone, includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';
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
  /**
   * The field's own format, so a bound named in an error message is written the
   * same way round as the value the user is looking at.
   */
  dateFormat: Ref<string>;
  /** See {@link completePartialEntry}; unset, an incomplete entry is not a value. */
  partialTime?: PartialTimeMode;
}

interface DateTimeSelectionReturn {
  modelYear: Ref<number | undefined>;
  modelMonth: Ref<number | undefined>;
  modelDay: Ref<number | undefined>;
  modelHour: Ref<number | undefined>;
  modelMinute: Ref<number | undefined>;
  modelSecond: Ref<number | undefined>;
  modelMillisecond: Ref<number | undefined>;
  modelTimezone: Ref<string | undefined>;
  selectedDate: WritableComputedRef<Date | undefined>;
  selectedTime: WritableComputedRef<Date | undefined>;
  valueSet: ComputedRef<boolean>;
  internalErrorMessages: Readonly<Ref<string[]>>;
  now: Readonly<Ref<Dayjs>>;
  segmentData: SegmentData;
  minAllowedDate: ComputedRef<Date>;
  maxAllowedDate: ComputedRef<Date | undefined>;
  getDateTime: () => Dayjs;
  setNow: () => void;
  setToday: () => void;
  commitPartialTime: () => void;
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
    dateFormat,
    maxDate,
    minDate,
    modelValue,
    partialTime,
    type,
  } = options;

  const modelYear = ref<number | undefined>();
  const modelMonth = ref<number | undefined>();
  const modelDay = ref<number | undefined>();

  const modelHour = ref<number | undefined>();
  const modelMinute = ref<number | undefined>();
  const modelSecond = ref<number | undefined>();
  const modelMillisecond = ref<number | undefined>();
  const modelTimezone = ref<string | undefined>(guessTimezone());

  const now = ref<Dayjs>(dayjs.tz(undefined, guessTimezone()));

  const { clearErrors, internalErrorMessages, isDateValid, maxAllowedDate, minAllowedDate } = useDateBounds({
    dateFormat,
    epochSeconds: type === 'epoch',
    maxDate,
    minDate,
    now,
  });

  const segmentData: SegmentData = {
    DD: modelDay,
    HH: modelHour,
    MM: modelMonth,
    SSS: modelMillisecond,
    YYYY: modelYear,
    mm: modelMinute,
    ss: modelSecond,
  };

  const selectedDate = computed<Date | undefined>({
    get() {
      if (!(isDefined(modelYear) && isDefined(modelMonth) && isDefined(modelDay))) {
        return undefined;
      }
      const date = new Date();
      date.setFullYear(get(modelYear));
      // Set day to 1 first to prevent month overflow when today's day > days in target month
      // e.g., if today is Dec 30 and we set month to Feb, day 30 would overflow to March
      date.setDate(1);
      date.setMonth(get(modelMonth) - 1);
      date.setDate(get(modelDay));
      return date;
    },
    set(value?: Date) {
      set(modelYear, value?.getFullYear());
      set(modelMonth, value ? value.getMonth() + 1 : undefined);
      set(modelDay, value?.getDate());
    },
  });

  const selectedTime = computed<Date | undefined>({
    get() {
      if (!(isDefined(modelHour) && isDefined(modelMinute))) {
        return undefined;
      }
      const date = new Date();
      date.setHours(
        get(modelHour),
        get(modelMinute),
        get(modelSecond) ?? 0,
        get(modelMillisecond) ?? 0,
      );
      return date;
    },
    set(value?: Date) {
      set(modelHour, value?.getHours());
      set(modelMinute, value?.getMinutes());
      set(modelSecond, value?.getSeconds());
      set(modelMillisecond, value?.getMilliseconds());
    },
  });

  const valueSet = computed<boolean>(() => isDefined(selectedDate) && isDefined(selectedTime));

  function getDateTime(): Dayjs {
    return buildDateTime({
      day: get(modelDay),
      hour: get(modelHour),
      millisecond: get(modelMillisecond),
      minute: get(modelMinute),
      month: get(modelMonth),
      second: get(modelSecond),
      year: get(modelYear),
    }, accuracy);
  }

  function emitUpdate(updatedModel: Dayjs): void {
    const typeMap = {
      'date': () => updatedModel.toDate(),
      // an epoch is whole seconds; `millisecond` accuracy would otherwise emit a fraction
      'epoch': () => Math.floor(updatedModel.valueOf() / MILLISECONDS),
      'epoch-ms': () => updatedModel.valueOf(),
    } as const;

    set(modelValue, typeMap[type]() as ModelValueType<T>);
  }

  function updateModelValue(): void {
    if (!isDefined(selectedDate) || !isDefined(selectedTime)) {
      return;
    }

    // The segments are a wall-clock reading, so they are formatted and parsed
    // in the selected timezone. Mutating a `dayjs.tz()` built from the old
    // value instead would keep that value's UTC offset, and moving the date
    // across a DST boundary then shifted the time by an hour.
    const updatedModel = dayjs.tz(
      formatWallClock(get(selectedDate), get(selectedTime), accuracy),
      get(modelTimezone),
    );

    if (!isDateValid(updatedModel)) {
      return;
    }

    emitUpdate(updatedModel);
  }

  function clear(): void {
    clearErrors();
    set(modelYear, undefined);
    set(modelMonth, undefined);
    set(modelDay, undefined);
    set(modelHour, undefined);
    set(modelMinute, undefined);
    set(modelSecond, undefined);
    set(modelMillisecond, undefined);
    set(modelValue, undefined as ModelValueType<T>);
  }

  function clampToAllowed(date: Dayjs): Dayjs {
    return clampToBounds(date, get(minAllowedDate), get(maxAllowedDate));
  }

  function applySegments(date: Dayjs): void {
    set(modelYear, date.year());
    set(modelMonth, date.month() + 1);
    set(modelDay, date.date());
    set(modelHour, date.hour());
    set(modelMinute, date.minute());
    set(modelSecond, includeSeconds(accuracy) ? date.second() : 0);
    set(modelMillisecond, includeMilliseconds(accuracy) ? date.millisecond() : 0);
  }

  function setNow(): void {
    clearErrors();

    const date = dayjs();
    set(now, date);
    applySegments(clampToAllowed(date));

    nextTick(() => {
      updateModelValue();
    });
  }

  /**
   * Moves the date part to today and leaves the time part alone, so a picked
   * time survives. Falls back to midnight when no time has been entered yet.
   */
  function setToday(): void {
    clearErrors();

    const date = dayjs();
    set(now, date);

    const target = buildDateTime({
      day: date.date(),
      hour: get(modelHour) ?? 0,
      millisecond: get(modelMillisecond) ?? 0,
      minute: get(modelMinute) ?? 0,
      month: date.month() + 1,
      second: get(modelSecond) ?? 0,
      year: date.year(),
    }, accuracy, date);

    applySegments(clampToAllowed(target));

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

    if (get(modelYear) !== year)
      set(modelYear, year);
    if (get(modelMonth) !== month)
      set(modelMonth, month);
    if (get(modelDay) !== day)
      set(modelDay, day);
    if (get(modelHour) !== hour)
      set(modelHour, hour);
    if (get(modelMinute) !== minute)
      set(modelMinute, minute);
    if (get(modelSecond) !== second)
      set(modelSecond, second);
    if (get(modelMillisecond) !== millisecond)
      set(modelMillisecond, millisecond);
  }

  const { ignoreUpdates } = watchIgnorable([selectedDate, selectedTime], ([newSelectedDate, newSelectedTime], [prevSelectedDate, prevSelectedTime]) => {
    const currentTimezone = get(modelTimezone);
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

  /**
   * Fills in the segments an incomplete entry never reached and commits it, so
   * a bare date can become a value. Called when the user is done with the field
   * rather than on every keystroke, since a segment still being typed is not
   * yet one they left out. The fill is written back into the field, so the
   * value it decided on is the one on screen.
   */
  function commitPartialTime(): void {
    if (partialTime === undefined)
      return;

    const target = completePartialEntry({
      day: get(modelDay),
      hour: get(modelHour),
      millisecond: get(modelMillisecond),
      minute: get(modelMinute),
      month: get(modelMonth),
      second: get(modelSecond),
      year: get(modelYear),
    }, {
      accuracy,
      maxDate: get(maxAllowedDate),
      minDate: get(minAllowedDate),
      mode: partialTime,
    });

    if (!target)
      return;

    // The model is written here rather than left to the watcher: this runs on blur and on enter,
    // and a consumer that closes the field on that key would drop a value the watcher only emits
    // on the next tick.
    ignoreUpdates(() => applySegments(target));
    updateModelValue();
  }

  function updateInternalModel(value: ModelValueType<T>): void {
    ignoreUpdates(() => {
      const updatedValue = type === 'epoch' && typeof value === 'number'
        ? value * MILLISECONDS
        : value;
      const date = dayjs.tz(updatedValue, get(modelTimezone));
      isDateValid(date);
      updateSegments(date);
    });
  }

  watch(modelTimezone, (newTimezone: string | undefined) => {
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
    commitPartialTime,
    getDateTime,
    internalErrorMessages,
    isDateValid,
    maxAllowedDate,
    minAllowedDate,
    modelDay,
    modelHour,
    modelMillisecond,
    modelMinute,
    modelMonth,
    modelSecond,
    modelTimezone,
    modelYear,
    now: shallowReadonly(now),
    segmentData,
    selectedDate,
    selectedTime,
    setNow,
    setToday,
    valueSet,
  };
}
