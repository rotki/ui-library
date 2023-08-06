<script lang="ts" setup>
import {
  type DataTableColumn,
  type DataTableProps,
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const selected = ref([]);

const data = [
  {
    id: 1,
    name: 'Lefteris',
    title: 'Director of Product',
    email: 'Lefteris@example.com',
    role: 'Member',
    salary: '100000',
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
    salary: '100000',
    date: '10.09.2023',
  },
  {
    id: 3,
    name: 'Yabir',
    title: 'Director of Product',
    email: 'Yabir@example.com',
    role: 'Member',
    salary: '100000',
    date: '10.09.2023',
  },
  {
    id: 4,
    name: 'Luki',
    title: 'Director of Product',
    email: 'Luki@example.com',
    role: 'Member',
    salary: '100000',
    date: '10.09.2023',
  },
  {
    id: 5,
    name: 'Celina',
    title: 'Director of Product',
    email: 'Celina@example.com',
    role: 'Member',
    salary: '100000',
    date: '10.09.2023',
  },
  {
    id: 6,
    name: 'Joseph',
    title: 'Director of Product',
    email: 'Joseph@example.com',
    role: 'Member',
    salary: '100000',
    date: '10.09.2023',
  },
  {
    id: 7,
    name: 'Dimitry',
    title: 'Director of Product',
    email: 'Dimitry@example.com',
    role: 'Member',
    salary: '100000',
    date: '10.09.2023',
  },
  ...[...new Array(43)].map((_, index) => ({
    id: index + 8,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    salary: '100000',
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

const datatables = ref<DataTableProps[]>([
  { rowAttr: 'id', rows: data.slice(0, 5), cols: columns },
  { rowAttr: 'id', rows: data.slice(0, 5) },
  { rowAttr: 'id', rows: data.slice(0, 5), loading: true },
  { rowAttr: 'id', rows: data.slice(0, 5), loading: true, outlined: true },
  { rowAttr: 'id', rows: data.slice(0, 5), loading: true, outlined: true },
  {
    rowAttr: 'id',
    rows: data.slice(0, 5),
    cols: columns,
    outlined: true,
    sort: [{ column: 'name', direction: 'asc' }],
  },
  {
    rowAttr: 'id',
    modelValue: [],
    rows: data,
    cols: columns,
    outlined: true,
    sort: [{ column: 'name', direction: 'asc' }],
    pagination: { limit: 10, page: 1, total: 50 },
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="datatables">Data Tables</h2>
    <div class="grid grid-cols-1 gap-12">
      <div v-for="(table, i) in datatables" :key="i">
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
