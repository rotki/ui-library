import type { ComputedRef, DeepReadonly, Ref, ShallowRef } from 'vue';
import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';
import type { TableOptions as TableDefaultOptions } from '@/composables/defaults/table';
import { type GroupedTableRow, isRow } from '@/composables/tables/data-table/types';

export interface UseTablePaginationOptions {
  /** The default number of items displayed per page. */
  itemsPerPage: number;
  /** Whether pagination is managed externally (e.g. server-side). */
  paginationModifiersExternal: boolean | undefined;
  /** Whether to share the items-per-page setting across all tables. */
  globalItemsPerPage: boolean | undefined;
}

export interface UseTablePaginationDeps<T extends object> {
  pagination: Ref<TablePaginationData | undefined>;
  grouped: ComputedRef<readonly GroupedTableRow<T>[]>;
  isHiddenRow: (row: GroupedTableRow<T>) => boolean;
  sort: Ref<TableSortData<T>>;
  emitUpdateOptions: (options: {
    sort?: TableSortData<T>;
    pagination?: TablePaginationData;
  }) => void;
  tableDefaults: TableDefaultOptions;
}

export interface UseTablePaginationReturn<T extends object> {
  paginationData: Ref<TablePaginationData>;
  filtered: ComputedRef<GroupedTableRow<T>[]>;
  itemsLength: DeepReadonly<ShallowRef<number>>;
  globalItemsPerPageSettings: ComputedRef<boolean>;
  setInternalTotal: (items: readonly GroupedTableRow<T>[]) => void;
  resetPagination: () => void;
}

/**
 * Skip data rows until the page start offset, tracking the last group header seen.
 * Returns the index where collection should begin and the last group header before the slice.
 */
function skipToPageStart<T extends object>(
  result: readonly GroupedTableRow<T>[],
  start: number,
): { startIndex: number; dataCount: number; lastGroupHeader: GroupedTableRow<T> | undefined } {
  let dataCount = 0;
  let lastGroupHeader: GroupedTableRow<T> | undefined;

  for (const [i, item] of result.entries()) {
    if (isRow(item)) {
      dataCount++;
      if (dataCount > start)
        return { startIndex: i, dataCount, lastGroupHeader };
    }
    else if (dataCount < start) {
      lastGroupHeader = item;
    }
    else {
      return { startIndex: i, dataCount, lastGroupHeader };
    }
  }

  return { startIndex: result.length, dataCount, lastGroupHeader };
}

/**
 * Collect data rows (and interleaved group headers) for the current page.
 */
function collectPageRows<T extends object>(
  items: readonly GroupedTableRow<T>[],
  limit: number,
): GroupedTableRow<T>[] {
  const data: GroupedTableRow<T>[] = [];
  let collected = 0;

  for (const item of items) {
    data.push(item);

    if (isRow(item)) {
      collected++;
      if (collected >= limit)
        break;
    }
  }

  return data;
}

/**
 * Single-pass pagination that counts only data rows while preserving group headers.
 * Prepends the nearest group header when a page starts mid-group, and removes
 * trailing group headers with no data rows after them.
 */
function paginateGroupedRows<T extends object>(
  result: readonly GroupedTableRow<T>[],
  start: number,
  limit: number,
): GroupedTableRow<T>[] {
  const { startIndex, lastGroupHeader } = skipToPageStart(result, start);
  const data = collectPageRows(result.slice(startIndex), limit);

  // Prepend the nearest group header if the first item is a data row
  const firstItem = data[0];
  if (firstItem && isRow(firstItem) && lastGroupHeader)
    data.unshift(lastGroupHeader);

  // Remove trailing group header with no data rows after it
  const lastItem = data.at(-1);
  if (lastItem && !isRow(lastItem))
    data.pop();

  return data;
}

export function useTablePagination<T extends object>(
  options: UseTablePaginationOptions,
  deps: UseTablePaginationDeps<T>,
): UseTablePaginationReturn<T> {
  const { itemsPerPage, paginationModifiersExternal, globalItemsPerPage } = options;
  const { pagination, grouped, isHiddenRow, sort, emitUpdateOptions, tableDefaults } = deps;

  const itemsLength = shallowRef<number>(0);
  const internalPaginationState: Ref<TablePaginationData | undefined> = ref();

  const globalItemsPerPageSettings = computed<boolean>(() => {
    if (globalItemsPerPage !== undefined)
      return globalItemsPerPage;

    return get(tableDefaults.globalItemsPerPage);
  });

  const paginationData: Ref<TablePaginationData> = computed({
    get(): TablePaginationData {
      const paginated = get(internalPaginationState);
      if (!paginated) {
        return {
          total: get(itemsLength),
          limit: itemsPerPage,
          page: 1,
        };
      }

      if (paginationModifiersExternal)
        return paginated;

      return {
        total: get(itemsLength),
        limit: paginated.limit,
        page: paginated.page,
        limits: paginated.limits,
      };
    },
    set(value: TablePaginationData) {
      set(internalPaginationState, value);
      set(pagination, value);
      emitUpdateOptions({
        pagination: value,
        sort: get(sort),
      });
    },
  });

  const filtered = computed<GroupedTableRow<T>[]>(() => {
    const result = get(grouped);

    const paginated = get(paginationData);
    if (!paginationModifiersExternal) {
      const start = (paginated.page - 1) * paginated.limit;
      const data = paginateGroupedRows(result, start, paginated.limit);
      return data.filter(row => !isHiddenRow(row));
    }

    return result.filter(row => !isHiddenRow(row));
  });

  function setInternalTotal(items: readonly GroupedTableRow<T>[]): void {
    if (!paginationModifiersExternal) {
      let count = 0;
      for (const item of items) {
        if (isRow(item))
          count++;
      }
      set(itemsLength, count);
    }
  }

  function resetPagination(): void {
    set(paginationData, {
      ...get(paginationData),
      page: 1,
    });
  }

  // Sync external pagination model to internal state
  watch(pagination, val => set(internalPaginationState, val), { immediate: true });

  // Sync pagination limit to global table defaults
  watch(internalPaginationState, (paginationState) => {
    if (paginationState?.limit && get(globalItemsPerPageSettings))
      set(tableDefaults.itemsPerPage, paginationState.limit);
  });

  // Sync global table defaults to pagination limit
  watch(
    tableDefaults.itemsPerPage,
    (perPage) => {
      if (!get(globalItemsPerPageSettings))
        return;

      set(paginationData, {
        ...get(paginationData),
        limit: perPage,
      });
    },
    { immediate: true },
  );

  // Auto-adjust page when current page exceeds max available pages
  watch(paginationData, (paginationState) => {
    const { total, limit, page } = paginationState;
    const maxPages = Math.ceil(total / limit);

    if (maxPages > 0 && page > maxPages) {
      set(paginationData, {
        ...paginationState,
        page: maxPages,
      });
    }
  });

  return {
    paginationData,
    filtered,
    itemsLength: readonly(itemsLength),
    globalItemsPerPageSettings,
    setInternalTotal,
    resetPagination,
  };
}
