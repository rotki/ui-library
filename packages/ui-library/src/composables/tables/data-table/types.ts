import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import type { TablePaginationData } from '@/components/tables/RuiTablePagination.vue';

export interface TableOptions<T> {
  pagination?: TablePaginationData;
  sort?: TableSortData<T>;
}

export interface GroupHeader<T> {
  __header__: true;
  identifier: string;
  group: Partial<T>;
}

export type GroupedTableRow<T> = T | GroupHeader<T>;

export function isRow<T extends object>(item: GroupedTableRow<T>): item is T {
  return !('__header__' in item);
}

export function isHeaderSlot(slotName: string): slotName is `header.${string}` {
  return slotName.startsWith('header.');
}
