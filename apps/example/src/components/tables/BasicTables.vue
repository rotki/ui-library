<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  type DataTableProps,
  RuiButton,
  RuiDataTable,
  RuiIcon,
  RuiTextField,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';
import { columns, fixedColumns, fixedRows } from '@/data/table-configs';

const datatables = ref<{
  title: string;
  table: DataTableProps<ExtendedUser, 'id'>;
}[]>([{
  title: 'With Column definitions',
  table: {
    rowAttr: 'id',
    rows: fixedRows,
    cols: fixedColumns,
    hideDefaultFooter: true,
  },
}, {
  title: 'No Column definitions',
  table: {
    rowAttr: 'id',
    rows: fixedRows,
  },
}, {
  title: 'Outlined',
  table: {
    rowAttr: 'id',
    rows: fixedRows,
    cols: fixedColumns,
    outlined: true,
  },
}, {
  title: 'Sortable',
  table: {
    rowAttr: 'id',
    rows: fixedRows,
    cols: columns,
    outlined: true,
    sort: [{ column: 'name', direction: 'asc' }],
    stickyHeader: true,
  },
}, {
  title: 'Pagination',
  table: {
    rowAttr: 'id',
    modelValue: [],
    rows: fixedRows,
    cols: fixedColumns,
    outlined: true,
    pagination: { limit: 5, page: 1, total: 0 },
  },
}, {
  title: 'Search',
  table: {
    rowAttr: 'id',
    modelValue: [],
    rows: fixedRows,
    cols: fixedColumns,
    outlined: true,
    search: '',
  },
}, {
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
}, {
  title: 'Search and Pagination',
  table: {
    rowAttr: 'id',
    modelValue: [],
    rows: fixedRows,
    cols: fixedColumns,
    outlined: true,
    search: '',
    pagination: { limit: 5, page: 1, total: 0 },
  },
}, {
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
}, {
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
}]);
</script>

<template>
  <div class="grid grid-cols-1 gap-12">
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
</template>
