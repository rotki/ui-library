import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTableDefaults, TableSymbol } from '@/composables/defaults/table';
import { useTablePagination } from '@/composables/tables/data-table/pagination';
import { GROUP_HEADER_BRAND, type GroupedTableRow } from '@/composables/tables/data-table/types';
import { withSetup } from '~/tests/helpers/with-setup';

interface TestItem {
  id: number;
  name: string;
}

const paginationMountOptions = {
  global: {
    provide: {
      [TableSymbol.valueOf()]: createTableDefaults({
        limits: [5, 10, 25],
      }),
    },
  },
};

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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      { [GROUP_HEADER_BRAND]: true, group: { name: 'A' }, identifier: 'A' },
      { id: 1, name: 'A' },
      { id: 2, name: 'A' },
      { [GROUP_HEADER_BRAND]: true, group: { name: 'B' }, identifier: 'B' },
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
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
      ), paginationMountOptions);
    unmount = u;

    result.setInternalTotal(rows);
    expect(get(result.itemsLength)).toBe(0);
  });

  describe('grouped pagination algorithm', () => {
    const groupedData: GroupedTableRow<TestItem>[] = [
      { [GROUP_HEADER_BRAND]: true, group: { name: 'A' }, identifier: 'A' },
      { id: 1, name: 'A' },
      { id: 2, name: 'A' },
      { id: 3, name: 'A' },
      { [GROUP_HEADER_BRAND]: true, group: { name: 'B' }, identifier: 'B' },
      { id: 4, name: 'B' },
      { id: 5, name: 'B' },
    ];

    it('should prepend group header when page starts mid-group', () => {
      const tableDefaults = createTableDefaults({ limits: [2, 5, 10] });
      const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
        limit: 2,
        page: 2,
        total: 5,
      });
      const { result, unmount: u } = withSetup(() =>
        useTablePagination<TestItem>(
          { itemsPerPage: 2, paginationModifiersExternal: false, globalItemsPerPage: undefined },
          {
            pagination,
            grouped: computed<GroupedTableRow<TestItem>[]>(() => groupedData),
            isHiddenRow: () => false,
            sort: ref(undefined),
            emitUpdateOptions: () => {},
            tableDefaults,
          },
        ), paginationMountOptions);
      unmount = u;

      result.setInternalTotal(groupedData);

      const filtered = get(result.filtered);
      // Page 2 with limit 2: data rows 3 and 4
      // Row 3 (id:3) belongs to group A, so group A header should be prepended
      // Row 4 (id:4) belongs to group B, so group B header should also appear
      expect(filtered).toHaveLength(4);
      expect(filtered[0]).toHaveProperty('identifier', 'A');
      expect(filtered[1]).toHaveProperty('id', 3);
      expect(filtered[2]).toHaveProperty('identifier', 'B');
      expect(filtered[3]).toHaveProperty('id', 4);
    });

    it('should remove trailing group header with no data rows after it', () => {
      const tableDefaults = createTableDefaults({ limits: [3, 5, 10] });
      const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
        limit: 3,
        page: 1,
        total: 5,
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
        ), paginationMountOptions);
      unmount = u;

      result.setInternalTotal(groupedData);

      const filtered = get(result.filtered);
      // Page 1 with limit 3: data rows 1, 2, 3 (all group A)
      // The algorithm collects group A header + rows 1,2,3, then group B header
      // But group B header has no data rows on this page, so it should be removed
      expect(filtered).toHaveLength(4);
      expect(filtered[0]).toHaveProperty('identifier', 'A');
      expect(filtered[1]).toHaveProperty('id', 1);
      expect(filtered[2]).toHaveProperty('id', 2);
      expect(filtered[3]).toHaveProperty('id', 3);
      // Group B header should NOT be present
      const hasTrailingBHeader = filtered.some(
        item => 'identifier' in item && item.identifier === 'B',
      );
      expect(hasTrailingBHeader).toBe(false);
    });

    it('should handle group header exactly at page boundary start', () => {
      const tableDefaults = createTableDefaults({ limits: [2, 5, 10] });
      // Group A has 3 data rows, Group B has 2 data rows
      // With limit 3, page 2 starts at data row index 3, which is id:4 (group B)
      // The group B header sits exactly before data row 4
      const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
        limit: 3,
        page: 2,
        total: 5,
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
        ), paginationMountOptions);
      unmount = u;

      result.setInternalTotal(groupedData);

      const filtered = get(result.filtered);
      // Page 2: data rows 4 and 5 (group B)
      // Group B header falls at exactly the page boundary (dataCount === start when header is seen)
      // so it should be included naturally (not prepended)
      expect(filtered).toHaveLength(3);
      expect(filtered[0]).toHaveProperty('identifier', 'B');
      expect(filtered[1]).toHaveProperty('id', 4);
      expect(filtered[2]).toHaveProperty('id', 5);
    });

    it('should include multiple group headers when page spans two groups', () => {
      const tableDefaults = createTableDefaults({ limits: [4, 5, 10] });
      const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
        limit: 4,
        page: 1,
        total: 5,
      });
      const { result, unmount: u } = withSetup(() =>
        useTablePagination<TestItem>(
          { itemsPerPage: 4, paginationModifiersExternal: false, globalItemsPerPage: undefined },
          {
            pagination,
            grouped: computed<GroupedTableRow<TestItem>[]>(() => groupedData),
            isHiddenRow: () => false,
            sort: ref(undefined),
            emitUpdateOptions: () => {},
            tableDefaults,
          },
        ), paginationMountOptions);
      unmount = u;

      result.setInternalTotal(groupedData);

      const filtered = get(result.filtered);
      // Page 1 with limit 4: data rows 1, 2, 3, 4
      // Group A header + rows 1,2,3 + Group B header + row 4
      expect(filtered).toHaveLength(6);
      expect(filtered[0]).toHaveProperty('identifier', 'A');
      expect(filtered[1]).toHaveProperty('id', 1);
      expect(filtered[2]).toHaveProperty('id', 2);
      expect(filtered[3]).toHaveProperty('id', 3);
      expect(filtered[4]).toHaveProperty('identifier', 'B');
      expect(filtered[5]).toHaveProperty('id', 4);
    });

    it('should filter hidden rows from grouped pagination results', () => {
      const tableDefaults = createTableDefaults({ limits: [5, 10, 25] });
      const pagination = ref<{ limit: number; page: number; total: number } | undefined>({
        limit: 5,
        page: 1,
        total: 5,
      });
      const { result, unmount: u } = withSetup(() =>
        useTablePagination<TestItem>(
          { itemsPerPage: 5, paginationModifiersExternal: false, globalItemsPerPage: undefined },
          {
            pagination,
            grouped: computed<GroupedTableRow<TestItem>[]>(() => groupedData),
            isHiddenRow: (row: GroupedTableRow<TestItem>): boolean => {
              if ('id' in row)
                return row.id <= 3;
              return false;
            },
            sort: ref(undefined),
            emitUpdateOptions: () => {},
            tableDefaults,
          },
        ), paginationMountOptions);
      unmount = u;

      result.setInternalTotal(groupedData);

      const filtered = get(result.filtered);
      // All 5 data rows fit on page 1. isHiddenRow hides rows with id <= 3.
      // Remaining visible: group A header, group B header, row 4, row 5
      // Group A header stays because isHiddenRow returns false for headers
      const dataRows = filtered.filter(item => 'id' in item);
      expect(dataRows).toHaveLength(2);
      expect(dataRows[0]).toHaveProperty('id', 4);
      expect(dataRows[1]).toHaveProperty('id', 5);
    });
  });
});
