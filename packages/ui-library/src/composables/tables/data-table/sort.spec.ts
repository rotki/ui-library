import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useTableSort } from '@/composables/tables/data-table/sort';

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

describe('composables/tables/data-table/sort', () => {
  let unmount: () => void;

  const rows: TestItem[] = [
    { id: 3, name: 'Charlie', title: 'Manager' },
    { id: 1, name: 'Alice', title: 'Developer' },
    { id: 2, name: 'Bob', title: 'Designer' },
  ];

  afterEach(() => {
    unmount?.();
  });

  it('should filter rows based on search query', () => {
    const sort = ref<{ column?: string; direction: 'asc' | 'desc' } | undefined>({
      column: undefined,
      direction: 'asc',
    });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => 'alice', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(get(result.searchData)).toHaveLength(1);
    expect(get(result.searchData)[0]?.name).toBe('Alice');
  });

  it('should sort rows ascending', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    expect(sorted[0]?.name).toBe('Alice');
    expect(sorted[1]?.name).toBe('Bob');
    expect(sorted[2]?.name).toBe('Charlie');
  });

  it('should sort rows descending', () => {
    const sort = ref({ column: 'name', direction: 'desc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    expect(sorted[0]?.name).toBe('Charlie');
    expect(sorted[2]?.name).toBe('Alice');
  });

  it('should sort numeric values correctly', () => {
    const sort = ref({ column: 'id', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    expect(sorted[0]?.id).toBe(1);
    expect(sorted[1]?.id).toBe(2);
    expect(sorted[2]?.id).toBe(3);
  });

  it('should not sort when sortModifiersExternal is true', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: true },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    expect(sorted[0]?.name).toBe('Charlie');
  });

  it('should build sortedMap from single sort', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.isSortedBy('name')).toBe(true);
    expect(result.isSortedBy('id')).toBe(false);
  });

  it('should emit update:options when sort changes via onSort', () => {
    const sort = ref({ column: undefined, direction: 'asc' as const });
    const emitUpdateOptions = vi.fn();
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions,
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'name' });
    expect(emitUpdateOptions).toHaveBeenCalled();
  });

  it('should toggle single sort direction on same column', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // asc → desc
    result.onSort({ key: 'name' });
    expect(get(result.sortData)).toEqual({ column: 'name', direction: 'desc' });
  });

  it('should clear single sort when toggling past desc', () => {
    const sort = ref({ column: 'name', direction: 'desc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // desc → clear (column=undefined, direction=asc)
    result.onSort({ key: 'name' });
    expect(get(result.sortData)).toEqual({ column: undefined, direction: 'asc' });
  });

  it('should set new column when sorting unsorted column in single mode', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'title' });
    expect(get(result.sortData)).toEqual({ column: 'title', direction: 'asc' });
  });

  it('should support explicit direction in onSort', () => {
    const sort = ref({ column: undefined, direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'name', direction: 'desc' });
    expect(get(result.sortData)).toEqual({ column: 'name', direction: 'desc' });
  });

  it('should add column in multi-sort mode', () => {
    const sort = ref([{ column: 'name', direction: 'asc' as const }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'title' });
    const sortVal = get(result.sortData);
    expect(Array.isArray(sortVal)).toBe(true);
    expect(sortVal).toHaveLength(2);
  });

  it('should toggle direction in multi-sort mode', () => {
    const sort = ref([{ column: 'name', direction: 'asc' as const }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // asc → desc
    result.onSort({ key: 'name' });
    const sortVal = get(result.sortData) as Array<{ column: string; direction: string }>;
    expect(sortVal).toHaveLength(1);
    expect(sortVal[0]?.direction).toBe('desc');
  });

  it('should remove column in multi-sort when toggling past desc', () => {
    const sort = ref([
      { column: 'name', direction: 'desc' as const },
      { column: 'title', direction: 'asc' as const },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // desc → remove
    result.onSort({ key: 'name' });
    const sortVal = get(result.sortData) as Array<{ column: string; direction: string }>;
    expect(sortVal).toHaveLength(1);
    expect(sortVal[0]?.column).toBe('title');
  });

  it('should return sort index for multi-sort', () => {
    const sort = ref([
      { column: 'name', direction: 'asc' as const },
      { column: 'title', direction: 'asc' as const },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.getSortIndex('name')).toBe(0);
    expect(result.getSortIndex('title')).toBe(1);
    expect(result.getSortIndex('id')).toBe(-1);
  });

  it('should return -1 for getSortIndex in single sort mode', () => {
    const sort = ref({ column: 'name', direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.getSortIndex('name')).toBe(-1);
  });

  it('should build sortedMap from multi-sort array', () => {
    const sort = ref([
      { column: 'name', direction: 'asc' as const },
      { column: 'id', direction: 'desc' as const },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.isSortedBy('name')).toBe(true);
    expect(result.isSortedBy('id')).toBe(true);
    expect(result.isSortedBy('title')).toBe(false);
  });

  it('should return empty sortedMap when single sort column is undefined', () => {
    const sort = ref({ column: undefined, direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.isSortedBy('name')).toBe(false);
    expect(result.isSortedBy('id')).toBe(false);
  });

  it('should skip entries with falsy column in multi-sort sortedMap', () => {
    const sort = ref([
      { column: 'name', direction: 'asc' as const },
      { column: undefined, direction: 'asc' as const },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.isSortedBy('name')).toBe(true);
    // The undefined column entry should be skipped
    expect(Object.keys(get(result.sortedMap))).toHaveLength(1);
  });

  it('should preserve row order when sort column is undefined', () => {
    const sort = ref({ column: undefined, direction: 'asc' as const });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    // Original order preserved since column is undefined
    expect(sorted[0]?.name).toBe('Charlie');
    expect(sorted[1]?.name).toBe('Alice');
    expect(sorted[2]?.name).toBe('Bob');
  });

  it('should support explicit direction in multi-sort onSort', () => {
    const sort = ref([{ column: 'name', direction: 'asc' as const }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'title', direction: 'desc' });
    const sortVal = get(result.sortData) as Array<{ column: string; direction: string }>;
    expect(sortVal).toHaveLength(2);
    expect(sortVal[1]?.column).toBe('title');
    expect(sortVal[1]?.direction).toBe('desc');
  });

  it('should do nothing when onSort is called with undefined sortData', () => {
    const sort = ref(undefined);
    const emitUpdateOptions = vi.fn();
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort: sort as any,
          pagination: ref(undefined),
          emitUpdateOptions,
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'name' });
    expect(emitUpdateOptions).not.toHaveBeenCalled();
  });
});
