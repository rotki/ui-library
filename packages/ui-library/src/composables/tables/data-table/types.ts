import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';

export interface TableOptions<T> {
  pagination?: TablePaginationData;
  sort?: TableSortData<T>;
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
