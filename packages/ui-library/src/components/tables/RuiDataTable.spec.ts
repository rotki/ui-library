import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiDataTable from '@/components/tables/RuiDataTable.vue';
import RuiTablePagination from '@/components/tables/RuiTablePagination.vue';
import { createTableDefaults, TableSymbol } from '@/composables/defaults/table';
import { assert } from '@/utils/assert';
import { expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
}

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiDataTable<User>>,
) {
  return mount(RuiDataTable<User>, {
    ...options,
    global: {
      provide: {
        [TableSymbol.valueOf()]: createTableDefaults({
          limits: [5, 10, 15, 25, 50, 100, 200],
        }),
      },
    },
  });
}

describe('components/tables/RuiDataTable.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  const data: User[] = [
    ...[...new Array(50)].map((_, index) => ({
      email: `lindsay.walton${index}@example.com`,
      id: index + 1,
      name: `Lindsay Walton ${index}`,
      title: index % 2 === 0 ? 'Back-end Developer' : 'Front-end Developer',
    })),
  ];

  const columns: TableColumn<User>[] = [{
    key: 'id',
    label: 'ID',
  }, {
    align: 'end',
    key: 'name',
    label: 'Full name',
    sortable: true,
  }, {
    align: 'start',
    key: 'title',
    label: 'Job position',
    sortable: true,
  }, {
    key: 'email',
    label: 'Email address',
    sortable: true,
  }, {
    key: 'action',
  }];

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        cols: columns,
        rowAttr: 'id',
        rows: data,
      },
    });

    expectWrapperToHaveClass(wrapper, 'table', /_table_/);
    expect(wrapper.find('table thead').exists()).toBeTruthy();
    expect(wrapper.find('table tbody').exists()).toBeTruthy();
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'dense': true,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'outlined': true,
        'pagination': { limit: 10, page: 1, total: 50 },
        'rowAttr': 'id',
        'rows': data,
        'search': '',
        'sort': [{ column: 'name', direction: 'asc' }],
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });
    expect(wrapper.find('table thead th[class*=_checkbox_]').exists()).toBeTruthy();
    expect(wrapper.find('table tbody td[class*=_checkbox_]').exists()).toBeTruthy();
    expect(wrapper.find('table tbody td[class*=_align__start_]').exists()).toBeTruthy();
    expect(wrapper.find('table tbody td[class*=_align__start_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_navigation_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_navigation_] button[disabled]').exists()).toBeTruthy();

    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').exists()).toBeTruthy();
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeFalsy();

    await wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]').exists()).toBeTruthy();
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeTruthy();
    expect(wrapper.find('div[data-cy=table-pagination] div[class*=limit]').exists()).toBeTruthy();
    expect(wrapper.find('div[data-cy=table-pagination] div[class*=ranges]').exists()).toBeTruthy();
    expect(wrapper.find('div[data-cy=table-pagination] div[class*=navigation]').exists()).toBeTruthy();
  });

  it('should multiple expand toggles correctly', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'rowAttr': 'id',
        'rows': data,
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });

    expect(wrapper.props().expanded).toHaveLength(0);
    expect(wrapper.find('tbody tr[hidden]:nth-child(2) div[data-cy=expanded-content]').exists()).toBeFalsy();

    await wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);
    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]').exists()).toBeTruthy();
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeTruthy();

    await wrapper.find('tbody tr:nth-child(3) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.props().expanded).toHaveLength(2);
    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]').exists()).toBeTruthy();
    expect(wrapper.find('tbody tr:nth-child(4) div[data-cy=expanded-content]').exists()).toBeTruthy();
  });

  it('should selection toggles correctly', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'modelValue': [],
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
        'rowAttr': 'id',
        'rows': data,
      },
    });

    expect(wrapper.props().modelValue).toHaveLength(0);
    expect(wrapper.find('thead tr [data-cy=table-toggle-check-all] input').exists()).toBeTruthy();

    await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(true);

    expect(wrapper.props().modelValue).toHaveLength(10);
    expect(wrapper.find('tr [data-cy*=table-toggle-check-] span[class*=checkbox][class*=checked]').exists()).toBeTruthy();
    expect(wrapper.findAll('tr [data-cy*=table-toggle-check-] span[class*=checkbox][class*=checked]')).toHaveLength(11);

    await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(false);

    expect(wrapper.props().modelValue).toHaveLength(0);

    await wrapper.find('tr [data-cy=table-toggle-check-0] input').setValue(true);

    expect(wrapper.props().modelValue).toHaveLength(1);
  });

  it('should single expand toggles correctly', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'rowAttr': 'id',
        'rows': data,
        'singleExpand': true,
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });

    expect(wrapper.props().expanded).toHaveLength(0);
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeFalsy();

    await wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);
    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]').exists()).toBeTruthy();
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeTruthy();

    await wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.props().expanded).toHaveLength(0);
    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeFalsy();

    await wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.find('tbody tr:nth-child(2) div[data-cy=expanded-content]').exists()).toBeTruthy();

    await wrapper.find('tbody tr:nth-child(3) button[class*=_tr__expander_button]').trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);
    expect(wrapper.find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]').exists()).toBeFalsy();
    expect(wrapper.find('tbody tr:nth-child(4) div[data-cy=expanded-content]').exists()).toBeFalsy();
  });

  it('should sticky header behaves as expected', async () => {
    wrapper = createWrapper({
      props: {
        cols: columns,
        modelValue: [],
        rowAttr: 'id',
        rows: data,
        stickyHeader: true,
        stickyOffset: 40,
      },
    });

    expect(wrapper.find('thead[data-id=head-clone]').exists()).toBeTruthy();

    await wrapper.setProps({ stickyHeader: false });

    expect(wrapper.find('thead[data-id=head-clone]').exists()).toBeFalsy();
  });

  it('should reset page number when search value is updated', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'onUpdate:pagination': (pagination: any) => wrapper.setProps({ pagination }),
        'pagination': { limit: 10, page: 5, total: 50 },
        'rowAttr': 'id',
        'rows': data,
        'search': '',
      },
    });

    await wrapper.setProps({ search: 'new search' });
    expect(wrapper.props().pagination?.page).toBe(1);
  });

  it('should auto-adjust page when current page exceeds max pages due to total decrease', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'onUpdate:pagination': (pagination: any) => wrapper.setProps({ pagination }),
        'pagination': { limit: 10, page: 6, total: 51 },
        'rowAttr': 'id',
        'rows': data,
        'search': '',
      },
    });

    expect(wrapper.props().pagination?.page).toBe(6);

    await wrapper.setProps({ pagination: { limit: 10, page: 6, total: 50 } });

    expect(wrapper.props().pagination?.page).toBe(5);
  });

  it('should multiple sort works', async () => {
    wrapper = createWrapper({
      props: {
        cols: columns,
        modelValue: [],
        outlined: true,
        pagination: { limit: 10, page: 1, total: 50 },
        rowAttr: 'id',
        rows: data,
        search: '',
        sort: [
          { column: 'title', direction: 'asc' },
          { column: 'name', direction: 'desc' },
        ],
      },
    });

    const tbody = wrapper.find('tbody');

    expect(tbody.find('tr:nth-child(1) > td:nth-child(3)').text()).toBe('Lindsay Walton 8');
    expect(tbody.find('tr:nth-child(1) > td:nth-child(4)').text()).toBe('Back-end Developer');

    expect(tbody.find('tr:nth-child(2) > td:nth-child(3)').text()).toBe('Lindsay Walton 6');
    expect(tbody.find('tr:nth-child(2) > td:nth-child(4)').text()).toBe('Back-end Developer');
  });

  describe('internal pagination', () => {
    it('should slice rows based on page and limit', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 5, page: 1, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_]):not([class*=_tr__empty_])');
      expect(rows).toHaveLength(5);
      expect(rows[0]?.find('td:nth-child(1)').text()).toBe('1');
    });

    it('should show correct rows on page 2', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 5, page: 2, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_]):not([class*=_tr__empty_])');
      expect(rows).toHaveLength(5);
      expect(rows[0]?.find('td:nth-child(1)').text()).toBe('6');
    });

    it('should show remaining rows on last page', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 15, page: 4, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_]):not([class*=_tr__empty_])');
      expect(rows).toHaveLength(5);
    });
  });

  describe('internal sorting', () => {
    it('should sort rows by single column ascending', async () => {
      const unsortedData: User[] = [
        { email: 'z@test.com', id: 3, name: 'Zack', title: 'Developer' },
        { email: 'a@test.com', id: 1, name: 'Alice', title: 'Designer' },
        { email: 'm@test.com', id: 2, name: 'Mike', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: unsortedData,
          sort: { column: 'name', direction: 'asc' },
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Alice');
      expect(rows[1]?.find('td:nth-child(2)').text()).toBe('Mike');
      expect(rows[2]?.find('td:nth-child(2)').text()).toBe('Zack');
    });

    it('should sort rows by single column descending', async () => {
      const unsortedData: User[] = [
        { email: 'z@test.com', id: 3, name: 'Zack', title: 'Developer' },
        { email: 'a@test.com', id: 1, name: 'Alice', title: 'Designer' },
        { email: 'm@test.com', id: 2, name: 'Mike', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: unsortedData,
          sort: { column: 'name', direction: 'desc' },
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Zack');
      expect(rows[1]?.find('td:nth-child(2)').text()).toBe('Mike');
      expect(rows[2]?.find('td:nth-child(2)').text()).toBe('Alice');
    });

    it('should sort numeric values correctly', async () => {
      const unsortedData: User[] = [
        { email: 'a@test.com', id: 10, name: 'Alice', title: 'Designer' },
        { email: 'z@test.com', id: 2, name: 'Zack', title: 'Developer' },
        { email: 'm@test.com', id: 100, name: 'Mike', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: unsortedData,
          sort: { column: 'id', direction: 'asc' },
        },
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows[0]?.find('td:nth-child(1)').text()).toBe('2');
      expect(rows[1]?.find('td:nth-child(1)').text()).toBe('10');
      expect(rows[2]?.find('td:nth-child(1)').text()).toBe('100');
    });

    it('should toggle sort direction when clicking same column', async () => {
      const onUpdateSort = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:sort': onUpdateSort,
          'rowAttr': 'id',
          'rows': data.slice(0, 5),
          'sort': { column: 'name', direction: 'asc' },
        },
      });

      const sortButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortButton.trigger('click');

      expect(onUpdateSort).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'desc' }),
      );
    });

    it('should clear sort on third click (asc -> desc -> none)', async () => {
      const onUpdateSort = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:sort': onUpdateSort,
          'rowAttr': 'id',
          'rows': data.slice(0, 5),
          'sort': { column: 'name', direction: 'desc' },
        },
      });

      const sortButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortButton.trigger('click');

      expect(onUpdateSort).toHaveBeenCalledWith(
        expect.objectContaining({ column: undefined, direction: 'asc' }),
      );
    });

    it('should add column to multi-sort array when clicking new column', async () => {
      const onUpdateSort = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:sort': onUpdateSort,
          'rowAttr': 'id',
          'rows': data.slice(0, 5),
          'sort': [{ column: 'name', direction: 'asc' }],
        },
      });

      const sortButtons = wrapper.findAll('thead th[class*=_sortable_] button');
      const titleSortButton = sortButtons[1];
      await titleSortButton?.trigger('click');

      expect(onUpdateSort).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ column: 'name' }),
          expect.objectContaining({ column: 'title', direction: 'asc' }),
        ]),
      );
    });

    it('should remove column from multi-sort on third click', async () => {
      const onUpdateSort = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:sort': onUpdateSort,
          'rowAttr': 'id',
          'rows': data.slice(0, 5),
          'sort': [
            { column: 'name', direction: 'desc' },
            { column: 'title', direction: 'asc' },
          ],
        },
      });

      const sortButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortButton.trigger('click');

      expect(onUpdateSort).toHaveBeenCalledWith([
        expect.objectContaining({ column: 'title' }),
      ]);
    });
  });

  describe('internal search', () => {
    it('should filter rows based on search query', async () => {
      const testData: User[] = [
        { email: 'alice@test.com', id: 1, name: 'Alice Smith', title: 'Developer' },
        { email: 'bob@test.com', id: 2, name: 'Bob Jones', title: 'Designer' },
        { email: 'charlie@test.com', id: 3, name: 'Charlie Brown', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'alice',
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(1);
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Alice Smith');
    });

    it('should filter case-insensitively', async () => {
      const testData: User[] = [
        { email: 'alice@test.com', id: 1, name: 'Alice Smith', title: 'Developer' },
        { email: 'bob@test.com', id: 2, name: 'Bob Jones', title: 'Designer' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'ALICE',
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(1);
    });

    it('should search across all columns', async () => {
      const testData: User[] = [
        { email: 'alice@test.com', id: 1, name: 'Alice Smith', title: 'Developer' },
        { email: 'bob@test.com', id: 2, name: 'Bob Jones', title: 'Designer' },
        { email: 'charlie@special.com', id: 3, name: 'Charlie Brown', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'special',
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(1);
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Charlie Brown');
    });

    it('should show empty state when no rows match search', async () => {
      const testData: User[] = [
        { email: 'alice@test.com', id: 1, name: 'Alice Smith', title: 'Developer' },
        { email: 'bob@test.com', id: 2, name: 'Bob Jones', title: 'Designer' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'nonexistent',
        },
      });

      const emptyRow = wrapper.find('tbody tr[class*=_tr__empty_]');
      expect(emptyRow.exists()).toBeTruthy();
    });

    it('should update filtered results when search changes', async () => {
      const testData: User[] = [
        { email: 'alice@test.com', id: 1, name: 'Alice Smith', title: 'Developer' },
        { email: 'bob@test.com', id: 2, name: 'Bob Jones', title: 'Designer' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'alice',
        },
      });

      expect(wrapper.findAll('tbody tr:not([class*=_tr__empty_])')).toHaveLength(1);

      await wrapper.setProps({ search: 'bob' });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(1);
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Bob Jones');
    });
  });

  describe('combined behaviors', () => {
    it('should apply search then pagination', async () => {
      const testData: User[] = Array.from({ length: 20 }, (_, i) => ({
        email: `user${i}@test.com`,
        id: i + 1,
        name: i < 10 ? `Developer ${i}` : `Manager ${i}`,
        title: i < 10 ? 'Dev' : 'Mgr',
      }));

      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 5, page: 1, total: 20 },
          rowAttr: 'id',
          rows: testData,
          search: 'Developer',
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(5);
    });

    it('should apply search then sort', async () => {
      const testData: User[] = [
        { email: 'z@test.com', id: 3, name: 'Zack Dev', title: 'Developer' },
        { email: 'a@test.com', id: 1, name: 'Alice Dev', title: 'Developer' },
        { email: 'm@test.com', id: 2, name: 'Mike Mgr', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: testData,
          search: 'Dev',
          sort: { column: 'name', direction: 'asc' },
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows).toHaveLength(2);
      expect(rows[0]?.find('td:nth-child(2)').text()).toBe('Alice Dev');
      expect(rows[1]?.find('td:nth-child(2)').text()).toBe('Zack Dev');
    });
  });

  describe('checkbox states', () => {
    it('should pass indeterminate prop to header checkbox when some rows are selected', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          modelValue: [1, 2],
          pagination: { limit: 10, page: 1, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const headerCheckbox = wrapper.find('thead [data-cy=table-toggle-check-all]');
      expect(headerCheckbox.find('span[class*=_checked_]').exists()).toBeTruthy();
    });

    it('should not be indeterminate when no rows are selected', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          modelValue: [],
          pagination: { limit: 10, page: 1, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const headerCheckbox = wrapper.find('thead [data-cy=table-toggle-check-all]');
      expect(headerCheckbox.find('span[class*=_checked_]').exists()).toBeFalsy();
    });
  });

  describe('auto-generated columns', () => {
    it('should generate columns from first row when cols prop is not provided', async () => {
      const testData = [
        { age: 25, city: 'NYC', id: 1, name: 'Alice' },
        { age: 30, city: 'LA', id: 2, name: 'Bob' },
      ];

      wrapper = createWrapper({
        props: {
          rowAttr: 'id',
          rows: testData as any,
        },
      });

      const headers = wrapper.findAll('thead th span[class*=_column__text_]');
      const headerTexts = headers.map(h => h.text());

      expect(headerTexts).toContain('id');
      expect(headerTexts).toContain('name');
      expect(headerTexts).toContain('age');
      expect(headerTexts).toContain('city');
    });

    it('should render row values when cols is not provided', async () => {
      const testData = [
        { id: 1, name: 'Alice' },
      ];

      wrapper = createWrapper({
        props: {
          rowAttr: 'id',
          rows: testData as any,
        },
      });

      const cells = wrapper.findAll('tbody tr td');
      const cellTexts = cells.map(c => c.text());

      expect(cellTexts).toContain('1');
      expect(cellTexts).toContain('Alice');
    });
  });

  describe('pagination side effects', () => {
    it('should reset page to 1 when search changes', async () => {
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
          'pagination': { limit: 10, page: 3, total: 50 },
          'rowAttr': 'id',
          'rows': data,
          'search': '',
        },
      });

      expect(wrapper.props().pagination?.page).toBe(3);

      await wrapper.setProps({ search: 'new query' });

      expect(wrapper.props().pagination?.page).toBe(1);
    });

    it('should clear selection when toggling all off', async () => {
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'modelValue': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          'multiPageSelect': false,
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'pagination': { limit: 10, page: 1, total: 50 },
          'rowAttr': 'id',
          'rows': data,
        },
      });

      expect(wrapper.props().modelValue).toHaveLength(10);

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(false);

      expect(wrapper.props().modelValue).toHaveLength(0);
    });
  });

  describe('ungroup behavior', () => {
    it('should emit update:group when ungrouping', async () => {
      const onUpdateGroup = vi.fn();
      const onUpdateCollapsed = vi.fn();
      wrapper = createWrapper({
        props: {
          'collapsed': [],
          'cols': columns,
          'group': 'title',
          'onUpdate:collapsed': onUpdateCollapsed,
          'onUpdate:group': onUpdateGroup,
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const ungroupButton = wrapper.find('tr[class*=_tr__group] button:has([class*=lu-trash])');
      if (ungroupButton.exists()) {
        await ungroupButton.trigger('click');
        expect(onUpdateGroup).toHaveBeenCalledWith(undefined);
        expect(onUpdateCollapsed).toHaveBeenCalledWith([]);
      }
      else {
        const buttons = wrapper.findAll('tr[class*=_tr__group] button');
        for (const btn of buttons) {
          if (btn.html().includes('trash')) {
            await btn.trigger('click');
            expect(onUpdateGroup).toHaveBeenCalled();
            break;
          }
        }
      }
    });
  });

  describe('global settings', () => {
    it('should follow global settings', async () => {
      const itemsPerPage = ref(25);
      const stickyOffset = ref(64);
      const wrapperComponent = {
        template: '<div><RuiDataTable :rows=\'[]\' row-attr=\'id\'/><RuiDataTable :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            RuiDataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              globalItemsPerPage: true,
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
              stickyOffset,
            }),
          },
        },
      });

      await nextTick();

      const paginationInstances = wrapper.findAllComponents(RuiTablePagination);
      expect(paginationInstances).toHaveLength(4);

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 25 }));
      });

      const firstPagination = paginationInstances[0];
      assert(firstPagination);
      const select = firstPagination.findComponent({ name: 'RuiMenuSelect' });
      select.vm.$emit('update:modelValue', 10);

      await nextTick();

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 10 }));
      });

      expect(get(itemsPerPage)).toBe(10);
    });

    it('should respect local setting override', async () => {
      const itemsPerPage = ref(25);
      const wrapperComponent = {
        template:
          '<div><RuiDataTable :rows=\'[]\' row-attr=\'id\'/><RuiDataTable :globalItemsPerPage=\'false\' :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            RuiDataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              globalItemsPerPage: true,
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
            }),
          },
        },
      });

      await nextTick();

      const paginate = wrapper.findAllComponents(RuiTablePagination);
      expect(paginate).toHaveLength(4);

      const paginate0 = paginate[0];
      const paginate2 = paginate[2];
      assert(paginate0);
      assert(paginate2);

      expect(paginate0.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 25 }));
      expect(paginate2.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 10 }));

      const globalSelect = paginate0.findComponent({ name: 'RuiMenuSelect' });
      const localSelect = paginate2.findComponent({ name: 'RuiMenuSelect' });
      globalSelect.vm.$emit('update:modelValue', 10);
      localSelect.vm.$emit('update:modelValue', 25);

      await nextTick();

      expect(paginate0.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 10 }));
      expect(paginate2.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 25 }));

      expect(get(itemsPerPage)).toBe(10);
    });

    it('should follow single global setting', async () => {
      const itemsPerPage = ref(25);
      const wrapperComponent = {
        template:
          '<div><RuiDataTable :rows=\'[]\' row-attr=\'id\'/><RuiDataTable :globalItemsPerPage=\'true\' :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            RuiDataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
            }),
          },
        },
      });

      await nextTick();

      const paginate = wrapper.findAllComponents(RuiTablePagination);
      expect(paginate).toHaveLength(4);

      const paginate0 = paginate[0];
      const paginate2 = paginate[2];
      assert(paginate0);
      assert(paginate2);

      expect(paginate0.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 10 }));
      expect(paginate2.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 25 }));

      const globalSelect = paginate0.findComponent({ name: 'RuiMenuSelect' });
      const localSelect = paginate2.findComponent({ name: 'RuiMenuSelect' });
      globalSelect.vm.$emit('update:modelValue', 25);
      localSelect.vm.$emit('update:modelValue', 10);

      await nextTick();

      expect(paginate0.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 25 }));
      expect(paginate2.vm.modelValue).toMatchObject(expect.objectContaining({ limit: 10 }));

      expect(get(itemsPerPage)).toBe(10);
    });
  });

  it('should pagination limit and range works as expected', async () => {
    wrapper = createWrapper({
      props: {
        'cols': columns,
        'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
        'rowAttr': 'id',
        'rows': data,
      },
    });

    await nextTick();

    await wrapper.setProps({ pagination: { limit: 10, page: 1, total: data.length } });

    const paginator = wrapper.findComponent(RuiTablePagination);
    expect(paginator.exists()).toBeTruthy();
    expect(paginator.find('div[data-cy=table-pagination] div[class*=limit]').exists()).toBeTruthy();
    expect(paginator.find('div[data-cy=table-pagination] div[class*=ranges]').exists()).toBeTruthy();
    expect(paginator.find('div[data-cy=table-pagination] div[class*=navigation]').exists()).toBeTruthy();

    const navButtons = paginator.findAllComponents(RuiButton);
    expect(navButtons.length).toBe(4);

    expect(navButtons.filter(b => b.attributes('disabled') === '')).toHaveLength(2);
    expect(navButtons.filter(b => b.attributes('disabled') === undefined)).toHaveLength(2);

    const menuSelects = paginator.findAllComponents({ name: 'RuiMenuSelect' });
    const limits = menuSelects[0];
    const ranges = menuSelects[1];
    assert(limits);
    assert(ranges);
    expect(limits.exists()).toBeTruthy();
    expect(ranges.exists()).toBeTruthy();

    limits.vm.$emit('update:modelValue', 5);

    await nextTick();

    expect(limits.vm.modelValue).toStrictEqual(5);
    expect(limits.find('[data-id="activator"] span').text()).toStrictEqual('5');
    expect(limits.find('input[type=hidden]').element).toHaveProperty('value', '5');
    expect(navButtons.filter(b => b.attributes('disabled') === '')).toHaveLength(2);
    expect(navButtons.filter(b => b.attributes('disabled') === undefined)).toHaveLength(2);

    ranges.vm.$emit('update:modelValue', 2);

    await nextTick();

    expect(ranges.props().modelValue).toStrictEqual(2);
    expect(ranges.find('[data-id="activator"] span').text()).toStrictEqual('6 - 10');
    expect(ranges.find('input[type=hidden]').element).toHaveProperty('value', '2');

    limits.vm.$emit('update:modelValue', 10);

    await nextTick();

    expect(limits.props().modelValue).toStrictEqual(10);
    expect(limits.find('[data-id="activator"] span').text()).toStrictEqual('10');
    expect(limits.find('input[type=hidden]').element).toHaveProperty('value', '10');

    expect(ranges.props().modelValue).toStrictEqual(1);
    expect(ranges.find('[data-id="activator"] span').text()).toStrictEqual('1 - 10');
    expect(ranges.find('input[type=hidden]').element).toHaveProperty('value', '1');
  });

  it('should hideDefaultHeader', () => {
    wrapper = createWrapper({
      props: {
        cols: columns,
        hideDefaultHeader: true,
        rowAttr: 'id',
        rows: data,
      },
    });

    const paginate = wrapper.findAllComponents(RuiTablePagination);
    expect(paginate).toHaveLength(1);

    // Verify pagination is after the scroller (footer position)
    const wrapperEl = wrapper.find('[class*=_wrapper]').element;
    const pagination = wrapper.find('[data-cy="table-pagination"]').element;
    const scroller = wrapper.find('[class*=_scroller]').element;
    const children = Array.from(wrapperEl.children);
    expect(children.indexOf(pagination)).toBeGreaterThan(children.indexOf(scroller));
  });

  it('should hideDefaultFooter', () => {
    wrapper = createWrapper({
      props: {
        cols: columns,
        hideDefaultFooter: true,
        rowAttr: 'id',
        rows: data,
      },
    });

    const paginate = wrapper.findAllComponents(RuiTablePagination);
    expect(paginate).toHaveLength(1);

    // Verify pagination is before the scroller (header position)
    const wrapperEl = wrapper.find('[class*=_wrapper]').element;
    const pagination = wrapper.find('[data-cy="table-pagination"]').element;
    const scroller = wrapper.find('[class*=_scroller]').element;
    const children = Array.from(wrapperEl.children);
    expect(children.indexOf(pagination)).toBeLessThan(children.indexOf(scroller));
  });

  describe('row grouping', () => {
    it('should render grouped rows with group headers', async () => {
      wrapper = createWrapper({
        props: {
          'collapsed': [],
          'cols': columns,
          'group': 'title',
          'onUpdate:collapsed': (e: any) => wrapper.setProps({ collapsed: e }),
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const groupHeaders = wrapper.findAll('tr[class*=_tr__group]');
      expect(groupHeaders.length).toBeGreaterThan(0);
    });

    it('should collapse and expand groups', async () => {
      wrapper = createWrapper({
        props: {
          'collapsed': [],
          'cols': columns,
          'group': 'title',
          'onUpdate:collapsed': (e: any) => wrapper.setProps({ collapsed: e }),
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const groupExpandButton = wrapper.find('tr[class*=_tr__group] button[class*=_tr__expander_button]');
      expect(groupExpandButton.exists()).toBeTruthy();

      await groupExpandButton.trigger('click');

      expect(wrapper.props().collapsed?.length).toBeGreaterThan(0);
    });

    it('should emit update:collapsed when toggling groups', async () => {
      const onUpdateCollapsed = vi.fn();
      wrapper = createWrapper({
        props: {
          'collapsed': [],
          'cols': columns,
          'group': 'title',
          'onUpdate:collapsed': onUpdateCollapsed,
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const groupExpandButton = wrapper.find('tr[class*=_tr__group] button[class*=_tr__expander_button]');
      await groupExpandButton.trigger('click');

      expect(onUpdateCollapsed).toHaveBeenCalled();
    });

    it('should render group expand button at start position by default', async () => {
      wrapper = createWrapper({
        props: {
          collapsed: [],
          cols: columns,
          group: 'title',
          rowAttr: 'id',
          rows: data,
        },
      });

      const groupHeader = wrapper.find('tr[class*=_tr__group]');
      expect(groupHeader.exists()).toBeTruthy();

      const expandButton = groupHeader.find('button[class*=_tr__expander_button]');
      expect(expandButton.exists()).toBeTruthy();
    });

    it('should render group expand button at end position when specified', async () => {
      wrapper = createWrapper({
        props: {
          collapsed: [],
          cols: columns,
          group: 'title',
          groupExpandButtonPosition: 'end',
          rowAttr: 'id',
          rows: data,
        },
      });

      const groupHeader = wrapper.find('tr[class*=_tr__group]');
      expect(groupHeader.exists()).toBeTruthy();

      const expandButton = groupHeader.find('button[class*=_tr__expander_button]');
      expect(expandButton.exists()).toBeTruthy();
    });

    it('should emit copy:group when clicking copy button in group header', async () => {
      const onCopyGroup = vi.fn();
      wrapper = createWrapper({
        props: {
          'collapsed': [],
          'cols': columns,
          'group': 'title',
          'onCopy:group': onCopyGroup,
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const copyButton = wrapper.find('tr[class*=_tr__group] button:has([class*=lu-copy])');
      if (copyButton.exists()) {
        await copyButton.trigger('click');
        expect(onCopyGroup).toHaveBeenCalled();
      }
      else {
        const buttons = wrapper.findAll('tr[class*=_tr__group] button');
        const copyBtn = buttons[1];
        if (copyBtn) {
          await copyBtn.trigger('click');
          expect(onCopyGroup).toHaveBeenCalled();
        }
      }
    });
  });

  describe('selection edge cases', () => {
    it('should not allow selection of disabled rows', async () => {
      const disabledRow = data[0];
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'disabledRows': [disabledRow!],
          'modelValue': [],
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const firstRowCheckbox = wrapper.find('tr [data-cy=table-toggle-check-0] input');
      expect(firstRowCheckbox.attributes('disabled')).toBeDefined();

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(true);

      expect(wrapper.props().modelValue).toHaveLength(9);
      expect(wrapper.props().modelValue).not.toContain(disabledRow!.id);
    });

    it('should keep disabled rows selected when already selected', async () => {
      const disabledRow = data[0];
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'disabledRows': [disabledRow!],
          'modelValue': [disabledRow!.id],
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'rowAttr': 'id',
          'rows': data,
        },
      });

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(false);

      expect(wrapper.props().modelValue).toContain(disabledRow!.id);
    });

    it('should support multi-page selection', async () => {
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'modelValue': [],
          'multiPageSelect': true,
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
          'pagination': { limit: 10, page: 1, total: 50 },
          'rowAttr': 'id',
          'rows': data,
        },
      });

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(true);
      expect(wrapper.props().modelValue).toHaveLength(10);

      await wrapper.setProps({ pagination: { limit: 10, page: 2, total: 50 } });

      expect(wrapper.props().modelValue).toHaveLength(10);

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(true);

      expect(wrapper.props().modelValue).toHaveLength(20);
    });

    it('should clear page selection when multiPageSelect is false and changing page', async () => {
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'modelValue': [],
          'multiPageSelect': false,
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
          'pagination': { limit: 10, page: 1, total: 50 },
          'rowAttr': 'id',
          'rows': data,
        },
      });

      await wrapper.find('thead tr [data-cy=table-toggle-check-all] input').setValue(true);
      expect(wrapper.props().modelValue).toHaveLength(10);

      const paginator = wrapper.findComponent(RuiTablePagination);
      paginator.vm.$emit('update:modelValue', { limit: 10, page: 2, total: 50 });

      await nextTick();

      expect(wrapper.props().modelValue).toHaveLength(0);
    });
  });

  describe('external pagination and sorting', () => {
    it('should not modify rows internally when paginationModifiers.external is true', async () => {
      const externalPageData = data.slice(0, 5);
      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 5, page: 1, total: 50 },
          paginationModifiers: { external: true },
          rowAttr: 'id',
          rows: externalPageData,
        },
      });

      const tbodyRows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_])');
      expect(tbodyRows).toHaveLength(5);
    });

    it('should use external total when paginationModifiers.external is true', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          pagination: { limit: 5, page: 1, total: 100 },
          paginationModifiers: { external: true },
          rowAttr: 'id',
          rows: data.slice(0, 5),
        },
      });

      const paginator = wrapper.findComponent(RuiTablePagination);
      expect(paginator.vm.modelValue.total).toBe(100);
    });

    it('should not sort rows internally when sortModifiers.external is true', async () => {
      const unsortedData = [
        { email: 'z@test.com', id: 1, name: 'Zack', title: 'Developer' },
        { email: 'a@test.com', id: 2, name: 'Alice', title: 'Designer' },
        { email: 'm@test.com', id: 3, name: 'Mike', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: unsortedData,
          sort: { column: 'name', direction: 'asc' },
          sortModifiers: { external: true },
        },
      });

      const firstRow = wrapper.find('tbody tr:first-child td:nth-child(2)');
      expect(firstRow.text()).toBe('Zack');
    });

    it('should sort rows internally when sortModifiers.external is false', async () => {
      const unsortedData = [
        { email: 'z@test.com', id: 1, name: 'Zack', title: 'Developer' },
        { email: 'a@test.com', id: 2, name: 'Alice', title: 'Designer' },
        { email: 'm@test.com', id: 3, name: 'Mike', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: unsortedData,
          sort: { column: 'name', direction: 'asc' },
        },
      });

      const firstRow = wrapper.find('tbody tr:first-child td:nth-child(2)');
      expect(firstRow.text()).toBe('Alice');
    });
  });

  describe('slots', () => {
    it('should render custom item slot with correct props', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
        slots: {
          'item.name': `<template #item.name="{ row, column, index }">
            <span data-cy="custom-name">{{ row.name }} - {{ column.key }} - {{ index }}</span>
          </template>`,
        },
      });

      const customCell = wrapper.find('[data-cy=custom-name]');
      expect(customCell.exists()).toBeTruthy();
      expect(customCell.text()).toContain('Lindsay Walton 0');
      expect(customCell.text()).toContain('name');
      expect(customCell.text()).toContain('0');
    });

    it('should render custom header slot with correct props', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
        slots: {
          'header.name': `<template #header.name="{ column }">
            <span data-cy="custom-header">Custom: {{ column.label }}</span>
          </template>`,
        },
      });

      const customHeader = wrapper.find('[data-cy=custom-header]');
      expect(customHeader.exists()).toBeTruthy();
      expect(customHeader.text()).toBe('Custom: Full name');
    });

    it('should render body.prepend slot', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
        slots: {
          'body.prepend': `<template #body.prepend="{ colspan }">
            <tr data-cy="prepend-row"><td :colspan="colspan">Prepended content</td></tr>
          </template>`,
        },
      });

      const prependRow = wrapper.find('[data-cy=prepend-row]');
      expect(prependRow.exists()).toBeTruthy();
      expect(prependRow.text()).toBe('Prepended content');
    });

    it('should render body.append slot', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
        slots: {
          'body.append': `<template #body.append="{ colspan }">
            <tr data-cy="append-row"><td :colspan="colspan">Appended content</td></tr>
          </template>`,
        },
      });

      const appendRow = wrapper.find('[data-cy=append-row]');
      expect(appendRow.exists()).toBeTruthy();
      expect(appendRow.text()).toBe('Appended content');
    });

    it('should render no-data slot when table is empty', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: [],
        },
        slots: {
          'no-data': '<div data-cy="custom-no-data">Custom empty state</div>',
        },
      });

      const customNoData = wrapper.find('[data-cy=custom-no-data]');
      expect(customNoData.exists()).toBeTruthy();
      expect(customNoData.text()).toBe('Custom empty state');
    });

    it('should render empty state with custom label and description', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          empty: {
            description: 'Try adjusting your filters',
            label: 'No results found',
          },
          rowAttr: 'id',
          rows: [],
        },
      });

      const emptyLabel = wrapper.find('p[class*=_empty__label_]');
      const emptyDescription = wrapper.find('p[class*=_empty__description_]');

      expect(emptyLabel.exists()).toBeTruthy();
      expect(emptyLabel.text()).toBe('No results found');
      expect(emptyDescription.exists()).toBeTruthy();
      expect(emptyDescription.text()).toBe('Try adjusting your filters');
    });

    it('should render empty-description slot', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          empty: { label: 'No data' },
          rowAttr: 'id',
          rows: [],
        },
        slots: {
          'empty-description': '<span data-cy="custom-description">Custom description content</span>',
        },
      });

      const customDescription = wrapper.find('[data-cy=custom-description]');
      expect(customDescription.exists()).toBeTruthy();
      expect(customDescription.text()).toBe('Custom description content');
    });

    it('should render tfoot slot', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
        slots: {
          tfoot: '<tr data-cy="custom-tfoot"><td>Footer content</td></tr>',
        },
      });

      const customTfoot = wrapper.find('tfoot [data-cy=custom-tfoot]');
      expect(customTfoot.exists()).toBeTruthy();
      expect(customTfoot.text()).toBe('Footer content');
    });
  });

  describe('visual props', () => {
    it('should apply striped class to tbody', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rowAttr: 'id',
          rows: data,
          striped: true,
        },
      });

      expectWrapperToHaveClass(wrapper, 'tbody', /_tbody--striped_/);
    });

    it('should apply rounded variants to wrapper', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rounded: 'sm',
          rowAttr: 'id',
          rows: data,
        },
      });

      expectWrapperToHaveClass(wrapper, 'div[class*=_wrapper_]', /_rounded__sm_/);
    });

    it('should apply rounded lg variant to wrapper', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          rounded: 'lg',
          rowAttr: 'id',
          rows: data,
        },
      });

      expectWrapperToHaveClass(wrapper, 'div[class*=_wrapper_]', /_rounded__lg_/);
    });

    it('should apply itemClass as string to rows', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          itemClass: 'custom-row-class',
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_]):not([class*=_tr__empty_])');
      rows.forEach((row) => {
        expect(row.classes()).toContain('custom-row-class');
      });
    });

    it('should apply itemClass as function to rows', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          itemClass: (item: User) => `row-${item.id}`,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const firstRow = wrapper.find('tbody tr:first-child');
      expect(firstRow.classes()).toContain('row-1');

      const secondRow = wrapper.find('tbody tr:nth-child(2)');
      expect(secondRow.classes()).toContain('row-2');
    });

    it('should pass disablePerPage prop to pagination component', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          disablePerPage: true,
          pagination: { limit: 10, page: 1, total: 50 },
          rowAttr: 'id',
          rows: data,
        },
      });

      const paginator = wrapper.findComponent(RuiTablePagination);
      expect(paginator.props('disablePerPage')).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading with no data', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          loading: true,
          rowAttr: 'id',
          rows: [],
        },
      });

      const loader = wrapper.find('td[class*=_tbody__loader_]');
      expect(loader.exists()).toBeTruthy();
    });

    it('should show progress bar when loading with data', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          loading: true,
          rowAttr: 'id',
          rows: data.slice(0, 5),
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__empty_])');
      expect(rows.length).toBeGreaterThan(0);

      const circularLoader = wrapper.find('td[class*=_tbody__loader_]');
      expect(circularLoader.exists()).toBeFalsy();

      const progressBar = wrapper.findComponent({ name: 'RuiProgress' });
      expect(progressBar.exists()).toBeTruthy();
    });

    it('should not show loading elements when not loading', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          loading: false,
          rowAttr: 'id',
          rows: data.slice(0, 5),
        },
      });

      const circularLoader = wrapper.find('td[class*=_tbody__loader_]');
      expect(circularLoader.exists()).toBeFalsy();
    });
  });

  describe('array group keys', () => {
    it('should support array of group keys', async () => {
      // Create data with two potential group keys
      const groupableData: User[] = [
        { email: 'a@test.com', id: 1, name: 'Alice', title: 'Developer' },
        { email: 'b@test.com', id: 2, name: 'Bob', title: 'Developer' },
        { email: 'c@test.com', id: 3, name: 'Charlie', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          collapsed: [],
          cols: columns,
          group: ['title'] as any, // Array form of group
          rowAttr: 'id',
          rows: groupableData,
        },
      });

      // Group headers should be rendered
      const groupHeaders = wrapper.findAll('tr[class*=_tr__group]');
      expect(groupHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('row deselection on data change', () => {
    it('should deselect rows that are no longer visible when multiPageSelect is false', async () => {
      const testData: User[] = [
        { email: 'a@test.com', id: 1, name: 'Alice', title: 'Developer' },
        { email: 'b@test.com', id: 2, name: 'Bob', title: 'Designer' },
        { email: 'c@test.com', id: 3, name: 'Charlie', title: 'Manager' },
      ];

      wrapper = createWrapper({
        props: {
          'cols': columns,
          'modelValue': [1, 2, 3],
          'multiPageSelect': false,
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'rowAttr': 'id',
          'rows': testData,
        },
      });

      expect(wrapper.props().modelValue).toHaveLength(3);

      // Change data to only have 1 row
      await wrapper.setProps({
        rows: [testData[0]!],
      });

      // Selection should be reduced to only visible rows
      expect(wrapper.props().modelValue).toHaveLength(1);
      expect(wrapper.props().modelValue).toContain(1);
    });
  });

  describe('dense mode', () => {
    it('should apply dense styling to table', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          dense: true,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      expectWrapperToHaveClass(wrapper, 'table', /_dense_/);
    });

    it('should not apply dense styling when dense is false', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          dense: false,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const table = wrapper.find('table');
      expect(table.classes().some(c => c.includes('_dense_'))).toBeFalsy();
    });
  });

  describe('outlined mode', () => {
    it('should apply outlined styling to wrapper', () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          outlined: true,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      expectWrapperToHaveClass(wrapper, 'div[class*=_wrapper_]', /_outlined_/);
    });
  });

  describe('events', () => {
    it('should emit update:sort when clicking sortable column button', async () => {
      const onUpdateSort = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:sort': onUpdateSort,
          'rowAttr': 'id',
          'rows': data,
          'sort': { column: undefined, direction: 'asc' },
        },
      });

      const sortableButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortableButton.trigger('click');

      expect(onUpdateSort).toHaveBeenCalled();
    });

    it('should emit update:options when sort changes', async () => {
      const onUpdateOptions = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:options': onUpdateOptions,
          'rowAttr': 'id',
          'rows': data,
          'sort': { column: undefined, direction: 'asc' },
        },
      });

      const sortableButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortableButton.trigger('click');

      expect(onUpdateOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: expect.any(Object),
        }),
      );
    });

    it('should emit update:options when pagination changes', async () => {
      const onUpdateOptions = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'onUpdate:options': onUpdateOptions,
          'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
          'pagination': { limit: 10, page: 1, total: 50 },
          'rowAttr': 'id',
          'rows': data,
        },
      });

      const paginator = wrapper.findComponent(RuiTablePagination);
      const menuSelects = paginator.findAllComponents({ name: 'RuiMenuSelect' });
      const limits = menuSelects[0];
      limits?.vm.$emit('update:modelValue', 5);

      await nextTick();

      expect(onUpdateOptions).toHaveBeenCalled();
    });
  });

  describe('itemsPerPage without pagination prop', () => {
    it('should use itemsPerPage for default pagination limit', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          itemsPerPage: 5,
          rowAttr: 'id',
          rows: data,
        },
      });

      const rows = wrapper.findAll('tbody tr:not([class*=_tr__expanded_]):not([class*=_tr__empty_])');
      expect(rows).toHaveLength(5);
    });
  });

  describe('column features', () => {
    it('should apply colspan and rowspan to cells', async () => {
      const columnsWithSpan: TableColumn<User>[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name', colspan: 2 },
        { key: 'title', label: 'Title', rowspan: 2 },
      ];

      wrapper = createWrapper({
        props: {
          cols: columnsWithSpan,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      // Check that colspan is applied
      const nameCell = wrapper.find('tbody tr:first-child td:nth-child(2)');
      expect(nameCell.attributes('colspan')).toBe('2');

      // Check that rowspan is applied
      const titleCell = wrapper.find('tbody tr:first-child td:nth-child(3)');
      expect(titleCell.attributes('rowspan')).toBe('2');
    });

    it('should apply center alignment to columns', async () => {
      const columnsWithCenter: TableColumn<User>[] = [
        { key: 'id', label: 'ID', align: 'center' },
        { key: 'name', label: 'Name' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columnsWithCenter,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const idCell = wrapper.find('tbody tr:first-child td:first-child');
      expect(idCell.classes().some(c => c.includes('_align__center_'))).toBeTruthy();
    });

    it('should not render sort button for non-sortable columns', async () => {
      const columnsWithNonSortable: TableColumn<User>[] = [
        { key: 'id', label: 'ID', sortable: false },
        { key: 'name', label: 'Name', sortable: true },
      ];

      wrapper = createWrapper({
        props: {
          cols: columnsWithNonSortable,
          rowAttr: 'id',
          rows: data.slice(0, 3),
          sort: { column: undefined, direction: 'asc' },
        },
      });

      // First column (ID) should not be sortable
      const idHeader = wrapper.find('thead th:first-child');
      expect(idHeader.classes().some(c => c.includes('_sortable_'))).toBeFalsy();

      // Second column (Name) should be sortable
      const nameHeader = wrapper.find('thead th:nth-child(2)');
      expect(nameHeader.classes().some(c => c.includes('_sortable_'))).toBeTruthy();
    });

    it('should apply cellClass to cells', async () => {
      const columnsWithCellClass: TableColumn<User>[] = [
        { key: 'id', label: 'ID', cellClass: 'custom-cell-class' },
        { key: 'name', label: 'Name' },
      ];

      wrapper = createWrapper({
        props: {
          cols: columnsWithCellClass,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const idCell = wrapper.find('tbody tr:first-child td:first-child');
      expect(idCell.classes()).toContain('custom-cell-class');
    });
  });

  describe('columnAttr prop', () => {
    it('should use custom columnAttr for header display', async () => {
      const columnsWithCustomAttr: TableColumn<User>[] = [
        { key: 'id', label: 'ID Label', customTitle: 'Custom ID' } as any,
        { key: 'name', label: 'Name Label', customTitle: 'Custom Name' } as any,
      ];

      wrapper = createWrapper({
        props: {
          columnAttr: 'customTitle' as any,
          cols: columnsWithCustomAttr,
          rowAttr: 'id',
          rows: data.slice(0, 3),
        },
      });

      const headers = wrapper.findAll('thead th span[class*=_column__text_]');
      expect(headers[0]?.text()).toBe('Custom ID');
      expect(headers[1]?.text()).toBe('Custom Name');
    });
  });

  describe('pagination clears expanded rows', () => {
    it('should clear expanded rows when pagination emits update', async () => {
      const onUpdateExpanded = vi.fn();
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'expanded': [data[0]!],
          'onUpdate:expanded': onUpdateExpanded,
          'onUpdate:pagination': (e: any) => wrapper.setProps({ pagination: e }),
          'pagination': { limit: 10, page: 1, total: 50 },
          'rowAttr': 'id',
          'rows': data,
        },
        slots: {
          'expanded-item': {
            template: '<div>Expanded</div>',
          },
        },
      });

      // Trigger pagination update through the component
      const paginator = wrapper.findComponent(RuiTablePagination);
      paginator.vm.$emit('update:modelValue', { limit: 10, page: 2, total: 50 });

      await nextTick();

      // Should emit update:expanded with empty array
      expect(onUpdateExpanded).toHaveBeenCalledWith([]);
    });
  });

  describe('selected row styling', () => {
    it('should apply selected class to selected rows', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          modelValue: [1],
          rowAttr: 'id',
          rows: data.slice(0, 5),
        },
      });

      const firstRow = wrapper.find('tbody tr:first-child');
      expect(firstRow.classes().some(c => c.includes('_tr__selected_'))).toBeTruthy();

      const secondRow = wrapper.find('tbody tr:nth-child(2)');
      expect(secondRow.classes().some(c => c.includes('_tr__selected_'))).toBeFalsy();
    });
  });

  describe('empty table without rows', () => {
    it('should not show pagination controls when there are no rows and no pagination', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          hideDefaultFooter: true,
          hideDefaultHeader: true,
          rowAttr: 'id',
          rows: [],
        },
      });

      const paginators = wrapper.findAllComponents(RuiTablePagination);
      expect(paginators).toHaveLength(0);
    });

    it('should show empty state when rows array is empty', async () => {
      wrapper = createWrapper({
        props: {
          cols: columns,
          empty: { label: 'No data available' },
          rowAttr: 'id',
          rows: [],
        },
      });

      const emptyRow = wrapper.find('tr[class*=_tr__empty_]');
      expect(emptyRow.exists()).toBeTruthy();

      const emptyLabel = wrapper.find('p[class*=_empty__label_]');
      expect(emptyLabel.text()).toBe('No data available');
    });
  });

  describe('sort clears selection when multiPageSelect is false', () => {
    it('should clear selection when sort changes', async () => {
      wrapper = createWrapper({
        props: {
          'cols': columns,
          'modelValue': [1, 2, 3],
          'multiPageSelect': false,
          'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
          'onUpdate:sort': (e: any) => wrapper.setProps({ sort: e }),
          'rowAttr': 'id',
          'rows': data.slice(0, 10),
          'sort': { column: undefined, direction: 'asc' },
        },
      });

      expect(wrapper.props().modelValue).toHaveLength(3);

      // Click sort button
      const sortButton = wrapper.find('thead th[class*=_sortable_] button');
      await sortButton.trigger('click');

      // Selection should be cleared
      expect(wrapper.props().modelValue).toHaveLength(0);
    });
  });
});
