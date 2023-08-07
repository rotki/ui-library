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
import { get, objectOmit, useDebounceFn } from '@vueuse/shared';
import { onBeforeMount, ref } from 'vue';

const data: Record<string, any>[] = [
  {
    id: 1,
    name: 'Lefteris',
    title: 'Director of Product',
    email: 'Lefteris@example.com',
    role: 'Member',
    salary: 1000000,
    date: '10.09.2023',
    date1: '10.09.2023',
    date2: '10.09.2023',
    date3: '10.09.2023',
    date4: '10.09.2023',
    date5: '10.09.2023',
    date6: '10.09.2023',
    date7: '10.09.2023',
    date8: '10.09.2023',
    date9: '10.09.2023',
    date10: '10.09.2023',
    date11: '10.09.2023',
    date12: '10.09.2023',
    date13: '10.09.2023',
  },
  {
    id: 2,
    name: 'Kelsos',
    title: 'Director of Product',
    email: 'Kelsos@example.com',
    role: 'Member',
    salary: 900000,
    date: '10.09.2023',
  },
  {
    id: 3,
    name: 'Yabir',
    title: 'Director of Product',
    email: 'Yabir@example.com',
    role: 'Member',
    salary: 800000,
    date: '10.09.2023',
  },
  {
    id: 4,
    name: 'Luki',
    title: 'Director of Product',
    email: 'Luki@example.com',
    role: 'Member',
    salary: 700000,
    date: '10.09.2023',
  },
  {
    id: 5,
    name: 'Celina',
    title: 'Director of Product',
    email: 'Celina@example.com',
    role: 'Member',
    salary: 600000,
    date: '10.09.2023',
  },
  {
    id: 6,
    name: 'Joseph',
    title: 'Director of Product',
    email: 'Joseph@example.com',
    role: 'Member',
    salary: 500000,
    date: '10.09.2023',
  },
  {
    id: 7,
    name: 'Dimitry',
    title: 'Director of Product',
    email: 'Dimitry@example.com',
    role: 'Member',
    salary: 400000,
    date: '10.09.2023',
  },
  ...[...new Array(43)].map((_, index) => ({
    id: index + 8,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    salary: 1000 * (1 + index),
    date: '10.09.2023',
  })),
];

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
    key: 'role',
    label: 'Role',
  },
  {
    label: 'Salary',
    key: 'salary',
    sortable: true,
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
    key: 'title',
    label: 'Job position',
  },
  {
    key: 'email',
    label: 'Email address',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    label: 'Salary',
    key: 'salary',
    align: 'right',
  },
  {
    key: 'action',
  },
];

const datatables = ref<{ title: string; table: DataTableProps }[]>([
  {
    title: 'With Column definitions',
    table: { rowAttr: 'id', rows: data.slice(0, 5), cols: columns },
  },
  {
    title: 'No Column definitions',
    table: { rowAttr: 'id', rows: data.slice(0, 5) },
  },
  {
    title: 'Loading',
    table: { rowAttr: 'id', rows: data.slice(0, 5), loading: true },
  },
  {
    title: 'Outlined',
    table: { rowAttr: 'id', rows: data.slice(0, 5), outlined: true },
  },
  {
    title: 'Sortable',
    table: {
      rowAttr: 'id',
      rows: data.slice(0, 5),
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
      rows: data,
      cols: columns,
      outlined: true,
      pagination: { limit: 10, page: 1, total: 50 },
    },
  },
  {
    title: 'Search',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: data.slice(0, 5),
      cols: columns,
      outlined: true,
      search: '',
    },
  },
  {
    title: 'Sort and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: data,
      cols: columns,
      outlined: true,
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 10, page: 1, total: 50 },
    },
  },
  {
    title: 'Search and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: data,
      cols: columns,
      outlined: true,
      search: '',
      pagination: { limit: 10, page: 1, total: 50 },
    },
  },
  {
    title: 'Search and Sort',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: data.slice(0, 5),
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
      rows: data,
      cols: columns,
      outlined: true,
      search: '',
      sort: [{ column: 'name', direction: 'asc' }],
      pagination: { limit: 10, page: 1, total: 50 },
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
      cols: columns,
      outlined: true,
      pagination: { limit: 5, page: 1, total: 10 },
    },
  },
  {
    title: 'API: Search',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
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
      pagination: { limit: 5, page: 1, total: 10 },
    },
  },
  {
    title: 'API: Search and Pagination',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: [],
      cols: columns,
      outlined: true,
      search: '',
      pagination: { limit: 5, page: 1, total: 10 },
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
      pagination: { limit: 5, page: 1, total: 10 },
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
      pagination: { limit: 5, page: 1, total: 10 },
    },
  },
]);

const fakeFetch = async (
  options?: DataTableOptions,
  search?: string,
): Promise<{ data: Record<string, any>[] }> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  let result = [...data.slice(0, 10)];

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

  return { data: result };
};

const fetchData = async (
  index: number,
  options?: DataTableOptions,
  search?: string,
) => {
  const row = get(apiDatatables)[index];
  row.table.loading = true;
  if (options?.pagination) {
    row.table.pagination = options.pagination;
  }
  if (options?.sort) {
    row.table.sort = options.sort;
  }
  const response = await fakeFetch(options, search);
  row.table.rows = response.data;

  row.table.loading = false;
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
  get(apiDatatables).forEach((row, i) => {
    fetchData(
      i,
      { pagination: row.table.pagination, sort: row.table.sort },
      row.table.search,
    );
  });
});
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="datatables">Data Tables</h2>
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
          @update:options="fetchData(i, $event, table.search)"
        >
          <template #action-data>
            <RuiButton icon variant="text" size="sm">
              <RuiIcon name="more-fill" color="primary" />
            </RuiButton>
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
