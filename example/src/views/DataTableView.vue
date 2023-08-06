<script lang="ts" setup>
import {
  type DataTableColumn,
  type DataTableProps,
  RuiButton,
  RuiDataTable,
  RuiIcon,
  RuiTextField,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const data = [
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

const datatables = ref<{ title: string; table: DataTableProps }[]>([
  {
    title: 'With Column definitions',
    table: { rowAttr: 'id', rows: data.slice(0, 5), cols: columns },
  },
  {
    title: 'No Columns',
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
    title: 'Search',
    table: {
      rowAttr: 'id',
      modelValue: [],
      rows: data,
      cols: columns,
      outlined: true,
      sort: [],
      pagination: { limit: 10, page: 1, total: 50 },
      search: '',
    },
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="datatables">Data Tables</h2>
    <div class="grid grid-cols-1 gap-12">
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
          :search="table.search"
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
  </div>
</template>
