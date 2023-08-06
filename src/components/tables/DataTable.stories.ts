import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import DataTable, { type Props, type TableColumn } from './DataTable.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = (args) => ({
  components: { DataTable, Button, Icon },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });
    const pagination = computed({
      get() {
        return args.pagination;
      },
      set(val) {
        args.pagination = val;
      },
    });
    const sort = computed({
      get() {
        return args.sort;
      },
      set(val) {
        args.sort = val;
      },
    });

    return { args, modelValue, pagination, sort };
  },
  template: `<div class="flex flex-col space-y-4">
  <span v-if="modelValue">selected: {{ modelValue.length }}</span>
  <DataTable v-bind="args" v-model="modelValue" v-model:pagination="pagination" v-model:sort="sort">
    <template #action-data>
    <Button icon variant="text" size="sm"><Icon name="more-fill" color="primary" /></Button>
    </template>
  </DataTable>
  </div>`,
});

const data = [
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    date: '10.09.2023',
    'created at': '10.09.2023',
    'updated at': '10.09.2023',
    'deleted at': '10.09.2023',
  },
  {
    id: 2,
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin',
    date: '10.09.2023',
    'created at': '10.09.2023',
    'updated at': '10.09.2023',
    'deleted at': '10.09.2023',
  },
  {
    id: 3,
    name: 'Tom Cook',
    title: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member',
    date: '10.09.2023',
    'created at': '10.09.2023',
    'updated at': '10.09.2023',
    'deleted at': '10.09.2023',
  },
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
    key: 'role',
    sortable: true,
  },
  {
    key: 'action',
  },
];

const meta: Meta<Props> = {
  title: 'Components/Tables/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  render,
  argTypes: {},
  args: {
    modelValue: undefined,
    rowAttr: 'id',
    rows: [],
    columnAttr: 'label',
    loading: false,
    dense: false,
    outlined: false,
  },
  parameters: {
    docs: {
      controls: {
        exclude: [
          'default',
          'update:modelValue',
          'update:pagination',
          'update:sort',
          'tfoot',
          '`${column.key}-header`',
          '`${column.key}-data`',
        ],
      },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    rows: data,
    cols: columns,
    sort: [{ column: 'name', direction: 'asc' }],
    pagination: { limit: 15, page: 1, total: 150 },
  },
};

export const Dense: Story = {
  args: {
    rows: data,
    dense: true,
  },
};

export const Loading: Story = {
  args: {
    rows: data,
    loading: true,
  },
};

export const WithColumnDefinitions: Story = {
  args: {
    rows: data,
    cols: columns,
  },
};

export const Selectable: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
  },
};

export const SelectableAndDense: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    dense: true,
  },
};

export const WithPagination: Story = {
  args: {
    rows: data,
    modelValue: [],
    pagination: { limit: 15, page: 1, total: 150 },
  },
};

export const ColumnsWithPagination: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    pagination: { limit: 15, page: 1, total: 150 },
  },
};

export const Outlined: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    outlined: true,
    pagination: { limit: 15, page: 1, total: 150 },
  },
};

export const SingleSort: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    pagination: { limit: 15, page: 1, total: 150 },
    sort: { column: 'name', direction: 'asc' },
  },
};

export const MultipleSort: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    pagination: { limit: 15, page: 1, total: 150 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export default meta;
