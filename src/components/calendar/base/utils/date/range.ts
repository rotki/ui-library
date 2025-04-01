import type { CalendarDay } from '../page';
import { isArray, isDate, isObject } from '../helpers';
import { Locale } from '../locale';
import { addDays, type DateParts, type DayParts, MS_PER_DAY } from './helpers';
import { DateRepeat, type DateRepeatConfig } from './repeat';

type DateRangeDate = Date | string | number | null;

interface DateRangeConfig {
  start: DateRangeDate;
  end: DateRangeDate;
  span: number;
  order: number;
  repeat: Partial<DateRepeatConfig>;
}

export type DateRangeSource =
  | DateRange
  | DateRangeDate
  | [DateRangeDate, DateRangeDate]
  | Partial<DateRangeConfig>;

export interface SimpleDateRange {
  start: Date;
  end: Date;
}

export class DateRange {
  order: number;
  locale: Locale;
  start: DateParts | null = null;
  end: DateParts | null = null;
  repeat: DateRepeat | null = null;

  static fromMany(ranges: DateRangeSource | DateRangeSource[], locale: Locale) {
    // Assign dates
    return (isArray(ranges) ? ranges : [ranges])
      .filter(d => d)
      .map(d => DateRange.from(d, locale));
  }

  static from(source: DateRangeSource, locale: Locale) {
    if (source instanceof DateRange)
      return source;
    const config: Partial<DateRangeConfig> = {
      end: null,
      start: null,
    };
    if (source != null) {
      if (isArray(source)) {
        config.start = source[0] ?? null;
        config.end = source[1] ?? null;
      }
      else if (isObject(source)) {
        Object.assign(config, source);
      }
      else {
        config.start = source;
        config.end = source;
      }
    }
    if (config.start != null)
      config.start = new Date(config.start);
    if (config.end != null)
      config.end = new Date(config.end);
    return new DateRange(config, locale);
  }

  private constructor(config: Partial<DateRangeConfig>, locale = new Locale()) {
    this.locale = locale;
    const { end, order, repeat, span, start } = config;

    if (isDate(start)) {
      this.start = locale.getDateParts(start);
    }

    if (isDate(end)) {
      this.end = locale.getDateParts(end);
    }
    else if (this.start != null && span) {
      this.end = locale.getDateParts(addDays(this.start.date, span - 1));
    }

    this.order = order ?? 0;

    if (repeat) {
      this.repeat = new DateRepeat(
        {
          from: this.start?.date,
          ...repeat,
        },
        {
          locale: this.locale,
        },
      );
    }
  }

  get opts() {
    const { locale, order } = this;
    return { locale, order };
  }

  get hasRepeat() {
    return !!this.repeat;
  }

  get isSingleDay() {
    const { end, start } = this;
    return (
      start
      && end
      && start.year === end.year
      && start.month === end.month
      && start.day === end.day
    );
  }

  get isMultiDay() {
    return !this.isSingleDay;
  }

  get daySpan() {
    if (this.start == null || this.end == null) {
      if (this.hasRepeat)
        return 1;
      return Infinity;
    }
    return this.end.dayIndex - this.start.dayIndex;
  }

  startsOnDay(dayParts: DayParts) {
    return (
      this.start?.dayIndex === dayParts.dayIndex
      || !!this.repeat?.passes(dayParts)
    );
  }

  intersectsDay(dayIndex: number) {
    return this.intersectsDayRange(dayIndex, dayIndex);
  }

  intersectsRange(range: DateRange) {
    return this.intersectsDayRange(
      range.start?.dayIndex ?? -Infinity,
      range.end?.dayIndex ?? Infinity,
    );
  }

  intersectsDayRange(startDayIndex: number, endDayIndex: number) {
    if (this.start && this.start.dayIndex > endDayIndex)
      return false;
    if (this.end && this.end.dayIndex < startDayIndex)
      return false;
    return true;
  }
}

interface DataRange {
  startDay: number;
  startTime: number;
  endDay: number;
  endTime: number;
}

export interface RangeData {
  key: string | number;
  order?: number;
}

interface DataRanges {
  ranges: DataRange[];
  data: RangeData;
}

export interface DateRangeCell<T extends RangeData> extends DataRange {
  data: T;
  onStart: boolean;
  onEnd: boolean;
  startTime: number;
  startDate: Date;
  endTime: number;
  endDate: Date;
  allDay: boolean;
  order: number;
}

export class DateRangeContext {
  private records: Record<string, DataRanges> = {};

  render(data: RangeData, range: DateRange, days: DayParts[]) {
    let result = null;
    const startDayIndex = days[0].dayIndex;
    const endDayIndex = days.at(-1)!.dayIndex;
    if (range.hasRepeat) {
      days.forEach((day) => {
        if (range.startsOnDay(day)) {
          const span = range.daySpan < Infinity ? range.daySpan : 1;
          result = {
            endDay: day.dayIndex + span - 1,
            endTime: range.end?.time ?? MS_PER_DAY,
            startDay: day.dayIndex,
            startTime: range.start?.time ?? 0,
          };
          this.getRangeRecords(data).push(result);
        }
      });
    }
    else if (range.intersectsDayRange(startDayIndex, endDayIndex)) {
      result = {
        endDay: range.end?.dayIndex ?? Infinity,
        endTime: range.end?.time ?? Infinity,
        startDay: range.start?.dayIndex ?? -Infinity,
        startTime: range.start?.time ?? -Infinity,
      };
      this.getRangeRecords(data).push(result);
    }
    return result;
  }

  private getRangeRecords(data: RangeData) {
    let record = this.records[data.key];
    if (!record) {
      record = {
        data,
        ranges: [],
      };
      this.records[data.key] = record;
    }
    return record.ranges;
  }

  getCell(key: string | number, day: CalendarDay) {
    const cells = this.getCells(day);
    const result = cells.find(cell => cell.data.key === key);
    return result;
  }

  cellExists(key: string | number, dayIndex: number) {
    const records = this.records[key];
    if (records == null)
      return false;
    return records.ranges.some(
      r => r.startDay <= dayIndex && r.endDay >= dayIndex,
    );
  }

  getCells(day: CalendarDay) {
    const records = Object.values(this.records);
    const result: DateRangeCell<any>[] = [];
    const { dayIndex } = day;
    records.forEach(({ data, ranges }) => {
      ranges
        .filter(r => r.startDay <= dayIndex && r.endDay >= dayIndex)
        .forEach((range) => {
          const onStart = dayIndex === range.startDay;
          const onEnd = dayIndex === range.endDay;
          const startTime = onStart ? range.startTime : 0;
          const startDate = new Date(day.startDate.getTime() + startTime);
          const endTime = onEnd ? range.endTime : MS_PER_DAY;
          const endDate = new Date(day.endDate.getTime() + endTime);
          const allDay = startTime === 0 && endTime === MS_PER_DAY;
          const order = data.order || 0;
          result.push({
            ...range,
            allDay,
            data,
            endDate,
            endTime,
            onEnd,
            onStart,
            order,
            startDate,
            startTime,
          });
        });
    });
    result.sort((a, b) => a.order - b.order);
    return result;
  }
}
