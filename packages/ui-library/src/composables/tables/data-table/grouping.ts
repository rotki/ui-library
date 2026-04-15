import type { ComputedRef, Ref } from 'vue';
import type { TableRowKey, TableRowKeyData } from '@/components/tables/RuiTableHead.vue';
import {
  GROUP_HEADER_BRAND,
  type GroupedTableRow,
  type GroupHeader,
  isRow,
} from '@/composables/tables/data-table/types';
import { assert } from '@/utils/assert';

export interface UseTableGroupingOptions<T extends object, IdType extends keyof T> {
  /** The property on each row used as the unique row identifier. */
  rowAttr: IdType;
}

export interface UseTableGroupingDeps<T extends object> {
  group: Ref<TableRowKeyData<T>>;
  collapsed: Ref<T[] | undefined>;
  sorted: ComputedRef<readonly T[]>;
}

export interface UseTableGroupingReturn<T extends object> {
  groupKeys: ComputedRef<TableRowKey<T>[]>;
  groupKey: ComputedRef<string | undefined>;
  isGrouped: ComputedRef<boolean>;
  mappedGroups: ComputedRef<Record<string, GroupedTableRow<T>[]>>;
  grouped: ComputedRef<readonly GroupedTableRow<T>[]>;
  getRowGroup: (row: T) => Partial<T>;
  getGroupRows: (groupVal: string) => T[];
  compareGroupsFn: (a: T, b: Partial<T>) => boolean;
  isExpandedGroup: (value: Partial<T>) => boolean;
  isHiddenRow: (row: GroupedTableRow<T>) => boolean;
  onToggleExpandGroup: (group: Partial<T>, value?: string) => void;
  onUngroup: () => void;
}

// Null character separator prevents false collisions when group values contain commas
const GROUP_KEY_SEPARATOR = '\0';

export function useTableGrouping<T extends object, IdType extends keyof T>(
  options: UseTableGroupingOptions<T, IdType>,
  deps: UseTableGroupingDeps<T>,
): UseTableGroupingReturn<T> {
  const { rowAttr } = options;
  const { group, collapsed, sorted } = deps;

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

  const groupKey = computed<string | undefined>(() => {
    const key = get(groupKeys).join(':');
    return key || undefined;
  });

  const isGrouped = computed<boolean>(() => get(groupKey) !== undefined);

  const collapsedIdentifierSet = computed<Set<T[IdType]>>(
    () => new Set(get(collapsedRows).map(row => row[rowAttr])),
  );

  const collapsedGroupKeySet = computed<Set<string>>(() => {
    const grouping = get(groupKeys);
    if (grouping.length === 0)
      return new Set<string>();

    const seen = new Set<string>();
    for (const row of get(collapsedRows))
      seen.add(computeGroupKey(row, grouping));
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
    const grouping = get(groupKeys);
    let groupVal = '';
    for (const gk of grouping) {
      if (groupVal)
        groupVal += GROUP_KEY_SEPARATOR;
      const val = value[gk];
      groupVal += isDefined(val) ? val : '';
    }
    return !get(collapsedGroupKeySet).has(groupVal);
  }

  function isHiddenRow(row: GroupedTableRow<T>): boolean {
    if (!get(isGrouped))
      return false;
    if (!isRow(row))
      return false;
    return get(collapsedIdentifierSet).has(row[rowAttr]);
  }

  function computeGroupKey(row: T, grouping: TableRowKey<T>[]): string {
    let key = '';
    for (const gk of grouping) {
      if (key)
        key += GROUP_KEY_SEPARATOR;
      const val = row[gk];
      key += isDefined(val) ? val : '';
    }
    return key;
  }

  const mappedGroups = computed<Record<string, GroupedTableRow<T>[]>>(() => {
    const grouping = get(groupKeys);
    if (grouping.length === 0)
      return {};

    const result = get(sorted);
    const identifier = rowAttr;
    const acc: Record<string, GroupedTableRow<T>[]> = {};

    for (const row of result) {
      if (!isDefined(row[identifier]) || row[identifier] === '')
        continue;

      const groupVal = computeGroupKey(row, grouping);
      if (!acc[groupVal]) {
        acc[groupVal] = [
          {
            [GROUP_HEADER_BRAND]: true,
            group: getRowGroup(row),
            identifier: groupVal,
          } satisfies GroupHeader<T>,
        ];
      }

      acc[groupVal].push(row);
    }

    return acc;
  });

  const grouped = computed<readonly GroupedTableRow<T>[]>(() => {
    const result = get(sorted);
    const groupByKey = get(groupKey);

    if (!groupByKey)
      return result;

    const groups = get(mappedGroups);
    const out: GroupedTableRow<T>[] = [];
    for (const items of Object.values(groups)) {
      for (const item of items)
        out.push(item);
    }
    return out;
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
  };
}
