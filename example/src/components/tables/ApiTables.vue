<script lang="ts" setup>
import type { ExtendedUser, NormalizedUser } from '@/data/tables';
import { columns, fixedColumns, sampleData } from '@/data/table-configs';
import { fakeFetch } from '@/utils/table-utils';
import {
  type DataTableOptions,
  type DataTableProps,
  RuiButton,
  RuiDataTable,
  RuiIcon,
  RuiTextField,
} from '@rotki/ui-library/components';
import { objectOmit, useDebounceFn } from '@vueuse/shared';
import { ref } from 'vue';

const props = defineProps<{
  users: NormalizedUser[];
}>();

const containerScroll = ref(null);
const containedTable = ref<DataTableProps<ExtendedUser, 'id'>>({
  rowAttr: 'id',
  rows: [],
  cols: fixedColumns,
  modelValue: [9, 5],
  disabledRows: [],
  outlined: true,
  sort: [{ column: 'name', direction: 'asc' }],
  pagination: { limit: 5, page: 1, total: 5 },
  stickyHeader: true,
  group: ['username'],
  collapsed: [],
});

const apiDatatables = ref<{
  title: string;
  table: DataTableProps<ExtendedUser, 'id'>;
}[]>([{
  title: 'API: With Column definitions',
  table: {
    rowAttr: 'id',
    rows: [],
    cols: fixedColumns,
  },
}, {
  title: 'API: No Column definitions',
  table: {
    rowAttr: 'id',
    rows: [],
  },
}, {
  title: 'API: Sortable',
  table: {
    rowAttr: 'id',
    rows: [],
    cols: columns,
    outlined: true,
    sort: [{ column: 'name', direction: 'asc' }],
  },
}, {
  title: 'API: Pagination',
  table: {
    rowAttr: 'id',
    modelValue: [],
    rows: [],
    cols: fixedColumns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
  },
}, {
  title: 'API: Search',
  table: {
    rowAttr: 'id',
    modelValue: [],
    rows: [],
    cols: fixedColumns,
    outlined: true,
    search: '',
  },
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}]);

const selection = ref<number[]>([]);

async function fetchData(index: number, options?: DataTableOptions<ExtendedUser>, search?: string) {
  const row = apiDatatables.value[index];
  row.table.loading = true;

  if (options?.pagination)
    row.table.pagination = options.pagination;

  if (options?.sort)
    row.table.sort = options.sort;

  const response = await fakeFetch(options, search, true, props.users);
  row.table.rows = response.data;
  if (row.table.pagination)
    row.table.pagination.total = response.total;

  row.table.loading = false;
}

const onSearch = useDebounceFn(async (query: string, index: number) => {
  const { table } = apiDatatables.value[index];

  await fetchData(
    index,
    { pagination: table.pagination, sort: table.sort },
    query,
  );

  // reset to page 1 on search
  if (table.pagination)
    table.pagination.page = 1;
}, 500);
</script>

<template>
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
        @update:options="fetchData(i, $event, table.search)"
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
    <!-- check types -->
    <RuiDataTable
      v-model="selection"
      row-attr="id"
      :rows="sampleData"
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
</template>
