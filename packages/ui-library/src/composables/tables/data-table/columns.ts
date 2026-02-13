import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type {
  NoneSortableTableColumn,
  TableColumn,
  TableRowKey,
} from '@/components/tables/RuiTableHead.vue';
import { isHeaderSlot } from '@/composables/tables/data-table/types';

export interface UseTableColumnsOptions<T extends object, IdType extends keyof T> {
  cols: MaybeRefOrGetter<TableColumn<T>[] | undefined>;
  columnAttr: keyof TableColumn<T>;
  rows: MaybeRefOrGetter<T[]>;
  expandable: ComputedRef<boolean>;
  groupKeys: ComputedRef<TableRowKey<T>[]>;
  selectedData: Ref<T[IdType][] | undefined>;
  slots: Record<string, any>;
}

export interface UseTableColumnsReturn<T extends object> {
  columns: ComputedRef<TableColumn<T>[]>;
  colspan: ComputedRef<number>;
  headerSlots: ComputedRef<`header.${string}`[]>;
  cellValue: (row: T, key: TableColumn<T>['key']) => T[TableRowKey<T>];
}

export function useTableColumns<T extends object, IdType extends keyof T>(
  options: UseTableColumnsOptions<T, IdType>,
): UseTableColumnsReturn<T> {
  const { columnAttr, expandable, groupKeys, selectedData, slots } = options;

  const getKeys = <O extends object>(t: O): TableRowKey<O>[] => Object.keys(t) as TableRowKey<O>[];

  const columns = computed<TableColumn<T>[]>(() => {
    const currentCols = toValue(options.cols);
    const currentRows = toValue(options.rows);
    const data =
      currentCols ??
      getKeys(currentRows[0] ?? {}).map(
        key =>
          ({
            key,
            [columnAttr]: String(key),
          }) satisfies NoneSortableTableColumn<T>,
      );

    const hasExpandColumn = data.some(row => row.key === 'expand');

    if (get(expandable) && !hasExpandColumn) {
      return [
        ...data,
        {
          key: 'expand' as TableRowKey<T>,
          sortable: false,
          class: 'w-16',
          cellClass: '!py-0 w-16',
          align: 'end',
        } satisfies NoneSortableTableColumn<T>,
      ];
    }

    const groupByKeys = get(groupKeys);

    if (groupByKeys.length === 0)
      return data;

    return data.filter(column => !groupByKeys.includes(column.key as TableRowKey<T>));
  });

  const colspan = computed<number>(() => {
    let columnLength = get(columns).length;
    if (get(selectedData))
      columnLength++;

    return columnLength;
  });

  const headerSlots = computed<`header.${string}`[]>(() => Object.keys(slots).filter(isHeaderSlot));

  function cellValue(row: T, key: TableColumn<T>['key']): T[TableRowKey<T>] {
    return row[key as TableRowKey<T>];
  }

  return {
    columns,
    colspan,
    headerSlots,
    cellValue,
  };
}
