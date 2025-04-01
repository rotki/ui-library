/* eslint-disable max-lines */
import type { Locale } from './locale';
import {
  addDays,
  addMonths,
  type DateParts,
  type DateSource,
  type DayParts,
  daysInWeek,
  getDayIndex,
  type MonthParts,
  weeksInMonth,
} from './date/helpers';
import { pad, pick } from './helpers';

export interface CalendarDay extends DayParts {
  id: string;
  position: number;
  label: string;
  ariaLabel: string;
  weekdayPosition: number;
  weekdayPositionFromEnd: number;
  weekPosition: number;
  isoWeeknumber: number;
  startDate: Date;
  noonDate: Date;
  endDate: Date;
  isToday: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  isDisabled: boolean;
  isFocusable: boolean;
  isFocused: boolean;
  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;
  onTop: boolean;
  onBottom: boolean;
  onLeft: boolean;
  onRight: boolean;
  classes: Array<string | object>;
  locale: Locale;
}

export interface CalendarWeek {
  id: string;
  week: number;
  weekPosition: number;
  weeknumber: number;
  isoWeeknumber: number;
  weeknumberDisplay?: number;
  days: CalendarDay[];
  title: string;
}

export interface CalendarWeekday {
  weekday: number;
  label: string;
}

export type PageView = 'daily' | 'weekly' | 'monthly';

export type TitlePosition = 'center' | 'left' | 'right';

export interface Page {
  id: string;
  day?: number;
  week?: number;
  month: number;
  year: number;
  view: PageView;
  trimWeeks: boolean;
  position: number;
  row: number;
  rowFromEnd: number;
  column: number;
  columnFromEnd: number;
  showWeeknumbers: boolean;
  showIsoWeeknumbers: boolean;
  weeknumberPosition: string;
  monthTitle: string;
  weekTitle?: string;
  dayTitle?: string;
  title: string;
  titlePosition: TitlePosition;
  shortMonthLabel: string;
  monthLabel: string;
  shortYearLabel: string;
  yearLabel: string;
  monthComps: MonthParts;
  prevMonthComps: MonthParts;
  nextMonthComps: MonthParts;
  days: CalendarDay[];
  weeks: CalendarWeek[];
  weekdays: CalendarWeekday[];
  viewDays: CalendarDay[];
  viewWeeks: CalendarWeek[];
}

export type PageAddress = Pick<Page, 'day' | 'week' | 'month' | 'year'>;

export type PageConfig = Pick<
  Page,
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'view'
  | 'titlePosition'
  | 'trimWeeks'
  | 'position'
  | 'row'
  | 'rowFromEnd'
  | 'column'
  | 'columnFromEnd'
  | 'showWeeknumbers'
  | 'showIsoWeeknumbers'
  | 'weeknumberPosition'
>;

export type CachedPage = Pick<
  Page,
  | 'id'
  | 'month'
  | 'year'
  | 'monthTitle'
  | 'shortMonthLabel'
  | 'monthLabel'
  | 'shortYearLabel'
  | 'yearLabel'
  | 'monthComps'
  | 'prevMonthComps'
  | 'nextMonthComps'
  | 'days'
  | 'weeks'
  | 'weekdays'
>;

const viewAddressKeys: Record<PageView, (keyof DateParts)[]> = {
  daily: ['year', 'month', 'day'],
  monthly: ['year', 'month'],
  weekly: ['year', 'month', 'week'],
};

function getDays(
  {
    monthComps,
    nextMonthComps,
    prevMonthComps,
  }: Pick<Page, 'monthComps' | 'prevMonthComps' | 'nextMonthComps'>,
  locale: Locale,
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const {
    firstDayOfWeek,
    firstWeekday,
    isoWeeknumbers,
    numDays,
    numWeeks,
    weeknumbers,
  } = monthComps;
  const prevMonthDaysToShow
    = firstWeekday
      + (firstWeekday < firstDayOfWeek ? daysInWeek : 0)
      - firstDayOfWeek;
  let prevMonth = true;
  let thisMonth = false;
  let nextMonth = false;
  let position = 0;
  // Formatter for aria labels
  const formatter = new Intl.DateTimeFormat(locale.id, {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
    year: 'numeric',
  });
  // Init counters with previous month's data
  let day = prevMonthComps.numDays - prevMonthDaysToShow + 1;
  let dayFromEnd = prevMonthComps.numDays - day + 1;
  let weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
  let weekdayOrdinalFromEnd = 1;
  let week = prevMonthComps.numWeeks;
  let weekFromEnd = 1;
  let month = prevMonthComps.month;
  let year = prevMonthComps.year;
  // Store todays comps
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  // Cycle through max weeks in month
  for (let w = 1; w <= weeksInMonth; w++) {
    // Cycle through days in week
    for (
      let i = 1, weekday = firstDayOfWeek;
      i <= daysInWeek;
      i++, weekday += weekday === daysInWeek ? 1 - daysInWeek : 1
    ) {
      // We need to know when to start counting actual month days
      if (prevMonth && weekday === firstWeekday) {
        // Reset counters for current month
        day = 1;
        dayFromEnd = monthComps.numDays;
        weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
        week = 1;
        weekFromEnd = numWeeks;
        month = monthComps.month;
        year = monthComps.year;
        // ...and flag we're tracking actual month days
        prevMonth = false;
        thisMonth = true;
      }
      const startDate = locale.getDateFromParams(year, month, day, 0, 0, 0, 0);
      const noonDate = locale.getDateFromParams(year, month, day, 12, 0, 0, 0);
      const endDate = locale.getDateFromParams(
        year,
        month,
        day,
        23,
        59,
        59,
        999,
      );
      const date = startDate;
      const id = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
      const weekdayPosition = i;
      const weekdayPositionFromEnd = daysInWeek - i;
      const weeknumber = weeknumbers[w - 1];
      const isoWeeknumber = isoWeeknumbers[w - 1];
      const isToday
        = day === todayDay && month === todayMonth && year === todayYear;
      const isFirstDay = thisMonth && day === 1;
      const isLastDay = thisMonth && day === numDays;
      const onTop = w === 1;
      const onBottom = w === numWeeks;
      const onLeft = i === 1;
      const onRight = i === daysInWeek;
      const dayIndex = getDayIndex(year, month, day);
      days.push({
        ariaLabel: formatter.format(new Date(year, month - 1, day)),
        classes: [
          `id-${id}`,
          `day-${day}`,
          `day-from-end-${dayFromEnd}`,
          `weekday-${weekday}`,
          `weekday-position-${weekdayPosition}`,
          `weekday-ordinal-${weekdayOrdinal}`,
          `weekday-ordinal-from-end-${weekdayOrdinalFromEnd}`,
          `week-${week}`,
          `week-from-end-${weekFromEnd}`,
          {
            'in-month': thisMonth,
            'in-next-month': nextMonth,
            'in-prev-month': prevMonth,
            'is-first-day': isFirstDay,
            'is-last-day': isLastDay,
            'is-today': isToday,
            'on-bottom': onBottom,
            'on-left': onLeft,
            'on-right': onRight,
            'on-top': onTop,
          },
        ],
        date,
        day,
        dayFromEnd,
        dayIndex,
        endDate,
        id,
        inMonth: thisMonth,
        inNextMonth: nextMonth,
        inPrevMonth: prevMonth,
        isDisabled: !thisMonth,
        isFirstDay,
        isFocusable: !thisMonth,
        isFocused: false,
        isLastDay,
        isoWeeknumber,
        isToday,
        label: day.toString(),
        locale,
        month,
        noonDate,
        onBottom,
        onLeft,
        onRight,
        onTop,
        position: ++position,
        startDate,
        week,
        weekday,
        weekdayOrdinal,
        weekdayOrdinalFromEnd,
        weekdayPosition,
        weekdayPositionFromEnd,
        weekFromEnd,
        weeknumber,
        weekPosition: w,
        year,
      });
      // See if we've hit the last day of the month
      if (thisMonth && isLastDay) {
        thisMonth = false;
        nextMonth = true;
        // Reset counters to next month's data
        day = 1;
        dayFromEnd = numDays;
        weekdayOrdinal = 1;
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
        week = 1;
        weekFromEnd = nextMonthComps.numWeeks;
        month = nextMonthComps.month;
        year = nextMonthComps.year;
        // Still in the middle of the month (hasn't ended yet)
      }
      else {
        day++;
        dayFromEnd--;
        weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
        weekdayOrdinalFromEnd = Math.floor((numDays - day) / daysInWeek + 1);
      }
    }
    // Append week days
    week++;
    weekFromEnd--;
  }
  return days;
}

function getWeeks(
  days: CalendarDay[],
  showWeeknumbers: boolean,
  showIsoWeeknumbers: boolean,
  locale: Locale,
): CalendarWeek[] {
  const result = days.reduce((result: CalendarWeek[], day: CalendarDay, i) => {
    const weekIndex = Math.floor(i / 7);
    let week = result[weekIndex];
    if (!week) {
      week = {
        days: [],
        id: `week-${weekIndex + 1}`,
        isoWeeknumber: day.isoWeeknumber,
        title: '',
        week: day.week,
        weeknumber: day.weeknumber,
        weeknumberDisplay: showWeeknumbers
          ? day.weeknumber
          : showIsoWeeknumbers
            ? day.isoWeeknumber
            : undefined,
        weekPosition: day.weekPosition,
      };
      result[weekIndex] = week;
    }
    week.days.push(day);
    return result;
  }, new Array(days.length / daysInWeek));
  result.forEach((week) => {
    const fromDay = week.days[0];
    const toDay = week.days.at(-1);
    if (fromDay.month === toDay.month) {
      week.title = `${locale.formatDate(fromDay.date, 'MMMM YYYY')}`;
    }
    else if (fromDay.year === toDay.year) {
      week.title = `${locale.formatDate(
        fromDay.date,
        'MMM',
      )} - ${locale.formatDate(toDay.date, 'MMM YYYY')}`;
    }
    else {
      week.title = `${locale.formatDate(
        fromDay.date,
        'MMM YYYY',
      )} - ${locale.formatDate(toDay.date, 'MMM YYYY')}`;
    }
  });
  return result;
}

function getWeekdays(week: CalendarWeek, locale: Locale): CalendarWeekday[] {
  return week.days.map(day => ({
    label: locale.formatDate(day.date, locale.masks.weekdays),
    weekday: day.weekday,
  }));
}

export function getPageId(month: number, year: number) {
  return `${year}.${pad(month, 2)}`;
}

export function getPageAddressForDate(
  date: DateSource,
  view: PageView,
  locale: Locale,
) {
  return pick(
    locale.getDateParts(locale.toDate(date)),
    viewAddressKeys[view],
  ) as PageAddress;
}

export function addPages(
  { day, month, week, year }: PageAddress,
  count: number,
  view: PageView,
  locale: Locale,
): PageAddress {
  if (view === 'daily' && day) {
    const date = new Date(year, month - 1, day);
    const newDate = addDays(date, count);
    return {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    };
  }
  else if (view === 'weekly' && week) {
    const comps = locale.getMonthParts(month, year);
    const date = comps.firstDayOfMonth;
    const newDate = addDays(date, (week - 1 + count) * 7);
    const parts = locale.getDateParts(newDate);
    return {
      month: parts.month,
      week: parts.week,
      year: parts.year,
    };
  }
  else {
    const date = new Date(year, month - 1, 1);
    const newDate = addMonths(date, count);
    return {
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    };
  }
}

export function pageIsValid(page: PageAddress | null | undefined) {
  return page != null && page.month != null && page.year != null;
}

export function pageIsBeforePage(
  page: PageAddress | null | undefined,
  comparePage: PageAddress | null | undefined,
) {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  page = page as PageAddress;
  comparePage = comparePage as PageAddress;
  if (page.year !== comparePage.year)
    return page.year < comparePage.year;
  if (page.month && comparePage.month && page.month !== comparePage.month)
    return page.month < comparePage.month;
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week < comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day < comparePage.day;
  }
  return false;
}

export function pageIsAfterPage(
  page: PageAddress | null | undefined,
  comparePage: PageAddress | null | undefined,
) {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  page = page as PageAddress;
  comparePage = comparePage as PageAddress;
  if (page.year !== comparePage.year) {
    return page.year > comparePage.year;
  }
  if (page.month && comparePage.month && page.month !== comparePage.month) {
    return page.month > comparePage.month;
  }
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week > comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day > comparePage.day;
  }
  return false;
}

export function pageIsBetweenPages(
  page: PageAddress | null | undefined,
  fromPage: PageAddress | null | undefined,
  toPage: PageAddress | null | undefined,
) {
  return (
    (page || false)
    && !pageIsBeforePage(page, fromPage)
    && !pageIsAfterPage(page, toPage)
  );
}

export function pageIsEqualToPage(
  aPage: PageAddress | null | undefined,
  bPage: PageAddress | null | undefined,
) {
  if (!aPage && bPage)
    return false;
  if (aPage && !bPage)
    return false;
  if (!aPage && !bPage)
    return true;
  aPage = aPage as PageAddress;
  bPage = bPage as PageAddress;
  return (
    aPage.year === bPage.year
    && aPage.month === bPage.month
    && aPage.week === bPage.week
    && aPage.day === bPage.day
  );
}

export function pageRangeToArray(
  from: PageAddress,
  to: PageAddress,
  view: PageView,
  locale: Locale,
) {
  if (!pageIsValid(from) || !pageIsValid(to))
    return [];
  const result = [];
  while (!pageIsAfterPage(from, to)) {
    result.push(from);
    from = addPages(from, 1, view, locale);
  }
  return result;
}

export function getPageKey(config: PageConfig) {
  const { day, month, week, year } = config;
  let id = `${year}-${pad(month, 2)}`;
  if (week)
    id = `${id}-w${week}`;
  if (day)
    id = `${id}-${pad(day, 2)}`;
  return id;
}

export function getCachedPage(config: PageConfig, locale: Locale): CachedPage {
  const { month, showIsoWeeknumbers, showWeeknumbers, year } = config;
  const date = new Date(year, month - 1, 15);
  const monthComps = locale.getMonthParts(month, year);
  const prevMonthComps = locale.getPrevMonthParts(month, year);
  const nextMonthComps = locale.getNextMonthParts(month, year);
  const days = getDays({ monthComps, nextMonthComps, prevMonthComps }, locale);
  const weeks = getWeeks(days, showWeeknumbers, showIsoWeeknumbers, locale);
  const weekdays = getWeekdays(weeks[0], locale);
  return {
    days,
    id: getPageKey(config),
    month,
    monthComps,
    monthLabel: locale.formatDate(date, 'MMMM'),
    monthTitle: locale.formatDate(date, locale.masks.title),
    nextMonthComps,
    prevMonthComps,
    shortMonthLabel: locale.formatDate(date, 'MMM'),
    shortYearLabel: year.toString().substring(2),
    weekdays,
    weeks,
    year,
    yearLabel: year.toString(),
  };
}

export function getPage(config: PageConfig, cachedPage: CachedPage) {
  const { day, trimWeeks, view, week } = config;
  const page: Page = {
    ...cachedPage,
    ...config,
    title: '',
    viewDays: [],
    viewWeeks: [],
  };
  switch (view) {
    case 'daily': {
      let dayObj = page.days.find(d => d.inMonth)!;
      if (day) {
        dayObj = page.days.find(d => d.day === day && d.inMonth) || dayObj;
      }
      else if (week) {
        dayObj = page.days.find(d => d.week === week && d.inMonth)!;
      }
      const weekObj = page.weeks[dayObj.week - 1];
      page.viewWeeks = [weekObj];
      page.viewDays = [dayObj];
      page.week = dayObj.week;
      page.weekTitle = weekObj.title;
      page.day = dayObj.day;
      page.dayTitle = dayObj.ariaLabel;
      page.title = page.dayTitle;
      break;
    }
    case 'weekly': {
      page.week = week || 1;
      const weekObj = page.weeks[page.week - 1];
      page.viewWeeks = [weekObj];
      page.viewDays = weekObj.days;
      page.weekTitle = weekObj.title;
      page.title = page.weekTitle;
      break;
    }
    default: {
      page.title = page.monthTitle;
      page.viewWeeks = page.weeks.slice(
        0,
        trimWeeks ? page.monthComps.numWeeks : undefined,
      );
      page.viewDays = page.days;
      break;
    }
  }
  return page;
}
