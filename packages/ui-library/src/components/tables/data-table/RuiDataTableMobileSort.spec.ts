import type { SortColumn, TableColumn, TableRowKey } from '@/components/tables/RuiTableHead.vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiDataTableMobileSort from '@/components/tables/data-table/RuiDataTableMobileSort.vue';
import { assertExists, cleanupElements, queryByDataId } from '~/tests/helpers/dom-helpers';
import { createMounter, type MountedWrapper } from '~/tests/helpers/mount-component';

interface User {
  id: number;
  name: string;
  title: string;
}

const columns: TableColumn<User>[] = [
  { key: 'id', label: 'ID' },
  { align: 'end', key: 'name', label: 'Full name', sortable: true },
  { key: 'title', label: 'Job position', sortable: true },
];

function sortedMapFor(column?: TableRowKey<User>, direction: 'asc' | 'desc' = 'asc'): Partial<Record<TableRowKey<User>, SortColumn<User>>> {
  return column ? { [column]: { column, direction } } : {};
}

const createWrapper = createMounter(RuiDataTableMobileSort<User>, {
  props: {
    columns,
    sortedMap: sortedMapFor(),
  },
});

describe('components/tables/data-table/RuiDataTableMobileSort.vue', () => {
  let wrapper: MountedWrapper<typeof RuiDataTableMobileSort<User>>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    cleanupElements('*', document.body);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should label the activator "Sort" when nothing is sorted', () => {
    wrapper = createWrapper();
    expect(wrapper.find('[data-id=table-mobile-sort-activator]').text()).toContain('Sort');
  });

  it('should label the activator with the active column', () => {
    wrapper = createWrapper({ props: { columns, sortedMap: sortedMapFor('name', 'asc') } });
    expect(wrapper.find('[data-id=table-mobile-sort-activator]').text()).toContain('Full name');
  });

  it('should render one menu option per sortable column only', async () => {
    wrapper = createWrapper({ props: { columns, sortedMap: sortedMapFor('name') } });

    await wrapper.find('[data-id=table-mobile-sort-activator]').trigger('click');
    await vi.runAllTimersAsync();

    expect(queryByDataId('table-mobile-sort-option-name')).toBeTruthy();
    expect(queryByDataId('table-mobile-sort-option-title')).toBeTruthy();
    // Non-sortable columns get no option.
    expect(queryByDataId('table-mobile-sort-option-id')).toBeFalsy();
  });

  it('should emit the column default direction so the sort composable can cycle', async () => {
    wrapper = createWrapper({ props: { columns, sortedMap: sortedMapFor('name', 'asc') } });

    await wrapper.find('[data-id=table-mobile-sort-activator]').trigger('click');
    await vi.runAllTimersAsync();

    const option = queryByDataId<HTMLElement>('table-mobile-sort-option-name');
    assertExists(option);
    option.click();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('sort')).toStrictEqual([[{ direction: 'asc', key: 'name' }]]);
  });

  it('should mark the active option with its direction for styling hooks', async () => {
    wrapper = createWrapper({ props: { columns, sortedMap: sortedMapFor('title', 'desc') } });

    await wrapper.find('[data-id=table-mobile-sort-activator]').trigger('click');
    await vi.runAllTimersAsync();

    const active = queryByDataId('table-mobile-sort-option-title');
    assertExists(active);
    expect(active.getAttribute('data-active')).toBe('true');
    expect(active.getAttribute('data-direction')).toBe('desc');
  });
});
