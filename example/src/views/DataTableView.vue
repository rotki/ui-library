<script lang="ts" setup>
import {
  type DataTableColumn,
  type DataTableOptions,
  type DataTableProps,
  type DataTableSortColumn,
  RuiButton,
  RuiDataTable,
  RuiIcon,
  RuiTextField,
} from '@rotki/ui-library/components';
import { useFetch } from '@vueuse/core';
import { get, objectOmit, useDebounceFn } from '@vueuse/shared';
import { computed, onBeforeMount, ref } from 'vue';

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

const { data: _users, isFetching } = useFetch<string>(
  'https://jsonplaceholder.typicode.com/users',
);

const columns: DataTableColumn[] = [
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
    align: 'right',
  },
  {
    key: 'action',
  },
];

const fixedColumns: DataTableColumn[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Full name',
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
    key: 'company.name',
    label: 'Company',
  },
  {
    key: 'phone',
    label: 'Phone',
    align: 'right',
  },
  {
    key: 'action',
  },
];

const datatables = ref<{ title: string; table: DataTableProps }[]>([
  {
    title: 'With Column definitions',
    table: { rowAttr: 'id', rows: [], cols: fixedColumns },
  },
  {
    title: 'No Column definitions',
    table: { rowAttr: 'id', rows: [] },
  },
  {
    title: 'Loading',
    table: { rowAttr: 'id', rows: [], cols: fixedColumns, loading: true },
  },
  {
    title: 'Outlined',
    table: { rowAttr: 'id', rows: [], cols: fixedColumns, outlined: true },
  },
  {
    title: 'Sortable',
    table: {
      rowAttr: 'id',
      rows: [],
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
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

const apiDatatables = ref<{ title: string; table: DataTableProps }[]>([
  {
    title: 'API: With Column definitions',
    table: { rowAttr: 'id', rows: [], cols: fixedColumns },
  },
  {
    title: 'API: No Column definitions',
    table: { rowAttr: 'id', rows: [] },
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

const users = computed<Record<string, any>[]>(() =>
  JSON.parse(get(_users) ?? '[]').map(normalize),
);

const normalize = (user: _User): Record<string, any> => {
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
};

const fakeFetch = async (
  options?: DataTableOptions,
  search?: string,
  api?: boolean,
): Promise<{ data: Record<string, any>[]; total: number }> => {
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

    const sort = (by: DataTableSortColumn) => {
      result.sort((a, b) => {
        if (!by.column) {
          return 0;
        }
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
      result = result.filter((row) =>
        Object.keys(row).some((key) =>
          `${row[key]}`.toLocaleLowerCase().includes(query),
        ),
      );
    }

    // sort
    if (sortBy) {
      if (!Array.isArray(sortBy)) {
        sort(sortBy);
      } else {
        sortBy.forEach(sort);
      }
    }

    // paginate
    if (paginated) {
      const start = (paginated.page - 1) * paginated.limit;
      const end = start + paginated.limit;
      result = result.slice(start, end);
    }
  }

  return { data: result, total: [...(get(users) ?? [])].length };
};

const fetchData = async (
  index: number,
  options?: DataTableOptions,
  search?: string,
  api?: boolean,
) => {
  const row = get(api ? apiDatatables : datatables)[index];
  if (api) {
    row.table.loading = true;
  }
  if (options?.pagination) {
    row.table.pagination = options.pagination;
  }
  if (options?.sort) {
    row.table.sort = options.sort;
  }
  const response = await fakeFetch(options, search, api);
  row.table.rows = response.data;
  if (row.table.pagination) {
    row.table.pagination.total = response.total;
  }

  if (api) {
    row.table.loading = false;
  }
};

const onSearch = useDebounceFn(async (query: string, index: number) => {
  const { table } = get(apiDatatables)[index];

  await fetchData(
    index,
    { pagination: table.pagination, sort: table.sort },
    query,
  );

  // reset to page 1 on search
  if (table.pagination) {
    table.pagination.page = 1;
  }
}, 500);

onBeforeMount(() => {
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
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="datatables">Data Tables</h2>
    <template v-if="!isFetching">
      <div class="grid grid-cols-1 gap-12 mb-14">
        <div
          v-for="({ title, table }, i) in datatables"
          :key="i"
          class="flex flex-col space-y-3"
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
            v-bind="objectOmit(table, ['modelValue', 'pagination', 'sort'])"
            v-model="table.modelValue"
            v-model:pagination="table.pagination"
            v-model:sort="table.sort"
            :data-cy="`table-${i}`"
          >
            <template #action-data>
              <RuiButton icon variant="text" size="sm">
                <RuiIcon name="more-fill" color="primary" />
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
              objectOmit(table, ['modelValue', 'pagination', 'sort', 'search'])
            "
            v-model="table.modelValue"
            v-model:pagination.external="table.pagination"
            v-model:sort.external="table.sort"
            :data-cy="`table-${i}`"
            @update:options="fetchData(i, $event, table.search, true)"
          >
            <template #action-data>
              <RuiButton icon variant="text" size="sm">
                <RuiIcon name="more-fill" color="primary" />
              </RuiButton>
            </template>
          </RuiDataTable>
        </div>
      </div>
    </template>
  </div>
</template>
