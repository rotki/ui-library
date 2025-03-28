<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import {
  type DataTableColumn,
  type DataTableOptions,
  type DataTableProps,
  type DataTableSortColumn,
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiIcon,
  RuiTableRowExpander,
  RuiTextField,
} from '@rotki/ui-library/components';
import { objectOmit, useDebounceFn } from '@vueuse/shared';

interface _User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const {
  data: _users,
  isFetching,
  execute,
} = useFetch<string>('https://jsonplaceholder.typicode.com/users');

interface BaseUser {
  'id': number;
  'name': string;
  'username': string;
  'email': string;
  'address.street': string;
  'address.city': string;
}

const columns: DataTableColumn<BaseUser>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Full name',
    sortable: true,
  },
  {
    key: 'username',
    label: 'Username',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email address',
    sortable: true,
  },
  {
    key: 'address.street',
    label: 'Street',
    sortable: true,
  },
  {
    key: 'address.city',
    label: 'City',
    sortable: true,
  },
  {
    key: 'website',
    label: 'Website',
  },
  {
    key: 'company.name',
    label: 'Company',
  },
  {
    key: 'phone',
    label: 'Phone',
    align: 'end',
  },
  {
    key: 'action',
  },
];

const fixedColumns: DataTableColumn<BaseUser>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Full name',
    sortable: true,
  },
  {
    key: 'username',
    label: 'Username',
  },
  {
    key: 'email',
    label: 'Email address',
  },
  {
    key: 'address.street',
    label: 'Street',
  },
  {
    key: 'address.city',
    label: 'City',
  },
  {
    key: 'website',
    label: 'Website',
  },
  {
    key: 'action',
  },
];

interface ExtendedUser extends BaseUser {
  'phone'?: string;
  'website': string;
  'company.name'?: string;
}

const fixedRows: ExtendedUser[] = [
  {
    'id': 5,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
  },
  {
    'id': 501,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
  },
  {
    'id': 5012,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
  },
  {
    'id': 5013,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
  },
  {
    'id': 10,
    'name': 'Clementina DuBuque',
    'username': 'Moriah.Stanton',
    'email': 'Rey.Padberg@karina.biz',
    'website': 'ambrose.net',
    'address.street': 'Kattie Turnpike',
    'address.city': 'Lebsackbury',
  },
  {
    'id': 3,
    'name': 'Clementine Bauch',
    'username': 'Kamren',
    'email': 'Nathan@yesenia.net',
    'website': 'ramiro.info',
    'address.street': 'Douglas Extension',
    'address.city': 'McKenziehaven',
  },
  {
    'id': 2,
    'name': 'Ervin Howell',
    'username': 'Antonette',
    'email': 'Shanna@melissa.tv',
    'website': 'anastasia.net',
    'address.street': 'Victor Plains',
    'address.city': 'Wisokyburgh',
  },
  {
    'id': 203,
    'name': 'Ervin Howell',
    'username': 'Antonette',
    'email': 'Shanna@melissa.tv',
    'website': 'anastasia.net',
    'address.street': 'Victor Plains',
    'address.city': 'Wisokyburgh',
  },
  {
    'id': 19,
    'name': 'Glenna Reichert',
    'username': 'Kamren',
    'email': 'Chaim_McDermott@dana.io',
    'website': 'conrad.com',
    'address.street': 'Dayna Park',
    'address.city': 'Bartholomebury',
  },
  {
    'id': 15,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
  },
  {
    'id': 110,
    'name': 'Clementina DuBuque',
    'username': 'Moriah.Stanton',
    'email': 'Rey.Padberg@karina.biz',
    'website': 'ambrose.net',
    'address.street': 'Kattie Turnpike',
    'address.city': 'Lebsackbury',
  },
  {
    'id': 13,
    'name': 'Clementine Bauch',
    'username': 'Kamren',
    'email': 'Nathan@yesenia.net',
    'website': 'ramiro.info',
    'address.street': 'Douglas Extension',
    'address.city': 'McKenziehaven',
  },
  {
    'id': 12,
    'name': 'Ervin Howell',
    'username': 'Antonette',
    'email': 'Shanna@melissa.tv',
    'website': 'anastasia.net',
    'address.street': 'Victor Plains',
    'address.city': 'Wisokyburgh',
  },
];

const emptyTables = ref<
  {
    title: string;
    table: DataTableProps<ExtendedUser, 'id'>;
    emptySlot?: boolean;
  }[]
>([
  {
    title: 'Empty table',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
      outlined: true,
      rounded: 'sm',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
      empty: {
        label: 'No item found',
        description: 'No user found',
      },
      stickyHeader: true,
    },
  },
  {
    title: 'Empty table (with action slot)',
    emptySlot: true,
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
      outlined: true,
      rounded: 'md',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
      empty: {
        label: 'No item found',
      },
    },
  },
  {
    title: 'Loading without Data',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
      loading: true,
      outlined: true,
      rounded: 'lg',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'Loading with Data',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      loading: true,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      stickyHeader: true,
      group: ['username'],
      collapsed: [],
    },
  },
  {
    title: 'Multi page selection with disabled rows',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      modelValue: [9, 5],
      disabledRows: fixedRows.slice(0, 3),
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      stickyHeader: true,
      multiPageSelect: true,
      group: ['username'],
      collapsed: [],
    },
  },
  {
    title: 'Single page selection with repositioned group expand button',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      modelValue: [9, 5],
      disabledRows: fixedRows.slice(0, 3),
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      stickyHeader: true,
      group: ['username'],
      collapsed: [],
      expanded: [],
      groupExpandButtonPosition: 'end',
    },
  },
]);

const expandableTables = ref<
  {
    title: string;
    table: DataTableProps<ExtendedUser, 'id'>;
    customToggle?: boolean;
  }[]
>([
  {
    title: 'Multiple Expandable',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      expanded: [],
      stickyHeader: true,
      disablePerPage: true,
    },
  },
  {
    title: 'Single Expandable',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      expanded: [],
      singleExpand: true,
    },
  },
  {
    title: 'Expandable with icon on left',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: [
        { key: 'expand' },
        ...fixedColumns,
      ],
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      modelValue: [],
      expanded: [],
      singleExpand: true,
      group: ['username'],
    },
  },
  {
    title: 'Custom Expandable control',
    customToggle: true,
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: fixedColumns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      expanded: [],
      stickyHeader: true,
    },
  },
  {
    title: 'Selection with defined expand button',
    table: {
      rowAttr: 'id',
      rows: fixedRows,
      cols: [
        ...fixedColumns.slice(0, 4),
        { key: 'expand' },
        ...fixedColumns.slice(4),
      ],
      modelValue: [9, 5],
      disabledRows: fixedRows.slice(0, 3),
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 5 },
      stickyHeader: true,
      group: ['username'],
      collapsed: [],
      expanded: [],
      groupExpandButtonPosition: 'end',
    },
  },
]);

const datatables = ref<
  {
    title: string;
    table: DataTableProps<ExtendedUser, 'id'>;
  }[]
>([
  {
    title: 'With Column definitions',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
      hideDefaultFooter: true,
    },
  },
  {
    title: 'No Column definitions',
    table: {
      rowAttr: 'id',
      rows: [],
    },
  },
  {
    title: 'Outlined',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
      outlined: true,
    },
  },
  {
    title: 'Sortable',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      stickyHeader: true,
    },
  },
  {
    title: 'Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'Search',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      search: '',
    },
  },
  {
    title: 'Sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'Search and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      search: '',
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'Search and Sort',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      sort: [{ column: 'name', direction: 'asc' }],
    },
  },
  {
    title: 'Search, Sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
]);

const apiDatatables = ref<
  {
    title: string;
    table: DataTableProps<ExtendedUser, 'id'>;
  }[]
>([
  {
    title: 'API: With Column definitions',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: fixedColumns,
    },
  },
  {
    title: 'API: No Column definitions',
    table: {
      rowAttr: 'id',
      rows: [],
    },
  },
  {
    title: 'API: Sortable',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
    },
  },
  {
    title: 'API: Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'API: Search',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      search: '',
    },
  },
  {
    title: 'API: Sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'API: Search and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: fixedColumns,
      outlined: true,
      search: '',
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
  {
    title: 'API: Search and Sort',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      sort: [{ column: 'name', direction: 'asc' }],
    },
  },
  {
    title: 'API: Search, Sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      sort: { column: 'name', direction: 'asc' },
      pagination: { limit: 5, page: 1, total: 0 },
      group: ['username'],
      collapsed: [],
    },
  },
  {
    title: 'API: Search, Multi-sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 5, page: 1, total: 0 },
    },
  },
]);

const containerScroll = ref(null);
const containedTable = { ...get(emptyTables)[4].table };

const users = computed<ExtendedUser[]>(() =>
  JSON.parse(get(_users) ?? '[]').map(normalize),
);

function normalize(user: _User): Record<string, any> {
  const { address, company } = user;
  return {
    ...objectOmit(user, ['address', 'company']),
    'address.street': address.street,
    'address.suite': address.suite,
    'address.city': address.city,
    'address.zipcode': address.zipcode,
    'address.geo.lat': address.geo.lat,
    'address.geo.lng': address.geo.lng,
    'company.name': company.name,
    'company.catchPhrase': company.catchPhrase,
    'company.bs': company.bs,
  };
}

async function fakeFetch(options?: DataTableOptions<ExtendedUser>, search?: string, api?: boolean): Promise<{
  data: ExtendedUser[];
  total: number;
}> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  let result = [...(get(users) ?? [])];

  if (api) {
    const query = search?.toLocaleLowerCase();
    const sortBy = options?.sort;
    const sortOptions: Intl.CollatorOptions = {
      numeric: true,
      ignorePunctuation: true,
    };
    const paginated = options?.pagination;

    const sort = (by: DataTableSortColumn<ExtendedUser>) => {
      result.sort((a, b) => {
        if (!by.column)
          return 0;

        if (by.direction === 'desc') {
          return `${b[by.column]}`.localeCompare(
            `${a[by.column]}`,
            undefined,
            sortOptions,
          );
        }

        return `${a[by.column]}`.localeCompare(
          `${b[by.column]}`,
          undefined,
          sortOptions,
        );
      });
    };

    // search
    if (query) {
      result = result.filter(row =>
        (Object.keys(row) as (keyof ExtendedUser)[]).some(key =>
          `${row[key]}`.toLocaleLowerCase().includes(query),
        ),
      );
    }

    // sort
    if (sortBy) {
      if (!Array.isArray(sortBy))
        sort(sortBy);
      else
        sortBy.forEach(sort);
    }

    // paginate
    if (paginated) {
      const start = (paginated.page - 1) * paginated.limit;
      const end = start + paginated.limit;
      result = result.slice(start, end);
    }
  }

  return {
    data: result,
    total: search ? result.length : [...(get(users) ?? [])].length,
  };
}

async function fetchData(index: number, options?: DataTableOptions<ExtendedUser>, search?: string, api?: boolean) {
  const row = get(api ? apiDatatables : datatables)[index];
  if (api)
    row.table.loading = true;

  if (options?.pagination)
    row.table.pagination = options.pagination;

  if (options?.sort)
    row.table.sort = options.sort;

  const response = await fakeFetch(options, search, api);
  row.table.rows = response.data;
  if (row.table.pagination)
    row.table.pagination.total = response.total;

  if (api)
    row.table.loading = false;
}

const onSearch = useDebounceFn(async (query: string, index: number) => {
  const { table } = get(apiDatatables)[index];

  await fetchData(
    index,
    { pagination: table.pagination, sort: table.sort },
    query,
    true,
  );

  // reset to page 1 on search
  if (table.pagination)
    table.pagination.page = 1;
}, 500);

onBeforeMount(async () => {
  if (get(isFetching))
    await execute().catch();

  get(datatables).forEach((row, i) => {
    fetchData(
      i,
      { pagination: row.table.pagination, sort: row.table.sort },
      row.table.search,
    );
  });
  get(apiDatatables).forEach((row, i) => {
    fetchData(
      i,
      { pagination: row.table.pagination, sort: row.table.sort },
      row.table.search,
      true,
    );
  });
});

const data = [
  {
    'id': 1,
    'name': 'Chelsey Dietrich',
    'username': 'Kamren',
    'email': 'Lucio_Hettinger@annie.ca',
    'phone': '(254)954-1289',
    'website': 'demarco.info',
    'address.street': 'Skiles Walks',
    'address.city': 'Roscoeview',
    'company.name': 'Keebler LLC',
  },
];

const selection = ref<number[]>([]);

function isExpanded(row: ExtendedUser, expanded?: ExtendedUser[]): boolean {
  return expanded?.some((item: ExtendedUser) => item.id === row.id) ?? false;
}

function toggleRow(row: ExtendedUser, expanded?: ExtendedUser[]) {
  if (isExpanded(row, expanded))
    expanded?.splice(expanded.indexOf(row), 1);
  else
    expanded?.push(row);
}

function removeRow(table: Pick<DataTableProps<ExtendedUser, 'id'>, 'rows'>, row: ExtendedUser) {
  table.rows = table.rows.filter(tRow => tRow.id !== row.id);
}
</script>

<template>
  <ComponentView data-cy="datatables">
    <template #title>
      Data Tables
    </template>

    <template v-if="!isFetching">
      <div class="grid grid-cols-1 gap-12 mb-14">
        <div
          v-for="({ title, table, emptySlot }, i) in emptyTables"
          :key="i"
          class="flex flex-col space-y-3"
          :data-cy="title"
        >
          <h4>{{ title }}</h4>
          <RuiDataTable
            v-bind="objectOmit(table, ['modelValue', 'pagination', 'sort', 'scroller'])"
            v-model="table.modelValue"
            v-model:pagination="table.pagination"
            v-model:sort="table.sort"
            v-model:group="table.group"
            v-model:collapsed="table.collapsed"
            :data-cy="`table-empty-${i}`"
          >
            <template #body.prepend="{ colspan }">
              <tr>
                <td
                  :colspan="colspan"
                  class="p-3"
                >
                  body prepend content
                </td>
              </tr>
            </template>
            <template #body.append="{ colspan }">
              <tr>
                <td
                  :colspan="colspan"
                  class="p-3"
                >
                  body append content
                </td>
              </tr>
            </template>
            <template #header.text.address.city>
              city custom header
            </template>
            <template #item.action="{ row }">
              <RuiButton
                icon
                variant="text"
                size="sm"
                @click="removeRow(table, row)"
              >
                <RuiIcon
                  name="lu-trash-2"
                  size="14"
                  color="error"
                />
              </RuiButton>
            </template>
            <template
              v-if="emptySlot"
              #empty-description
            >
              <div class="flex space-x-1 items-center">
                <span>No user found,</span>
                <RuiButton
                  variant="text"
                  size="sm"
                >
                  create users
                  <template #append>
                    <RuiIcon
                      name="lu-plus"
                      color="primary"
                    />
                  </template>
                </RuiButton>
              </div>
            </template>
          </RuiDataTable>
        </div>
        <div
          v-for="({ title, table, customToggle }, i) in expandableTables"
          :key="i"
          class="flex flex-col space-y-3"
          :data-cy="title"
        >
          <h4>{{ title }}</h4>
          <RuiDataTable
            v-bind="
              objectOmit(table, [
                'modelValue',
                'pagination',
                'sort',
                'expanded',
                'rows',
                'scroller',
              ])
            "
            v-model="table.modelValue"
            v-model:pagination="table.pagination"
            v-model:sort="table.sort"
            v-model:expanded="table.expanded"
            :rows="table.rows"
            :data-cy="`table-expandable-${i}`"
          >
            <template #item.action>
              <RuiButton
                icon
                variant="text"
                size="sm"
              >
                <RuiIcon
                  name="lu-ellipsis"
                  color="primary"
                />
              </RuiButton>
            </template>
            <template
              v-if="customToggle"
              #item.expand="{ row }"
            >
              <RuiTableRowExpander
                icon="lu-circle-arrow-down"
                :expanded="isExpanded(row, table.expanded)"
                @click="toggleRow(row, table.expanded)"
              />
            </template>
            <template #expanded-item>
              <RuiCard data-cy="expanded-content">
                <template #header>
                  Expanded content
                </template>
                <RuiDataTable
                  v-bind="
                    objectOmit(table, [
                      'modelValue',
                      'pagination',
                      'sort',
                      'expanded',
                      'stickyHeader',
                      'scroller',
                    ])
                  "
                  :data-cy="`table-expanded-${i}`"
                />
              </RuiCard>
            </template>
          </RuiDataTable>
        </div>

        <div
          v-for="({ title, table }, i) in datatables"
          :key="i"
          class="flex flex-col space-y-3"
          :data-cy="title"
        >
          <h4>{{ title }}</h4>
          <div class="flex space-x-4 items-center">
            <RuiTextField
              v-if="table.search !== undefined"
              v-model="table.search"
              placeholder="search"
              label="search"
              class="w-1/2 lg:w-2/5"
              variant="outlined"
              color="primary"
              hide-details
            />
            <span v-if="table.modelValue">
              selected: {{ table.modelValue.length }}
            </span>
          </div>
          <RuiDataTable
            v-bind="objectOmit(table, ['modelValue', 'pagination', 'sort', 'scroller'])"
            v-model="table.modelValue"
            v-model:pagination="table.pagination"
            v-model:sort="table.sort"
            :data-cy="`table-${i}`"
          >
            <template #item.action>
              <RuiButton
                icon
                variant="text"
                size="sm"
              >
                <RuiIcon
                  name="lu-ellipsis"
                  color="primary"
                />
              </RuiButton>
            </template>
          </RuiDataTable>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-12">
        <div
          v-for="({ title, table }, i) in apiDatatables"
          :key="i"
          class="flex flex-col space-y-3"
          :data-cy="title"
        >
          <h4>{{ title }}</h4>
          <div class="flex space-x-4 items-center">
            <RuiTextField
              v-if="table.search !== undefined"
              v-model="table.search"
              placeholder="search"
              label="search"
              class="w-1/2 lg:w-2/5"
              variant="outlined"
              color="primary"
              hide-details
              @update:model-value="onSearch($event, i)"
            />
            <span v-if="table.modelValue">
              selected: {{ table.modelValue.length }}
            </span>
          </div>
          <RuiDataTable
            v-bind="
              objectOmit(table, ['modelValue', 'pagination', 'sort', 'search', 'scroller'])
            "
            v-model="table.modelValue"
            v-model:pagination.external="table.pagination"
            v-model:sort.external="table.sort"
            v-model:group="table.group"
            v-model:collapsed="table.collapsed"
            :data-cy="`table-api-${i}`"
            @update:options="fetchData(i, $event, table.search, true)"
          >
            <template #item.action>
              <RuiButton
                icon
                variant="text"
                size="sm"
              >
                <RuiIcon
                  name="lu-ellipsis"
                  color="primary"
                />
              </RuiButton>
            </template>
            <template #group.header.content="{ header }">
              custom group content: {{ header.identifier }}
            </template>
          </RuiDataTable>

          <!-- check types -->
          <RuiDataTable
            v-model="selection"
            row-attr="id"
            :rows="data"
          >
            <template #item.action>
              <RuiButton
                icon
                variant="text"
                size="sm"
              >
                <RuiIcon
                  name="lu-ellipsis"
                  color="primary"
                />
              </RuiButton>
            </template>
            <template #group.header.content="{ header }">
              custom group content: {{ header.identifier }}
            </template>
          </RuiDataTable>
        </div>
        <div
          ref="containerScroll"
          class="max-h-[300px] overflow-y-auto mt-10"
        >
          <RuiDataTable
            v-bind="objectOmit(containedTable, ['modelValue', 'pagination', 'sort', 'stickyHeader'])"
            v-model="containedTable.modelValue"
            v-model:pagination="containedTable.pagination"
            v-model:sort="containedTable.sort"
            v-model:group="containedTable.group"
            v-model:collapsed="containedTable.collapsed"
            data-cy="table-scroll-parent"
            :scroller="containerScroll"
          >
            <template #item.action>
              <RuiButton
                icon
                variant="text"
                size="sm"
              >
                <RuiIcon
                  name="lu-ellipsis"
                  color="primary"
                />
              </RuiButton>
            </template>
          </RuiDataTable>
        </div>
      </div>
    </template>
  </ComponentView>
</template>
