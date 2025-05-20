<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import { fixedColumns, fixedRows } from '@/data/table-configs';
import { isExpanded, toggleRow } from '@/utils/table-utils';
import {
  type DataTableProps,
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiIcon,
  RuiTableRowExpander,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

const expandableTables = ref<{
  title: string;
  table: DataTableProps<ExtendedUser, 'id'>;
  customToggle?: boolean;
}[]>([{
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
}, {
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
}, {
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
}, {
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
}, {
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
}]);
</script>

<template>
  <div class="grid grid-cols-1 gap-12 mb-14">
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
  </div>
</template>
