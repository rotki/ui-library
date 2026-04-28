import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type {
  NoneSortableTableColumn,
  TableColumn,
  TableRowKey,
} from '@/components/tables/RuiTableHead.vue';
import { getAlignClass, TableAlign } from '@/components/tables/table-props';
import { getObjectKeys, isHeaderSlot } from '@/composables/tables/data-table/types';

export interface UseTableColumnsOptions<T extends object, IdType extends keyof T> {
  /** Column definitions for the table. When omitted, columns are inferred from row data. */
  cols: MaybeRefOrGetter<TableColumn<T>[] | undefined>;
  /** The property on each column definition used as the column identifier. */
  columnAttr: keyof TableColumn<T>;
  /** The data rows to display in the table. */
  rows: MaybeRefOrGetter<readonly T[]>;
  /** Whether row expansion is enabled. */
  expandable: ComputedRef<boolean>;
  /** The keys currently used for grouping rows. */
  groupKeys: ComputedRef<TableRowKey<T>[]>;
  /** The currently selected row identifiers. */
  selectedData: Ref<T[IdType][] | undefined>;
  /** Template slots provided to the table component. */
  slots: Record<string, any>;
  /** Pre-computes td class per column to avoid per-cell tv() calls. */
  tdResolver?: (options: { class?: string }) => string;
}

export interface UseTableColumnsReturn<T extends object> {
  columns: ComputedRef<TableColumn<T>[]>;
  colspan: ComputedRef<number>;
  headerSlots: `header.${string}`[];
  cellValue: (row: T, key: TableColumn<T>['key']) => T[TableRowKey<T>];
}

export function useTableColumns<T extends object, IdType extends keyof T>(
  options: UseTableColumnsOptions<T, IdType>,
): UseTableColumnsReturn<T> {
  const { cols, columnAttr, expandable, groupKeys, rows, selectedData, slots, tdResolver } = options;

  function attachTdClass(columnList: TableColumn<T>[]): TableColumn<T>[] {
    if (!tdResolver)
      return columnList;

    return columnList.map(col => ({
      ...col,
      tdClass: tdResolver({ class: getAlignClass(col.align) }),
    }));
  }

  const columns = computed<TableColumn<T>[]>(() => {
    const currentCols = toValue(cols);
    const currentRows = toValue(rows);
    const data =
      currentCols ??
      getObjectKeys(currentRows[0] ?? {}).map(
        key =>
          ({
            key,
            [columnAttr]: String(key),
          }) satisfies NoneSortableTableColumn<T>,
      );

    const hasExpandColumn = data.some(row => row.key === 'expand');

    if (get(expandable) && !hasExpandColumn) {
      return attachTdClass([
        ...data,
        {
          key: 'expand' as TableRowKey<T>,
          sortable: false,
          class: 'w-16',
          cellClass: '!py-0 w-16',
          align: TableAlign.end,
        } satisfies NoneSortableTableColumn<T>,
      ]);
    }

    const groupByKeys = get(groupKeys);

    if (groupByKeys.length === 0)
      return attachTdClass(data);

    return attachTdClass(data.filter(column => !groupByKeys.includes(column.key as TableRowKey<T>)));
  });

  const colspan = computed<number>(() => {
    let columnLength = get(columns).length;
    if (get(selectedData))
      columnLength++;

    return columnLength;
  });

  // Slot keys are static for the component lifetime — no reactivity needed
  const headerSlots: `header.${string}`[] = Object.keys(slots).filter(isHeaderSlot);

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
