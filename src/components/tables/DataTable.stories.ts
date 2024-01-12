/* eslint-disable max-lines */
import { objectOmit } from '@vueuse/shared';
import Button from '@/components/buttons/button/Button.vue';
import TextField from '@/components/forms/text-field/TextField.vue';
import Icon from '@/components/icons/Icon.vue';
import Card from '@/components/cards/Card.vue';
import DataTable, { type Props as TableProps } from './DataTable.vue';
import { type TableColumn } from './TableHead.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type User = {
  id: number;
  name: string;
  title: string;
  email: string;
  role: string;
  date: string;
};

type Props = TableProps<User, 'id'>;

const render: StoryFn<Props> = (args) => ({
  components: { DataTable: DataTable<User>, Button, Icon, TextField, Card },
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
    const search = computed({
      get() {
        return args.search;
      },
      set(val) {
        args.search = val;
      },
    });
    const expanded = computed({
      get() {
        return args.expanded;
      },
      set(val) {
        args.expanded = val;
      },
    });
    const group = computed({
      get() {
        return args.group;
      },
      set(val) {
        args.group = val;
      },
    });
    const collapsed = computed({
      get() {
        return args.collapsed;
      },
      set(val) {
        args.collapsed = val;
      },
    });

    return {
      args,
      modelValue,
      pagination,
      search,
      sort,
      expanded,
      group,
      collapsed,
      objectOmit,
    };
  },
  template: `
      <div class="flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <TextField
              v-if="search !== undefined"
              v-model="search"
              placeholder="search"
              label="search"
              class="w-1/2 lg:w-2/5"
              variant="outlined"
              color="primary"
              hide-details
          />
          <span v-if="modelValue">selected: {{ modelValue.length }}</span>
        </div>
        <DataTable
            v-bind="
                objectOmit(args, [
                  'modelValue',
                  'pagination',
                  'sort',
                  'expanded',
                  'group',
                  'collapsed',
                ])
            "
            v-model="modelValue"
            v-model:pagination="pagination"
            v-model:sort="sort"
            :search="search"
            v-model:expanded="args.expanded"
            v-model:group="args.group"
            v-model:collapsed="args.collapsed"
            :row-attr="args.rowAttr"
            :rows="args.rows"
        >
          <template #item.action>
            <Button icon variant="text" size="sm">
              <Icon name="more-fill" color="primary" />
            </Button>
          </template>
          <template v-if="args.expanded" #expanded-item>
            <Card>
              <template #header> Expanded content</template>
              <DataTable
                  v-bind="
                    objectOmit(args, [
                      'modelValue',
                      'pagination',
                      'sort',
                      'expanded',
                      'group',
                      'collapsed',
                    ])
                  "
                  :row-attr="args.rowAttr"
                  :rows="args.rows"
              />
            </Card>
          </template>
        </DataTable>
      </div>`,
});

const data = [
  {
    id: 1,
    name: 'Lefteris',
    title: 'Director of Product',
    email: 'Lefteris@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 2,
    name: 'Kelsos',
    title: 'Director of Product',
    email: 'Kelsos@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 3,
    name: 'Yabir',
    title: 'Director of Product',
    email: 'Yabir@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 4,
    name: 'Luki',
    title: 'Director of Product',
    email: 'Luki@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 5,
    name: 'Celina',
    title: 'Director of Product',
    email: 'Celina@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 6,
    name: 'Joseph',
    title: 'Director of Product',
    email: 'Joseph@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  {
    id: 7,
    name: 'Dimitry',
    title: 'Director of Product',
    email: 'Dimitry@example.com',
    role: 'Member',
    date: '10.09.2023',
  },
  ...[...new Array(43)].map((_, index) => ({
    id: index + 8,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    date: '10.09.2023',
  })),
];

const columns: TableColumn<User>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Full name',
    sortable: true,
    align: 'end',
  },
  {
    key: 'title',
    label: 'Job position',
    sortable: true,
    align: 'start',
  },
  {
    key: 'email',
    label: 'Email address',
    sortable: true,
    align: 'center',
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
  component: DataTable as any,
  tags: ['autodocs'],
  render,
  argTypes: {
    rounded: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    modelValue: undefined,
    rowAttr: 'id',
    rows: [],
    columnAttr: 'label',
    loading: false,
    dense: false,
    outlined: false,
    striped: false,
  },
  parameters: {
    docs: {
      controls: {
        exclude: [
          'default',
          'update:model-value',
          'update:pagination',
          'update:sort',
          'update:options',
          'update:expanded',
          'tfoot',
          'no-data',
          'empty-description',
          '`header.${column.key.toString()}`',
          '`item.${column.key.toString()}`',
          'body.append',
          'item.expand',
          'group.header',
          'expanded-item',
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
    pagination: { limit: 10, page: 1, total: 50 },
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
    rows: [],
    cols: columns,
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
    pagination: { limit: 10, page: 1, total: 50 },
  },
};

export const ColumnsWithPagination: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
  },
};

export const Outlined: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    outlined: true,
    pagination: { limit: 10, page: 1, total: 50 },
  },
};

export const Striped: Story = {
  args: {
    rows: data,
    cols: columns,
    modelValue: [],
    striped: true,
    pagination: { limit: 10, page: 1, total: 50 },
  },
};

export const SingleSort: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    sort: { column: 'name', direction: 'asc' },
  },
};

export const MultipleSort: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const LoadingWithData: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    loading: true,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const LoadingWithoutData: Story = {
  args: {
    rows: [],
    modelValue: [],
    cols: columns,
    loading: true,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    rows: [],
    modelValue: [],
    cols: columns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    empty: {
      label: 'No item found',
      description: 'Start by adding an account',
    },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const Expandable: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    expanded: [],
  },
};

export const SingleExpandable: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    expanded: [],
    singleExpand: true,
  },
};

export const StickyHeader: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    expanded: [],
    singleExpand: true,
    stickyHeader: true,
    stickyOffset: 40,
  },
};

export const Grouped: Story = {
  args: {
    rows: data,
    modelValue: [],
    cols: columns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    expanded: [],
    collapsed: [],
    group: 'name',
  },
};

export default meta;
