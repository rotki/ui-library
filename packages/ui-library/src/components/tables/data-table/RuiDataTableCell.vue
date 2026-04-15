<script lang="ts" setup generic="T extends object">
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { useDataTableColumns, useDataTableExpansion } from '@/components/tables/data-table/context';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';

defineProps<{
  column: TableColumn<T>;
  row: T;
  index: number;
  rowId?: T[keyof T];
}>();

defineSlots<{
  default?: (props: { column: TableColumn<T>; row: T; index: number }) => any;
}>();

const { cellValue } = useDataTableColumns<T>();
const { isExpanded, onToggleExpand } = useDataTableExpansion<T>();
</script>

<template>
  <td
    :class="[
      column.tdClass,
      column.cellClass,
    ]"
    :colspan="column.colspan ?? 1"
    :rowspan="column.rowspan ?? 1"
  >
    <slot
      :column="column"
      :row="row"
      :index="index"
    >
      <RuiExpandButton
        v-if="column.key === 'expand'"
        :expanded="rowId !== undefined && isExpanded(rowId)"
        @click="onToggleExpand(row)"
      />
      <template v-else>
        {{ cellValue(row, column.key) }}
      </template>
    </slot>
  </td>
</template>
