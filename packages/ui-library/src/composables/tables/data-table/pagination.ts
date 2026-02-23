import type { ComputedRef, Ref } from 'vue';
import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';
import type { TableOptions as TableDefaultOptions } from '@/composables/defaults/table';
import { type GroupedTableRow, isRow } from '@/composables/tables/data-table/types';
import { assert } from '@/utils/assert';

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
  grouped: ComputedRef<GroupedTableRow<T>[]>;
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
  itemsLength: Ref<number>;
  globalItemsPerPageSettings: ComputedRef<boolean>;
  setInternalTotal: (items: GroupedTableRow<T>[]) => void;
  resetPagination: () => void;
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
    const limit = paginated.limit;
    if (!paginationModifiersExternal) {
      const start = (paginated.page - 1) * limit;
      const end = start + limit;
      const preGroups = result.slice(0, start + 1).filter(item => !isRow(item));
      const postGroups = result
        .slice(start + 1, end + preGroups.length)
        .filter(item => !isRow(item));
      const data = result.slice(
        start + preGroups.length,
        end + preGroups.length + postGroups.length,
      );
      const nearestGroup = preGroups.at(-1);
      if (data.length > 0) {
        const firstItem = data[0];
        assert(firstItem);
        if (isRow(firstItem) && nearestGroup)
          data.unshift(nearestGroup);
        const lastItem = data.at(-1);
        if (lastItem && !isRow(lastItem))
          data.pop();
      }

      return data.filter(row => !isHiddenRow(row));
    }

    return result.filter(row => !isHiddenRow(row));
  });

  function setInternalTotal(items: GroupedTableRow<T>[]): void {
    if (!paginationModifiersExternal)
      set(itemsLength, items.filter(isRow).length);
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
    itemsLength,
    globalItemsPerPageSettings,
    setInternalTotal,
    resetPagination,
  };
}
