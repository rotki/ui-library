import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';

export interface TableOptions<T> {
  pagination?: TablePaginationData;
  sort?: TableSortData<T>;
}

/**
 * The RuiDataTable models a consumer may leave unbound. Each is `undefined` until bound, which
 * switches off what it drives (selection, row expansion) or leaves it to the table (pagination,
 * sort), and the table never sets one back to `undefined`. They are props and events rather than
 * `defineModel` calls so that the update is typed without that `undefined`; see `usePropModel`.
 */
export interface DataTableModels<T, K extends keyof T> {
  /** The selected rows' identifiers. Bound, the rows take a checkbox. */
  modelValue?: T[K][];
  /** The expanded rows. Bound, with an `expanded-item` slot, the rows expand. */
  expanded?: T[];
  /** The page, its size and the total. `.external` leaves paging the rows to the consumer. */
  pagination?: TablePaginationData;
  paginationModifiers?: { external?: true };
  /** The sorted column, or columns in an array. `.external` leaves sorting the rows to the consumer. */
  sort?: TableSortData<T>;
  sortModifiers?: { external?: true };
}

/** The updates of {@link DataTableModels}. */
export interface DataTableModelEmits<T, K extends keyof T> {
  'update:modelValue': [value: T[K][]];
  'update:expanded': [value: T[]];
  'update:pagination': [value: TablePaginationData];
  'update:sort': [value: NonNullable<TableSortData<T>>];
}

export const GROUP_HEADER_BRAND: unique symbol = Symbol('GroupHeader');

export interface GroupHeader<T> {
  [GROUP_HEADER_BRAND]: true;
  identifier: string;
  group: Partial<T>;
}

export type GroupedTableRow<T> = T | GroupHeader<T>;

export function isRow<T extends object>(item: GroupedTableRow<T>): item is T {
  return !(GROUP_HEADER_BRAND in item);
}

export function isHeaderSlot(slotName: string): slotName is `header.${string}` {
  return slotName.startsWith('header.');
}

export function getObjectKeys<O extends object>(obj: O): (string & keyof O)[] {
  return Object.keys(obj).filter((key): key is string & keyof O => key in obj);
}
