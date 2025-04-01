import { inject, provide, type Ref } from 'vue';
import { useCalendar } from '../use/calendar';
import { getMonthDates } from '../utils/date/helpers';
import { getPageId, type Page } from '../utils/page';

export interface MonthNavItem {
  month: number;
  year: number;
  id: string;
  label: string;
  ariaLabel: string;
  isActive: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

export type YearNavItem = Omit<MonthNavItem, 'month'>;

export type CalendarPageContext = ReturnType<typeof createPage>;

const contextKey = Symbol('__vc_page_context__');

export function createPage(page: Ref<Page>) {
  const { canMove, getDateAddress, locale } = useCalendar();

  function getMonthItems(year: number, mask: string): MonthNavItem[] {
    const { month: thisMonth, year: thisYear } = getDateAddress(new Date());
    return getMonthDates().map((d, i: number) => {
      const month = i + 1;
      return {
        ariaLabel: locale.value.formatDate(d, 'MMMM'),
        id: getPageId(month, year),
        isActive: month === page.value.month && year === page.value.year,
        isCurrent: month === thisMonth && year === thisYear,
        isDisabled: !canMove(
          { month, year },
          { position: page.value.position },
        ),
        label: locale.value.formatDate(d, mask),
        month,
        year,
      };
    });
  }

  function getYearItems(startYear: number, endYear: number): YearNavItem[] {
    const { year: thisYear } = getDateAddress(new Date());
    const { position } = page.value;
    const items = [];
    for (let year = startYear; year <= endYear; year += 1) {
      const enabled = [...new Array(12).keys()].some(m =>
        canMove({ month: m + 1, year }, { position }),
      );
      items.push({
        ariaLabel: year.toString(),
        id: year.toString(),
        isActive: year === page.value.year,
        isCurrent: year === thisYear,
        isDisabled: !enabled,
        label: year.toString(),
        year,
      });
    }
    return items;
  }

  const context = { getMonthItems, getYearItems, page };
  provide(contextKey, context);
  return context;
}

export function usePage(): CalendarPageContext {
  const context = inject<CalendarPageContext>(contextKey);
  if (context)
    return context;
  throw new Error(
    'Page context missing. Please verify this component is nested within a valid context provider.',
  );
}
