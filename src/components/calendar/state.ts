import type { ComputedRef, InjectionKey, Ref } from 'vue';

export const CalendarStateSymbol: InjectionKey<RuiCalendarState> = Symbol.for('rui:calendar');

export interface RuiCalendarState {
  viewMonth: Ref<number>;
  viewYear: Ref<number>;
  selectedDate: Ref<Date | undefined>;
  maxDate: ComputedRef<Date | undefined>;
  minDate: ComputedRef<Date | undefined>;
  isDark: ComputedRef<boolean>;
  allowEmpty: boolean;
}

export interface MonthYearSelection {
  month: number;
  year: number;
}

export function getDaysOfWeek(locale: Intl.LocalesArgument = 'en-US', format: 'narrow' | 'short' = 'narrow'): string[] {
  const daysOfWeek: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2021, 0, 3 + i); // Jan 3, 2021 was a Sunday
    const dayName = new Intl.DateTimeFormat(locale, { weekday: format }).format(date);
    daysOfWeek.push(format === 'narrow' ? dayName : dayName.charAt(0));
  }
  return daysOfWeek;
}

export function getShortMonthNames(locale: Intl.LocalesArgument = 'en-US'): string[] {
  const monthNames: string[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2021, month, 1);
    const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    monthNames.push(monthName);
  }
  return monthNames;
}
