import { afterEach, describe, expect, it } from 'vitest';
import { useTableGrouping } from '@/composables/tables/data-table/grouping';
import { GROUP_HEADER_BRAND } from '@/composables/tables/data-table/types';
import { withSetup } from '~/tests/helpers/with-setup';

interface TestItem {
  id: number;
  name: string;
  title: string;
}

describe('composables/tables/data-table/grouping', () => {
  let unmount: () => void;

  const rows: TestItem[] = [
    { id: 1, name: 'Alice', title: 'Developer' },
    { id: 2, name: 'Bob', title: 'Developer' },
    { id: 3, name: 'Charlie', title: 'Manager' },
  ];

  afterEach(() => {
    unmount?.();
  });

  it('should return empty groupKeys when group is undefined', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(undefined),
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.groupKeys)).toEqual([]);
    expect(get(result.isGrouped)).toBe(false);
  });

  it('should support single group key', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.groupKeys)).toEqual(['title']);
    expect(get(result.isGrouped)).toBe(true);
    expect(get(result.groupKey)).toBe('title');
  });

  it('should create grouped data with headers', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    const grouped = get(result.grouped);
    expect(grouped).toHaveLength(5);

    const headers = grouped.filter(item => GROUP_HEADER_BRAND in item);
    expect(headers).toHaveLength(2);
  });

  it('should toggle group collapse', () => {
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.isExpandedGroup({ title: 'Developer' })).toBe(true);

    result.onToggleExpandGroup({ title: 'Developer' }, 'Developer');

    expect(result.isExpandedGroup({ title: 'Developer' })).toBe(false);
    expect(get(collapsed)).toHaveLength(2);

    result.onToggleExpandGroup({ title: 'Developer' }, 'Developer');

    expect(result.isExpandedGroup({ title: 'Developer' })).toBe(true);
    expect(get(collapsed)).toHaveLength(0);
  });

  it('should ungroup', () => {
    const group = ref<string | undefined>('title');
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: group as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onUngroup();
    expect(get(group)).toBeUndefined();
    expect(get(collapsed)).toEqual([]);
  });

  it('should support array group keys', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(['name', 'title']) as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.groupKeys)).toEqual(['name', 'title']);
    expect(get(result.isGrouped)).toBe(true);
    expect(get(result.groupKey)).toBe('name:title');
  });

  it('should correctly identify hidden rows when group is collapsed', () => {
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Initially no rows hidden
    expect(result.isHiddenRow(rows[0]!)).toBe(false);

    // Collapse the Developer group
    result.onToggleExpandGroup({ title: 'Developer' }, 'Developer');

    // Rows in the Developer group should be hidden
    expect(result.isHiddenRow(rows[0]!)).toBe(true);
    expect(result.isHiddenRow(rows[1]!)).toBe(true);

    // Row in the Manager group should not be hidden
    expect(result.isHiddenRow(rows[2]!)).toBe(false);
  });

  it('should not hide rows when not grouped', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(undefined),
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.isHiddenRow(rows[0]!)).toBe(false);
  });

  it('should not treat group headers as hidden rows', () => {
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    const header = {
      [GROUP_HEADER_BRAND]: true as const,
      group: { title: 'Developer' },
      identifier: 'Developer',
    };
    expect(result.isHiddenRow(header)).toBe(false);
  });

  it('should return group rows via getGroupRows', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    const devRows = result.getGroupRows('Developer');
    expect(devRows).toHaveLength(2);
    expect(devRows.map(r => r.name)).toEqual(['Alice', 'Bob']);

    const mgrRows = result.getGroupRows('Manager');
    expect(mgrRows).toHaveLength(1);
    expect(mgrRows[0]?.name).toBe('Charlie');
  });

  it('should return empty array from getGroupRows when not grouped', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(undefined),
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.getGroupRows('Developer')).toEqual([]);
  });

  it('should compare groups using compareGroupsFn', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.compareGroupsFn(rows[0]!, { title: 'Developer' })).toBe(true);
    expect(result.compareGroupsFn(rows[0]!, { title: 'Manager' })).toBe(false);
    expect(result.compareGroupsFn(rows[2]!, { title: 'Manager' })).toBe(true);
  });

  it('should return false from compareGroupsFn when no group keys', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(undefined),
          collapsed: ref(undefined),
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.compareGroupsFn(rows[0]!, { title: 'Developer' })).toBe(false);
  });

  it('should not toggle expand when value is undefined', () => {
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onToggleExpandGroup({ title: 'Developer' }, undefined);
    // Should remain expanded since the call was a no-op
    expect(result.isExpandedGroup({ title: 'Developer' })).toBe(true);
    expect(get(collapsed)).toHaveLength(0);
  });

  it('should ungroup array group to empty array', () => {
    const group = ref<string[]>(['title']);
    const collapsed = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: group as any,
          collapsed,
          sorted: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onUngroup();
    expect(get(group)).toEqual([]);
  });

  it('should skip rows with empty identifier in mappedGroups', () => {
    const rowsWithEmpty = [
      { id: 1, name: 'Alice', title: 'Developer' },
      { id: '' as any, name: 'Unknown', title: 'None' },
      { id: 3, name: 'Charlie', title: 'Developer' },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rowsWithEmpty),
        },
      ),
    );
    unmount = u;

    const groups = get(result.mappedGroups);
    // "None" group should not exist since its row has empty id
    const noneGroup = groups.None;
    expect(noneGroup).toBeUndefined();
  });

  it('should create correct groups with multi-key grouping', () => {
    const multiRows: TestItem[] = [
      { id: 1, name: 'Alice', title: 'Developer' },
      { id: 2, name: 'Alice', title: 'Manager' },
      { id: 3, name: 'Bob', title: 'Developer' },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(['name', 'title']) as any,
          collapsed: ref(undefined),
          sorted: computed(() => multiRows),
        },
      ),
    );
    unmount = u;

    const groups = get(result.mappedGroups);
    // 3 unique name+title combos
    expect(Object.keys(groups)).toHaveLength(3);

    const grouped = get(result.grouped);
    // 3 headers + 3 rows
    expect(grouped).toHaveLength(6);
  });

  it('should produce different group keys for multi-key grouping with partial undefined', () => {
    interface PartialItem {
      id: number;
      name: string | undefined;
      title: string | undefined;
    }

    const partialRows: PartialItem[] = [
      { id: 1, name: 'foo', title: undefined },
      { id: 2, name: undefined, title: 'foo' },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<PartialItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(['name', 'title']) as any,
          collapsed: ref(undefined),
          sorted: computed<readonly PartialItem[]>(() => partialRows),
        },
      ),
    );
    unmount = u;

    const groups = get(result.mappedGroups);
    // Two distinct group keys — no collision between { name: 'foo', title: undefined } and { name: undefined, title: 'foo' }
    expect(Object.keys(groups)).toHaveLength(2);

    const grouped = get(result.grouped);
    // 2 headers + 2 rows
    expect(grouped).toHaveLength(4);

    const headers = grouped.filter(item => GROUP_HEADER_BRAND in item);
    expect(headers).toHaveLength(2);
  });

  it('should not collapse unrelated multi-key group when collapsing another sharing a partial key', () => {
    interface MultiKeyItem {
      id: number;
      category: string;
      status: string;
    }

    const multiKeyRows: MultiKeyItem[] = [
      { id: 1, category: 'A', status: 'active' },
      { id: 2, category: 'A', status: 'inactive' },
      { id: 3, category: 'B', status: 'active' },
    ];

    const collapsed = ref<MultiKeyItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<MultiKeyItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(['category', 'status']) as any,
          collapsed,
          sorted: computed<readonly MultiKeyItem[]>(() => multiKeyRows),
        },
      ),
    );
    unmount = u;

    // All groups start expanded
    expect(result.isExpandedGroup({ category: 'A', status: 'active' })).toBe(true);
    expect(result.isExpandedGroup({ category: 'A', status: 'inactive' })).toBe(true);
    expect(result.isExpandedGroup({ category: 'B', status: 'active' })).toBe(true);

    // Collapse the A+active group — find its key from the grouped output
    const grouped = get(result.grouped);
    const aActiveHeader = grouped.find(
      item => GROUP_HEADER_BRAND in item && 'identifier' in item,
    );
    const aActiveKey = aActiveHeader && 'identifier' in aActiveHeader ? aActiveHeader.identifier : undefined;

    result.onToggleExpandGroup({ category: 'A', status: 'active' }, aActiveKey);

    // A+active is collapsed
    expect(result.isExpandedGroup({ category: 'A', status: 'active' })).toBe(false);

    // A+inactive and B+active should still be expanded
    expect(result.isExpandedGroup({ category: 'A', status: 'inactive' })).toBe(true);
    expect(result.isExpandedGroup({ category: 'B', status: 'active' })).toBe(true);
  });

  it('should exclude rows with empty rowAttr value from grouped output', () => {
    interface EmptyIdItem {
      id: number | string;
      name: string;
      title: string;
    }

    const rowsWithEmptyId: EmptyIdItem[] = [
      { id: 1, name: 'Alice', title: 'Developer' },
      { id: '', name: 'Ghost', title: 'None' },
      { id: 3, name: 'Charlie', title: 'Developer' },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<EmptyIdItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed<readonly EmptyIdItem[]>(() => rowsWithEmptyId),
        },
      ),
    );
    unmount = u;

    const groups = get(result.mappedGroups);
    // "None" group should not exist since the row has empty id
    expect(groups.None).toBeUndefined();

    // Only "Developer" group should exist
    expect(Object.keys(groups)).toHaveLength(1);
    expect(groups.Developer).toBeDefined();

    const grouped = get(result.grouped);
    // 1 header + 2 Developer rows (Ghost row excluded)
    expect(grouped).toHaveLength(3);
  });
});
