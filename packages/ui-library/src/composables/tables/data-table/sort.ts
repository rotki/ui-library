import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { SortColumn, TableRowKey, TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';
import { SortDirection } from '@/components/tables/table-props';
import { getObjectKeys } from '@/composables/tables/data-table/types';
import { assert } from '@/utils/assert';

const SORT_COLLATOR = new Intl.Collator(undefined, { sensitivity: 'accent', usage: 'sort' });

function toggleDirection(direction: SortDirection): SortDirection {
  return direction === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
}

export interface UseTableSortOptions<T extends object> {
  /** The data rows to sort. */
  rows: MaybeRefOrGetter<readonly T[]>;
  /** The current search query used to filter rows before sorting. */
  search: MaybeRefOrGetter<string>;
  /** Whether sorting is managed externally (e.g. server-side). */
  sortModifiersExternal: boolean | undefined;
}

export interface UseTableSortDeps<T extends object> {
  sort: Ref<TableSortData<T>>;
  pagination: Ref<TablePaginationData | undefined>;
  emitUpdateOptions: (options: {
    sort?: TableSortData<T>;
    pagination?: TablePaginationData;
  }) => void;
}

export interface UseTableSortReturn<T extends object> {
  sortData: ComputedRef<TableSortData<T>>;
  sortedMap: ComputedRef<Partial<Record<TableRowKey<T>, SortColumn<T>>>>;
  searchData: ComputedRef<readonly T[]>;
  sorted: ComputedRef<readonly T[]>;
  isSortedBy: (key: TableRowKey<T>) => boolean;
  getSortIndex: (key: TableRowKey<T>) => number;
  onSort: (payload: { key: TableRowKey<T>; direction?: SortDirection }) => void;
}

/**
 * Detect whether each column contains numeric data by sampling the first non-null value.
 */
function detectNumericColumns<T extends object>(
  activeColumns: TableRowKey<T>[],
  data: readonly T[],
): Map<TableRowKey<T>, boolean> {
  const isNumericCol = new Map<TableRowKey<T>, boolean>();
  for (const key of activeColumns) {
    for (const row of data) {
      const val = row[key];
      if (val != null) {
        isNumericCol.set(key, !Number.isNaN(Number(val)));
        break;
      }
    }
  }
  return isNumericCol;
}

export function useTableSort<T extends object>(
  options: UseTableSortOptions<T>,
  deps: UseTableSortDeps<T>,
): UseTableSortReturn<T> {
  const { rows, search, sortModifiersExternal } = options;
  const { sort, pagination, emitUpdateOptions } = deps;

  const sortData = computed<TableSortData<T>>({
    get(): TableSortData<T> {
      return get(sort);
    },
    set(value: TableSortData<T>) {
      set(sort, value);
      emitUpdateOptions({
        sort: value,
        pagination: get(pagination),
      });
    },
  });

  const sortedMap = computed<Partial<Record<TableRowKey<T>, SortColumn<T>>>>(() => {
    const mapped: Partial<Record<TableRowKey<T>, SortColumn<T>>> = {};
    const sortBy = get(sortData);
    if (!sortBy)
      return mapped;

    if (!Array.isArray(sortBy)) {
      if (sortBy.column)
        mapped[sortBy.column] = sortBy;

      return mapped;
    }

    return sortBy.reduce((acc, curr) => {
      if (!curr.column)
        return acc;

      acc[curr.column] = curr;
      return acc;
    }, mapped);
  });

  // Pre-compute a single lowercased searchable string per row, recomputed only when rows change
  const searchIndex = computed<Map<T, string>>(() => {
    if (!toValue(search))
      return new Map<T, string>();

    const currentRows = toValue(rows);
    const index = new Map<T, string>();
    for (const row of currentRows) {
      const parts: string[] = [];
      for (const key of getObjectKeys(row))
        parts.push(`${row[key]}`);
      index.set(row, parts.join('\0').toLocaleLowerCase());
    }
    return index;
  });

  const searchData = computed<readonly T[]>(() => {
    const currentRows = toValue(rows);
    const query = toValue(search)?.toLocaleLowerCase();
    if (!query)
      return currentRows;

    const index = get(searchIndex);
    return currentRows.filter((row) => {
      const searchStr = index.get(row);
      return searchStr?.includes(query) ?? false;
    });
  });

  const sorted: ComputedRef<readonly T[]> = computed(() => {
    const sortBy = get(sortData);
    if (!sortBy || sortModifiersExternal)
      return get(searchData);

    const data = [...get(searchData)];
    const sortColumns = Array.isArray(sortBy) ? sortBy : [sortBy];
    const activeColumns = sortColumns
      .map(col => col.column)
      .filter((col): col is TableRowKey<T> => !!col);

    if (activeColumns.length === 0)
      return data;

    const isNumericCol = detectNumericColumns(activeColumns, data);

    // Build a lookup for direction per column
    const directionMap = new Map<TableRowKey<T>, SortDirection>();
    for (const col of sortColumns) {
      if (col.column)
        directionMap.set(col.column, col.direction ?? SortDirection.asc);
    }

    data.sort((a, b) => {
      for (const key of activeColumns) {
        let [aVal, bVal] = [a[key], b[key]];
        if (directionMap.get(key) === SortDirection.desc)
          [aVal, bVal] = [bVal, aVal];

        let result: number;
        if (isNumericCol.get(key))
          result = Number(aVal) - Number(bVal);
        else
          result = SORT_COLLATOR.compare(`${aVal}`, `${bVal}`);

        if (result !== 0)
          return result;
      }
      return 0;
    });

    return data;
  });

  function isSortedBy(key: TableRowKey<T>): boolean {
    return key in get(sortedMap);
  }

  function getSortIndex(key: TableRowKey<T>): number {
    const sortBy = get(sortData);

    if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key))
      return -1;

    return sortBy.findIndex(s => s.column === key);
  }

  function onSortSingle(
    sortBy: SortColumn<T>,
    key: TableRowKey<T>,
    direction?: SortDirection,
  ): void {
    if (isSortedBy(key)) {
      const newDirection = toggleDirection(direction ?? SortDirection.asc);

      if (sortBy.direction === newDirection) {
        set(sortData, { ...sortBy, column: undefined, direction: SortDirection.asc });
      }
      else {
        set(sortData, {
          ...sortBy,
          direction: toggleDirection(sortBy.direction),
        });
      }
    }
    else {
      set(sortData, { column: key, direction: direction ?? SortDirection.asc });
    }
  }

  function onSortMulti(
    sortBy: SortColumn<T>[],
    key: TableRowKey<T>,
    direction?: SortDirection,
  ): void {
    if (isSortedBy(key)) {
      const newDirection = toggleDirection(direction ?? SortDirection.asc);

      const index = getSortIndex(key);
      const sortByCol = sortBy[index];
      assert(sortByCol);

      if (sortByCol.direction === newDirection) {
        set(sortData, sortBy.filter((_, i) => i !== index));
      }
      else {
        set(
          sortData,
          sortBy.map((col, i) =>
            i === index ? { ...col, direction: toggleDirection(col.direction) } : col,
          ),
        );
      }
    }
    else {
      set(sortData, [...sortBy, { column: key, direction: direction ?? SortDirection.asc }]);
    }
  }

  function onSort({ key, direction }: { key: TableRowKey<T>; direction?: SortDirection }): void {
    const sortBy = get(sortData);
    if (!sortBy)
      return;

    if (Array.isArray(sortBy))
      onSortMulti(sortBy, key, direction);
    else
      onSortSingle(sortBy, key, direction);
  }

  return {
    sortData,
    sortedMap,
    searchData,
    sorted,
    isSortedBy,
    getSortIndex,
    onSort,
  };
}
