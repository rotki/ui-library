import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import DataTable, { type TableColumn } from '@/components/tables/DataTable.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof DataTable>) =>
  mount(DataTable, options);

describe('DataTable', () => {
  const data = [
    ...[...new Array(50)].map((_, index) => ({
      id: index + 1,
      name: `Lindsay Walton ${index}`,
      title: index % 2 === 0 ? 'Back-end Developer' : 'Front-end Developer',
      email: `lindsay.walton${index}@example.com`,
    })),
  ];

  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Full name',
      sortable: true,
      align: 'right',
    },
    {
      key: 'title',
      label: 'Job position',
      sortable: true,
      align: 'left',
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

  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        rows: data,
        rowAttr: 'id',
        cols: columns,
      },
    });

    expect(wrapper.get('table').classes()).toMatch(/_table_/);
    expect(wrapper.find('table thead').exists()).toBeTruthy();
    expect(wrapper.find('table tbody').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        rows: data,
        rowAttr: 'id',
        cols: columns,
        modelValue: [],
        dense: true,
        outlined: true,
        search: '',
        sort: [{ column: 'name', direction: 'asc' }],
        pagination: { limit: 10, page: 1, total: 50 },
      },
    });
    expect(
      wrapper.find('table thead th[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__left_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__left_]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_navigation_]').exists()).toBeTruthy();
    expect(
      wrapper.find('div div[class*=_navigation_] button[disabled]').exists(),
    ).toBeTruthy();
  });
});
