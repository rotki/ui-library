import type { GroupedTableRow } from '@/composables/tables/data-table/types';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { createTableDefaults, TableSymbol } from '@/composables/defaults/table';
import { useTablePagination } from '@/composables/tables/data-table/pagination';

interface TestItem {
  id: number;
  name: string;
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
  const wrapper = mount(TestComponent, {
    global: {
      provide: {
        [TableSymbol.valueOf()]: createTableDefaults({
          limits: [5, 10, 25],
        }),
      },
    },
  });
  return { result, unmount: () => wrapper.unmount() };
}

describe('composables/tables/data-table/pagination', () => {
  let unmount: () => void;

  const rows: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
  }));

  afterEach(() => {
    unmount?.();
  });

  it('should create default pagination when no external pagination', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination: ref(undefined),
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    const pagination = get(result.paginationData);
    expect(pagination.limit).toBe(10);
    expect(pagination.page).toBe(1);
  });

  it('should paginate data internally', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 5,
      page: 1,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 5, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    expect(get(result.filtered)).toHaveLength(5);
    expect((get(result.filtered)[0] as TestItem).id).toBe(1);
  });

  it('should show second page', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 5,
      page: 2,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 5, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    expect(get(result.filtered)).toHaveLength(5);
    expect((get(result.filtered)[0] as TestItem).id).toBe(6);
  });

  it('should not paginate when paginationModifiersExternal is true', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 5,
      page: 1,
      total: 100,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 5, paginationModifiersExternal: true, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    expect(get(result.filtered)).toHaveLength(25);
    expect(get(result.paginationData).total).toBe(100);
  });

  it('should set internal total', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination: ref(undefined),
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);
    expect(get(result.itemsLength)).toBe(25);
  });

  it('should emit update:options on pagination set', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const emitUpdateOptions = vi.fn();
    const pagination = ref({ limit: 10, page: 1, total: 25 });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions,
          tableDefaults,
        },
      ),
    );
    unmount = u;

    set(result.paginationData, { limit: 5, page: 1, total: 25 });
    expect(emitUpdateOptions).toHaveBeenCalled();
  });

  it('should auto-adjust page when current page exceeds max', async () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 5,
      page: 5,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 5, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    // Set to page 10 which exceeds max (25/5=5)
    set(result.paginationData, { limit: 5, page: 10, total: 25 });

    await nextTick();

    expect(get(result.paginationData).page).toBe(5);
  });

  it('should sync pagination limit to global defaults when globalItemsPerPage is true', async () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 10,
      page: 1,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: true },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    // Change pagination limit
    set(result.paginationData, { limit: 25, page: 1, total: 25 });

    await nextTick();

    // Should sync to global defaults
    expect(get(tableDefaults.itemsPerPage)).toBe(25);
  });

  it('should sync global defaults to pagination limit when globalItemsPerPage is true', async () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 10,
      page: 1,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: true },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    // Change global default
    set(tableDefaults.itemsPerPage, 5);

    await nextTick();

    expect(get(result.paginationData).limit).toBe(5);
  });

  it('should not sync to global defaults when globalItemsPerPage is false', async () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 10,
      page: 1,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: false, globalItemsPerPage: false },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    set(tableDefaults.itemsPerPage, 5);

    await nextTick();

    // Should NOT sync since globalItemsPerPage is false
    expect(get(result.paginationData).limit).toBe(10);
  });

  it('should handle pagination with group headers', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const groupedData: GroupedTableRow<TestItem>[] = [
      { __header__: true, group: { name: 'A' }, identifier: 'A' },
      { id: 1, name: 'A' },
      { id: 2, name: 'A' },
      { __header__: true, group: { name: 'B' }, identifier: 'B' },
      { id: 3, name: 'B' },
    ];

    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 3,
      page: 1,
      total: 3,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 3, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => groupedData),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(groupedData);

    const filtered = get(result.filtered);
    // Should include group headers alongside data rows
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should return empty filtered when page is beyond data', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 5,
      page: 100,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 5, paginationModifiersExternal: false, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);

    expect(get(result.filtered)).toHaveLength(0);
  });

  it('should filter hidden rows in external pagination mode', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
      limit: 25,
      page: 1,
      total: 25,
    });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 25, paginationModifiersExternal: true, globalItemsPerPage: undefined },
        {
          pagination,
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: (row) => {
            if ('id' in row)
              return (row as TestItem).id <= 5;
            return false;
          },
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    // 25 rows, first 5 hidden
    expect(get(result.filtered)).toHaveLength(20);
  });

  it('should not set internal total when paginationModifiersExternal is true', () => {
    const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
    const { result, unmount: u } = withSetup(() =>
      useTablePagination<TestItem>(
        { itemsPerPage: 10, paginationModifiersExternal: true, globalItemsPerPage: undefined },
        {
          pagination: ref(undefined),
          grouped: computed<GroupedTableRow<TestItem>[]>(() => rows),
          isHiddenRow: () => false,
          sort: ref(undefined),
          emitUpdateOptions: () => {},
          tableDefaults,
        },
      ),
    );
    unmount = u;

    result.setInternalTotal(rows);
    expect(get(result.itemsLength)).toBe(0);
  });
});
