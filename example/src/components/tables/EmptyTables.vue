<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import { fixedColumns, fixedRows } from '@/data/table-configs';
import { removeRow } from '@/utils/table-utils';
import {
  type DataTableProps,
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const emptyTables = ref<{
  title: string;
  table: DataTableProps<ExtendedUser, 'id'>;
  emptySlot?: boolean;
}[]>([{
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}]);
</script>

<template>
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
  </div>
</template>
