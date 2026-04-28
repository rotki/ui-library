import type { TableSortData } from '@/components/tables/RuiTableHead.vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTableSort } from '@/composables/tables/data-table/sort';
import { assert } from '@/utils/assert';
import { withSetup } from '~/tests/helpers/with-setup';

interface TestItem {
  id: number;
  name: string;
  title: string;
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
    const sort = ref<TableSortData<TestItem>>({
      column: undefined,
      direction: 'asc',
    });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => 'alice', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'desc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'id', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: true },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: undefined, direction: 'asc' });
    const emitUpdateOptions = vi.fn();
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'desc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: undefined, direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>([{ column: 'name', direction: 'asc' }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>([{ column: 'name', direction: 'asc' }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // asc → desc
    result.onSort({ key: 'name' });
    const sortVal = get(result.sortData);
    assert(Array.isArray(sortVal));
    expect(sortVal).toHaveLength(1);
    expect(sortVal[0]?.direction).toBe('desc');
  });

  it('should remove column in multi-sort when toggling past desc', () => {
    const sort = ref<TableSortData<TestItem>>([
      { column: 'name', direction: 'desc' },
      { column: 'title', direction: 'asc' },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    // desc → remove
    result.onSort({ key: 'name' });
    const sortVal = get(result.sortData);
    assert(Array.isArray(sortVal));
    expect(sortVal).toHaveLength(1);
    expect(sortVal[0]?.column).toBe('title');
  });

  it('should return sort index for multi-sort', () => {
    const sort = ref<TableSortData<TestItem>>([
      { column: 'name', direction: 'asc' },
      { column: 'title', direction: 'asc' },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: 'name', direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(result.getSortIndex('name')).toBe(-1);
  });

  it('should build sortedMap from multi-sort array', () => {
    const sort = ref<TableSortData<TestItem>>([
      { column: 'name', direction: 'asc' },
      { column: 'id', direction: 'desc' },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: undefined, direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>([
      { column: 'name', direction: 'asc' },
      { column: undefined, direction: 'asc' },
    ]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>({ column: undefined, direction: 'asc' });
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
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
    const sort = ref<TableSortData<TestItem>>([{ column: 'name', direction: 'asc' }]);
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'title', direction: 'desc' });
    const sortVal = get(result.sortData);
    assert(Array.isArray(sortVal));
    expect(sortVal).toHaveLength(2);
    expect(sortVal[1]?.column).toBe('title');
    expect(sortVal[1]?.direction).toBe('desc');
  });

  it('should do nothing when onSort is called with undefined sortData', () => {
    const sort = ref<TableSortData<TestItem>>(undefined);
    const emitUpdateOptions = vi.fn();
    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => rows, search: () => '', sortModifiersExternal: false },
        {
          sort,
          pagination: ref(undefined),
          emitUpdateOptions,
        },
      ),
    );
    unmount = u;

    result.onSort({ key: 'name' });
    expect(emitUpdateOptions).not.toHaveBeenCalled();
  });

  it('should match rows with undefined field values when searching for "undefined"', () => {
    interface PartialItem {
      id: number;
      name: string | undefined;
      title: string;
    }

    const rowsWithUndefined: PartialItem[] = [
      { id: 1, name: undefined, title: 'Developer' },
      { id: 2, name: 'Bob', title: 'Designer' },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableSort<PartialItem>(
        { rows: () => rowsWithUndefined, search: () => 'undefined', sortModifiersExternal: false },
        {
          sort: ref<TableSortData<PartialItem>>({ column: undefined, direction: 'asc' }),
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(get(result.searchData)).toHaveLength(1);
    expect(get(result.searchData)[0]?.id).toBe(1);
  });

  it('should return empty results when searching on empty rows', () => {
    const emptyRows: TestItem[] = [];

    const { result, unmount: u } = withSetup(() =>
      useTableSort<TestItem>(
        { rows: () => emptyRows, search: () => 'alice', sortModifiersExternal: false },
        {
          sort: ref<TableSortData<TestItem>>({ column: undefined, direction: 'asc' }),
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    expect(get(result.searchData)).toHaveLength(0);
  });

  it('should detect numeric column type by skipping null values', () => {
    interface NullableItem {
      id: number;
      score: number | null;
    }

    const rowsWithNull: NullableItem[] = [
      { id: 1, score: null },
      { id: 2, score: 10 },
      { id: 3, score: 2 },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableSort<NullableItem>(
        { rows: () => rowsWithNull, search: () => '', sortModifiersExternal: false },
        {
          sort: ref<TableSortData<NullableItem>>({ column: 'score', direction: 'asc' }),
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    // Numeric sort: null coerces to 0 via Number(null), so null < 2 < 10
    expect(sorted[0]?.score).toBeNull();
    expect(sorted[1]?.score).toBe(2);
    expect(sorted[2]?.score).toBe(10);
  });

  it('should break ties with secondary sort in multi-column sort', () => {
    interface TieItem {
      id: number;
      group: string;
      rank: number;
    }

    const tieRows: TieItem[] = [
      { id: 1, group: 'A', rank: 3 },
      { id: 2, group: 'A', rank: 1 },
      { id: 3, group: 'B', rank: 2 },
      { id: 4, group: 'A', rank: 2 },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableSort<TieItem>(
        { rows: () => tieRows, search: () => '', sortModifiersExternal: false },
        {
          sort: ref<TableSortData<TieItem>>([
            { column: 'group', direction: 'asc' },
            { column: 'rank', direction: 'asc' },
          ]),
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    // Group A first (sorted by rank: 1, 2, 3), then group B (rank: 2)
    expect(sorted[0]?.id).toBe(2);
    expect(sorted[1]?.id).toBe(4);
    expect(sorted[2]?.id).toBe(1);
    expect(sorted[3]?.id).toBe(3);
  });

  it('should handle column with all null values without errors', () => {
    interface AllNullItem {
      id: number;
      value: string | null;
    }

    const allNullRows: AllNullItem[] = [
      { id: 1, value: null },
      { id: 2, value: null },
      { id: 3, value: null },
    ];

    const { result, unmount: u } = withSetup(() =>
      useTableSort<AllNullItem>(
        { rows: () => allNullRows, search: () => '', sortModifiersExternal: false },
        {
          sort: ref<TableSortData<AllNullItem>>({ column: 'value', direction: 'asc' }),
          pagination: ref(undefined),
          emitUpdateOptions: () => {},
        },
      ),
    );
    unmount = u;

    const sorted = get(result.sorted);
    // Should not throw; all null values treated as string comparison
    expect(sorted).toHaveLength(3);
    expect(sorted[0]?.id).toBe(1);
    expect(sorted[1]?.id).toBe(2);
    expect(sorted[2]?.id).toBe(3);
  });
});
