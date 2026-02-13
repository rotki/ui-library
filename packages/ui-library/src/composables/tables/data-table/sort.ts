import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { SortColumn, TableRowKey, TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';
import { assert } from '@/utils/assert';

const SORT_COLLATOR_OPTIONS: Intl.CollatorOptions = { sensitivity: 'accent', usage: 'sort' };

export interface UseTableSortOptions<T extends object> {
  rows: MaybeRefOrGetter<T[]>;
  search: MaybeRefOrGetter<string>;
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
  searchData: ComputedRef<T[]>;
  sorted: ComputedRef<T[]>;
  isSortedBy: (key: TableRowKey<T>) => boolean;
  getSortIndex: (key: TableRowKey<T>) => number;
  onSort: (payload: { key: TableRowKey<T>; direction?: 'asc' | 'desc' }) => void;
}

export function useTableSort<T extends object>(
  options: UseTableSortOptions<T>,
  deps: UseTableSortDeps<T>,
): UseTableSortReturn<T> {
  const { sortModifiersExternal } = options;
  const { sort, pagination, emitUpdateOptions } = deps;

  const getKeys = <O extends object>(t: O): TableRowKey<O>[] => Object.keys(t) as TableRowKey<O>[];

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

  const searchData = computed<T[]>(() => {
    const currentRows = toValue(options.rows);
    const query = toValue(options.search)?.toLocaleLowerCase();
    if (!query)
      return currentRows;

    return currentRows.filter(row =>
      getKeys(row).some(key => `${row[key]}`.toLocaleLowerCase().includes(query)),
    );
  });

  const sorted: ComputedRef<T[]> = computed(() => {
    const sortBy = get(sortData);
    const data = [...get(searchData)];
    if (!sortBy || sortModifiersExternal)
      return data;

    const sortFn = (by: SortColumn<T>): void => {
      data.sort((a, b) => {
        const column = by.column;
        if (!column)
          return 0;

        let [aValue, bValue] = [a[column], b[column]];
        if (by.direction === 'desc')
          [aValue, bValue] = [bValue, aValue];

        const aNumber = Number(aValue);
        const bNumber = Number(bValue);
        if (!isNaN(aNumber) && !isNaN(bNumber))
          return aNumber - bNumber;

        return `${aValue}`.localeCompare(`${bValue}`, undefined, SORT_COLLATOR_OPTIONS);
      });
    };

    if (!Array.isArray(sortBy))
      sortFn(sortBy);
    else [...sortBy].reverse().forEach(sortFn);

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

  function onSort({ key, direction }: { key: TableRowKey<T>; direction?: 'asc' | 'desc' }): void {
    const sortBy = get(sortData);
    if (!sortBy)
      return;

    if (!Array.isArray(sortBy)) {
      if (isSortedBy(key)) {
        const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

        if (sortBy.direction === newDirection) {
          set(sortData, { ...sortBy, column: undefined, direction: 'asc' });
        }
        else {
          set(sortData, {
            ...sortBy,
            direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
          });
        }
      }
      else {
        set(sortData, { column: key, direction: direction || 'asc' });
      }
      return;
    }

    if (isSortedBy(key)) {
      const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

      const index = getSortIndex(key);
      const sortByCol = sortBy[index];
      assert(sortByCol);

      if (sortByCol.direction === newDirection) {
        set(
          sortData,
          sortBy.filter((_, i) => i !== index),
        );
      }
      else {
        set(
          sortData,
          sortBy.map((col, i) =>
            i === index ? { ...col, direction: col.direction === 'asc' ? 'desc' : 'asc' } : col,
          ),
        );
      }
    }
    else {
      set(sortData, [...sortBy, { column: key, direction: direction || 'asc' }]);
    }
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
