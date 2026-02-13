import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useTableColumns } from '@/composables/tables/data-table/columns';

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

describe('composables/tables/data-table/columns', () => {
  let unmount: () => void;

  const cols: TableColumn<TestItem>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'title', label: 'Title' },
  ];

  const rows: TestItem[] = [{ id: 1, name: 'Alice', title: 'Developer' }];

  afterEach(() => {
    unmount?.();
  });

  it('should use provided cols', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => []),
        selectedData: ref(undefined),
        slots: {},
      }),
    );
    unmount = u;
    expect(get(result.columns)).toHaveLength(3);
  });

  it('should auto-generate columns from first row when cols is undefined', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => undefined,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => []),
        selectedData: ref(undefined),
        slots: {},
      }),
    );
    unmount = u;
    expect(get(result.columns)).toHaveLength(3);
    expect(get(result.columns).map(c => c.key)).toContain('id');
    expect(get(result.columns).map(c => c.key)).toContain('name');
    expect(get(result.columns).map(c => c.key)).toContain('title');
  });

  it('should add expand column when expandable', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => true),
        groupKeys: computed(() => []),
        selectedData: ref(undefined),
        slots: {},
      }),
    );
    unmount = u;
    expect(get(result.columns)).toHaveLength(4);
    expect(get(result.columns).at(-1)?.key).toBe('expand');
  });

  it('should filter out grouped columns', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => ['title']),
        selectedData: ref(undefined),
        slots: {},
      }),
    );
    unmount = u;
    expect(get(result.columns)).toHaveLength(2);
    expect(get(result.columns).map(c => c.key)).not.toContain('title');
  });

  it('should compute colspan including selection column', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => []),
        selectedData: ref([]),
        slots: {},
      }),
    );
    unmount = u;
    expect(get(result.colspan)).toBe(4);
  });

  it('should extract header slots', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => []),
        selectedData: ref(undefined),
        slots: { 'header.name': () => null, 'item.name': () => null },
      }),
    );
    unmount = u;
    expect(get(result.headerSlots)).toEqual(['header.name']);
  });

  it('should return cell value', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableColumns<TestItem, 'id'>({
        cols: () => cols,
        columnAttr: 'label',
        rows: () => rows,
        expandable: computed<boolean>(() => false),
        groupKeys: computed(() => []),
        selectedData: ref(undefined),
        slots: {},
      }),
    );
    unmount = u;
    expect(result.cellValue(rows[0]!, 'name')).toBe('Alice');
  });
});
