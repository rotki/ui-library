import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiDataTable from '@/components/tables/RuiDataTable.vue';
import RuiTablePagination from '@/components/tables/RuiTablePagination.vue';
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

    // Initial state: page 6 with total 51 is valid (shows 1 item on page 6)
    expect(wrapper.props().pagination?.page).toBe(6);

    // Update total to 50, which makes page 6 invalid (max pages would be 5)
    await wrapper.setProps({ pagination: { limit: 10, page: 6, total: 50 } });

    // Page should automatically adjust to 5 (last valid page)
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

    expect(wrapper.find('div > [data-cy="table-pagination"]:last-child').exists()).toBeTruthy();
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

    expect(wrapper.find('div > [data-cy="table-pagination"]:first-child').exists()).toBeTruthy();
  });
});
