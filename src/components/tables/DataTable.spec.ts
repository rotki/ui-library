import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { RuiButton, RuiDataTable, RuiTablePagination } from '~/src';
import type { TableColumn } from '@/components/tables/TableHead.vue';

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
}

function createWrapper(options?: ComponentMountingOptions<typeof RuiDataTable<User>>) {
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

describe('dataTable', () => {
  const data: User[] = [
    ...[...new Array(50)].map((_, index) => ({
      email: `lindsay.walton${index}@example.com`,
      id: index + 1,
      name: `Lindsay Walton ${index}`,
      title: index % 2 === 0 ? 'Back-end Developer' : 'Front-end Developer',
    })),
  ];

  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      align: 'end',
      key: 'name',
      label: 'Full name',
      sortable: true,
    },
    {
      align: 'start',
      key: 'title',
      label: 'Job position',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email address',
      sortable: true,
    },
    {
      key: 'action',
    },
  ];

  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        cols: columns,
        rowAttr: 'id',
        rows: data,
      },
    });

    expect(wrapper.get('table').classes()).toMatch(/_table_/);
    expect(wrapper.find('table thead').exists()).toBeTruthy();
    expect(wrapper.find('table tbody').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
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
    expect(
      wrapper.find('table thead th[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__start_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__start_]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_navigation_]').exists()).toBeTruthy();
    expect(
      wrapper.find('div div[class*=_navigation_] button[disabled]').exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('div[data-cy=table-pagination] div[class*=limit]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('div[data-cy=table-pagination] div[class*=ranges]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('div[data-cy=table-pagination] div[class*=navigation]')
        .exists(),
    ).toBeTruthy();
  });

  it('multiple expand toggles correctly', async () => {
    const wrapper = createWrapper({
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

    expect(
      wrapper
        .find('tbody tr[hidden]:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(3) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(2);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(4) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();
  });

  it('selection toggles correctly', async () => {
    const wrapper = createWrapper({
      props: {
        'cols': columns,
        'modelValue': [],
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
        'rowAttr': 'id',
        'rows': data,
      },
    });

    expect(wrapper.props().modelValue).toHaveLength(0);

    expect(
      wrapper
        .find('thead tr [data-cy=table-toggle-check-all] input')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('thead tr [data-cy=table-toggle-check-all] input')
      .setValue(true);

    expect(wrapper.props().modelValue).toHaveLength(10);

    expect(
      wrapper
        .find('tr [data-cy*=table-toggle-check-] span[class*=checkbox][class*=checked]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .findAll('tr [data-cy*=table-toggle-check-] span[class*=checkbox][class*=checked]'),
    ).toHaveLength(11);

    await wrapper
      .find('thead tr [data-cy=table-toggle-check-all] input')
      .setValue(false);

    expect(wrapper.props().modelValue).toHaveLength(0);

    await wrapper.find('tr [data-cy=table-toggle-check-0] input').setValue(true);

    expect(wrapper.props().modelValue).toHaveLength(1);
  });

  it('single expand toggles correctly', async () => {
    const wrapper = createWrapper({
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

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(0);

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(3) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeFalsy();

    expect(
      wrapper
        .find('tbody tr:nth-child(4) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();
  });

  it('sticky header behaves as expected', async () => {
    const wrapper = createWrapper({
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

  describe('global settings', () => {
    it('should follow global settings', async () => {
      const itemsPerPage = ref(25);
      const stickyOffset = ref(64);
      const wrapperComponent = {
        template:
          '<div><RuiDataTable :rows=\'[]\' row-attr=\'id\'/><RuiDataTable :rows=\'[]\' row-attr=\'id\'/></div>',
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
      expect(paginationInstances).toHaveLength(2);

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(
          expect.objectContaining({ limit: 25 }),
        );
      });

      const select = paginationInstances[0].findComponent({ name: 'RuiMenuSelect' });
      select.vm.$emit('update:model-value', { limit: 10 });

      await nextTick();

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(
          expect.objectContaining({ limit: 10 }),
        );
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
      expect(paginate).toHaveLength(2);

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );
      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      const globalSelect = paginate[0].findComponent({ name: 'RuiMenuSelect' });
      const localSelect = paginate[1].findComponent({ name: 'RuiMenuSelect' });
      globalSelect.vm.$emit('update:model-value', { limit: 10 });
      localSelect.vm.$emit('update:model-value', { limit: 25 });

      await nextTick();

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

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
      expect(paginate).toHaveLength(2);

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

      const globalSelect = paginate[0].findComponent({ name: 'RuiMenuSelect' });
      const localSelect = paginate[1].findComponent({ name: 'RuiMenuSelect' });
      globalSelect.vm.$emit('update:model-value', { limit: 25 });
      localSelect.vm.$emit('update:model-value', { limit: 10 });

      await nextTick();

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(get(itemsPerPage)).toBe(10);
    });
  });

  it('pagination range works as expected', async () => {
    const wrapper = createWrapper({
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

    expect(
      paginator
        .find('div[data-cy=table-pagination] div[class*=limit]')
        .exists(),
    ).toBeTruthy();

    expect(
      paginator
        .find('div[data-cy=table-pagination] div[class*=ranges]')
        .exists(),
    ).toBeTruthy();

    expect(
      paginator
        .find('div[data-cy=table-pagination] div[class*=navigation]')
        .exists(),
    ).toBeTruthy();

    const navButtons = paginator.findAllComponents(RuiButton);
    expect(navButtons.length).toBe(4);

    expect(navButtons.filter(b => b.attributes('disabled') === '')).toHaveLength(2);
    expect(navButtons.filter(b => b.attributes('disabled') === undefined)).toHaveLength(2);

    const [limits, ranges] = paginator.findAllComponents({ name: 'RuiMenuSelect' });
    expect(limits.exists()).toBeTruthy();
    expect(ranges.exists()).toBeTruthy();

    limits.vm.$emit('update:model-value', { limit: 5 });

    await nextTick();

    expect(limits.vm.modelValue).toStrictEqual({ limit: 5 });

    ranges.vm.$emit('update:model-value', { page: '6-10' });

    await nextTick();

    expect(ranges.vm.modelValue).toStrictEqual({ page: '6-10' });

    expect(navButtons.filter(b => b.attributes('disabled') === '')).toHaveLength(0);
    expect(navButtons.filter(b => b.attributes('disabled') === undefined)).toHaveLength(4);
  });
});
