import type { ComputedRef, Ref } from 'vue';
import type { GroupData, TableRowKey, TableRowKeyData } from '@/components/tables/RuiTableHead.vue';
import {
  type GroupedTableRow,
  type GroupHeader,
  isRow,
} from '@/composables/tables/data-table/types';
import { assert } from '@/utils/assert';

export interface UseTableGroupingOptions<T extends object, IdType extends keyof T> {
  rowAttr: IdType;
}

export interface UseTableGroupingDeps<T extends object> {
  group: Ref<TableRowKeyData<T>>;
  collapsed: Ref<T[] | undefined>;
  sorted: ComputedRef<T[]>;
  emitCopyGroup: (value: GroupData<T>) => void;
}

export interface UseTableGroupingReturn<T extends object> {
  groupKeys: ComputedRef<TableRowKey<T>[]>;
  groupKey: ComputedRef<string>;
  isGrouped: ComputedRef<boolean>;
  mappedGroups: ComputedRef<Record<string, GroupedTableRow<T>[]>>;
  grouped: ComputedRef<GroupedTableRow<T>[]>;
  getRowGroup: (row: T) => Partial<T>;
  getGroupRows: (groupVal: string) => T[];
  compareGroupsFn: (a: T, b: Partial<T>) => boolean;
  isExpandedGroup: (value: Partial<T>) => boolean;
  isHiddenRow: (row: GroupedTableRow<T>) => boolean;
  onToggleExpandGroup: (group: Partial<T>, value?: string) => void;
  onUngroup: () => void;
  onCopyGroup: (value: GroupData<T>) => void;
}

// Null character separator prevents false collisions when group values contain commas
const GROUP_KEY_SEPARATOR = '\0';

export function useTableGrouping<T extends object, IdType extends keyof T>(
  options: UseTableGroupingOptions<T, IdType>,
  deps: UseTableGroupingDeps<T>,
): UseTableGroupingReturn<T> {
  const { rowAttr } = options;
  const { group, collapsed, sorted, emitCopyGroup } = deps;

  const collapsedRows: Ref<T[]> = ref([]);

  watch(collapsed, value => set(collapsedRows, value ?? []), { immediate: true });

  const groupKeys: ComputedRef<TableRowKey<T>[]> = computed(() => {
    const groupBy = get(group);

    if (!groupBy)
      return [];

    if (!Array.isArray(groupBy))
      return [groupBy];

    return groupBy;
  });

  const groupKey = computed<string>(() => get(groupKeys).join(':'));

  const isGrouped = computed<boolean>(() => !!get(groupKey));

  const collapsedIdentifierSet = computed<Set<T[IdType]>>(
    () => new Set(get(collapsedRows).map(row => row[rowAttr])),
  );

  const collapsedGroupKeySet = computed<Set<string>>(() => {
    const grouping = get(groupKeys);
    if (grouping.length === 0)
      return new Set<string>();

    const seen = new Set<string>();
    for (const row of get(collapsedRows)) {
      const groupVal = grouping
        .map(key => row[key])
        .filter(isDefined)
        .join(GROUP_KEY_SEPARATOR);
      seen.add(groupVal);
    }
    return seen;
  });

  function getRowGroup(row: T): Partial<T> {
    const result: Partial<T> = {};
    for (const key of get(groupKeys)) {
      result[key] = row[key];
    }
    return result;
  }

  function compareGroupsFn(a: T, b: Partial<T>): boolean {
    const grouping = get(groupKeys);
    if (grouping.length === 0)
      return false;

    return grouping.every(key => a[key] === b[key]);
  }

  function isExpandedGroup(value: Partial<T>): boolean {
    const groupVal = Object.values(value).filter(isDefined).join(GROUP_KEY_SEPARATOR);
    return !get(collapsedGroupKeySet).has(groupVal);
  }

  function isHiddenRow(row: GroupedTableRow<T>): boolean {
    if (!get(isGrouped))
      return false;
    if (!isRow(row))
      return false;
    return get(collapsedIdentifierSet).has(row[rowAttr]);
  }

  const mappedGroups = computed<Record<string, GroupedTableRow<T>[]>>(() => {
    if (!get(isGrouped))
      return {};

    const result = get(sorted);
    const identifier = rowAttr;

    return result.reduce((acc: Record<string, GroupedTableRow<T>[]>, row) => {
      if (!isDefined(row[identifier]) || row[identifier] === '')
        return acc;

      const rowGroup = getRowGroup(row);
      const groupVal = Object.values(rowGroup).filter(isDefined).join(GROUP_KEY_SEPARATOR);
      if (!acc[groupVal]) {
        acc[groupVal] = [
          {
            __header__: true,
            group: rowGroup,
            identifier: groupVal,
          } satisfies GroupHeader<T>,
        ];
      }

      acc[groupVal].push(row);

      return acc;
    }, {});
  });

  const grouped = computed<GroupedTableRow<T>[]>(() => {
    const result = get(sorted);
    const groupByKey = get(groupKey);

    if (!groupByKey)
      return result;

    return Object.values(get(mappedGroups)).flat();
  });

  function getGroupRows(groupVal: string): T[] {
    if (!get(isGrouped))
      return [];

    const groupRows = get(mappedGroups)[groupVal];
    assert(groupRows);
    return groupRows.filter(isRow);
  }

  function onToggleExpandGroup(groupPartial: Partial<T>, value?: string): void {
    if (!value)
      return;

    const currentCollapsed = get(collapsedRows);

    const groupExpanded = isExpandedGroup(groupPartial);

    const groupRows = getGroupRows(value);

    set(
      collapsedRows,
      groupExpanded
        ? [...currentCollapsed, ...groupRows]
        : currentCollapsed.filter(row => !compareGroupsFn(row, groupPartial)),
    );

    set(collapsed, get(collapsedRows));
  }

  function onUngroup(): void {
    set(collapsedRows, []);

    set(collapsed, []);
    set(group, Array.isArray(get(group)) ? [] : undefined);
  }

  function onCopyGroup(value: GroupData<T>): void {
    emitCopyGroup(value);
  }

  return {
    groupKeys,
    groupKey,
    isGrouped,
    mappedGroups,
    grouped,
    getRowGroup,
    getGroupRows,
    compareGroupsFn,
    isExpandedGroup,
    isHiddenRow,
    onToggleExpandGroup,
    onUngroup,
    onCopyGroup,
  };
}
