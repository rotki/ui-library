import type { ComputedRef, MaybeRefOrGetter, Ref, WritableComputedRef } from 'vue';
import type { TableOptions } from '@/composables/defaults/table';
import { formatInteger } from '@/utils/helpers';

interface LimitEntry { limit: number }

interface PageRange { page: number; text: string }

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface UsePaginationNavigationReturn {
  limits: ComputedRef<LimitEntry[]>;
  currentLimit: WritableComputedRef<number>;
  pages: ComputedRef<number>;
  ranges: ComputedRef<PageRange[]>;
  indicatorText: ComputedRef<string>;
  currentRange: WritableComputedRef<number>;
  useInputJump: ComputedRef<boolean>;
  hasPrev: ComputedRef<boolean>;
  hasNext: ComputedRef<boolean>;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
}

export function usePaginationNavigation(
  // eslint-disable-next-line @rotki/composable-input-flexibility
  modelValue: Ref<TablePaginationData>,
  tableDefaults: TableOptions,
  rangesThreshold: MaybeRefOrGetter<number> = 500,
): UsePaginationNavigationReturn {
  const limits = computed<LimitEntry[]>(() =>
    (get(modelValue).limits ?? get(tableDefaults.limits)).map(limit => ({ limit })),
  );

  const currentLimit = computed<number>({
    get: () => get(modelValue).limit,
    set: limit =>
      set(modelValue, {
        ...get(modelValue),
        limit,
        page: 1,
      }),
  });

  const pages = computed<number>(() => {
    const { limit, total } = get(modelValue);
    if (!total)
      return 0;

    return Math.ceil(total / limit);
  });

  function pageRangeText(page: number): string {
    const { limit, total } = get(modelValue);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `${formatInteger(start)} - ${formatInteger(end)}`;
  }

  const useInputJump = computed<boolean>(() => {
    const threshold = toValue(rangesThreshold);
    return threshold > 0 && get(pages) > threshold;
  });

  const ranges = computed<PageRange[]>(() => {
    if (get(useInputJump))
      return [];

    return Array.from({ length: get(pages) }, (_, i) => {
      const page = i + 1;
      return { page, text: pageRangeText(page) };
    });
  });

  const indicatorText = computed<string>(() => {
    const { total } = get(modelValue);
    if (get(useInputJump))
      return `of ${formatInteger(get(pages))}`;

    return total ? `of ${formatInteger(total)}` : `0 of 0`;
  });

  const currentRange = computed<number>({
    get: () => get(modelValue).page,
    set: page =>
      set(modelValue, {
        ...get(modelValue),
        page,
      }),
  });

  const hasPrev = computed<boolean>(() => get(modelValue).page > 1);
  const hasNext = computed<boolean>(() => get(pages) > get(modelValue).page);

  function goToPage(page: number): void {
    set(currentRange, page);
  }

  function onPrev(): void {
    if (get(hasPrev))
      goToPage(get(modelValue).page - 1);
  }

  function onNext(): void {
    if (get(hasNext))
      goToPage(get(modelValue).page + 1);
  }

  function onFirst(): void {
    if (get(hasPrev))
      goToPage(1);
  }

  function onLast(): void {
    if (get(hasNext))
      goToPage(get(pages));
  }

  return {
    limits,
    currentLimit,
    pages,
    ranges,
    indicatorText,
    currentRange,
    useInputJump,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    onFirst,
    onLast,
  };
}
