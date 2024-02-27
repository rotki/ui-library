/* eslint-disable max-lines */
import { objectOmit } from '@vueuse/shared';
import Button from '@/components/buttons/button/Button.vue';
import TextField from '@/components/forms/text-field/TextField.vue';
import Icon from '@/components/icons/Icon.vue';
import Card from '@/components/cards/Card.vue';
import DataTable, { type Props as TableProps } from './DataTable.vue';
import type { TableColumn } from './TableHead.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
  role: string;
  date: string;
}

type Props = TableProps<User, 'id'>;

const render: StoryFn<Props> = args => ({
  components: { Button, Card, DataTable: DataTable<User>, Icon, TextField },
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
      collapsed,
      expanded,
      group,
      modelValue,
      objectOmit,
      pagination,
      search,
      sort,
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

const data: User[] = [
  {
    date: '10.09.2023',
    email: 'Lefteris@example.com',
    id: 1,
    name: 'Lefteris',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Kelsos@example.com',
    id: 2,
    name: 'Kelsos',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Yabir@example.com',
    id: 3,
    name: 'Yabir',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Luki@example.com',
    id: 4,
    name: 'Luki',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Celina@example.com',
    id: 5,
    name: 'Celina',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Joseph@example.com',
    id: 6,
    name: 'Joseph',
    role: 'Member',
    title: 'Director of Product',
  },
  {
    date: '10.09.2023',
    email: 'Dimitry@example.com',
    id: 7,
    name: 'Dimitry',
    role: 'Member',
    title: 'Director of Product',
  },
  ...[...new Array(43)].map((_, index) => ({
    date: '10.09.2023',
    email: 'lindsay.walton@example.com',
    id: index + 8,
    name: 'Lindsay Walton',
    role: 'Member',
    title: 'Front-end Developer',
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
    align: 'center',
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
  args: {
    columnAttr: 'label',
    dense: false,
    loading: false,
    modelValue: undefined,
    outlined: false,
    rowAttr: 'id',
    rows: [],
    striped: false,
  },
  argTypes: {
    rounded: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
  component: DataTable as any,
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
          // eslint-disable-next-line no-template-curly-in-string
          '`header.${column.key.toString()}`',
          // eslint-disable-next-line no-template-curly-in-string
          '`item.${column.key.toString()}`',
          'body.append',
          'item.expand',
          'group.header',
          'expanded-item',
        ],
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Tables/DataTable',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    cols: columns,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: [{ column: 'name', direction: 'asc' }],
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    rows: data,
  },
};

export const Loading: Story = {
  args: {
    cols: columns,
    loading: true,
    rows: [],
  },
};

export const WithColumnDefinitions: Story = {
  args: {
    cols: columns,
    rows: data,
  },
};

export const Selectable: Story = {
  args: {
    cols: columns,
    modelValue: [],
    rows: data,
  },
};

export const SelectableAndDense: Story = {
  args: {
    cols: columns,
    dense: true,
    modelValue: [],
    rows: data,
  },
};

export const WithPagination: Story = {
  args: {
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
  },
};

export const ColumnsWithPagination: Story = {
  args: {
    cols: columns,
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
  },
};

export const Outlined: Story = {
  args: {
    cols: columns,
    modelValue: [],
    outlined: true,
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
  },
};

export const Striped: Story = {
  args: {
    cols: columns,
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    striped: true,
  },
};

export const SingleSort: Story = {
  args: {
    cols: columns,
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: { column: 'name', direction: 'asc' },
  },
};

export const MultipleSort: Story = {
  args: {
    cols: columns,
    modelValue: [],
    pagination: { limit: 10, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const LoadingWithData: Story = {
  args: {
    cols: columns,
    loading: true,
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const LoadingWithoutData: Story = {
  args: {
    cols: columns,
    loading: true,
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    rows: [],
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    cols: columns,
    empty: {
      description: 'Start by adding an account',
      label: 'No item found',
    },
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
    rows: [],
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const Expandable: Story = {
  args: {
    cols: columns,
    expanded: [],
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const SingleExpandable: Story = {
  args: {
    cols: columns,
    expanded: [],
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    singleExpand: true,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export const StickyHeader: Story = {
  args: {
    cols: columns,
    expanded: [],
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    singleExpand: true,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
    stickyHeader: true,
    stickyOffset: 40,
  },
};

export const Grouped: Story = {
  args: {
    collapsed: [],
    cols: columns,
    expanded: [],
    group: 'name',
    modelValue: [],
    outlined: true,
    pagination: { limit: 5, page: 1, total: 50 },
    rows: data,
    sort: [
      { column: 'name', direction: 'asc' },
      { column: 'email', direction: 'asc' },
    ],
  },
};

export default meta;
