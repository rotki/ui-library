import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useTableGrouping } from '@/composables/tables/data-table/grouping';

interface TestItem {
  id: number;
  name: string;
  title: string;
}

function withSetup<T>(composable: () => T): { result: T; unmount: () => void } {
  let result!: T;
  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);
  return { result, unmount: () => wrapper.unmount() };
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
        },
      ),
    );
    unmount = u;

    const grouped = get(result.grouped);
    expect(grouped).toHaveLength(5);

    const headers = grouped.filter(item => '__header__' in item);
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
        },
      ),
    );
    unmount = u;

    result.onUngroup();
    expect(get(group)).toBeUndefined();
    expect(get(collapsed)).toEqual([]);
  });

  it('should call emitCopyGroup on copy', () => {
    const emitCopyGroup = vi.fn();
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref('title') as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
          emitCopyGroup,
        },
      ),
    );
    unmount = u;

    result.onCopyGroup({ key: 'title', value: { title: 'Developer' } });
    expect(emitCopyGroup).toHaveBeenCalledWith({ key: 'title', value: { title: 'Developer' } });
  });

  it('should support array group keys', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableGrouping<TestItem, 'id'>(
        { rowAttr: 'id' },
        {
          group: ref(['name', 'title']) as any,
          collapsed: ref(undefined),
          sorted: computed(() => rows),
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
        },
      ),
    );
    unmount = u;

    const header = {
      __header__: true as const,
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
          emitCopyGroup: () => {},
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
});
