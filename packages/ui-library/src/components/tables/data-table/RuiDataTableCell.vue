<script lang="ts" setup generic="T extends object">
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { useDataTableColumns, useDataTableExpansion, useDataTableStyling } from '@/components/tables/data-table/context';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';

const { column } = defineProps<{
  column: TableColumn<T>;
  row: T;
  index: number;
  rowId?: T[keyof T];
}>();

defineSlots<{
  default?: (props: { column: TableColumn<T>; row: T; index: number }) => any;
}>();

const { cellValue, columnAttr } = useDataTableColumns<T>();
const { isExpanded, onToggleExpand } = useDataTableExpansion<T>();
const { isMobile } = useDataTableStyling();

const mobileLabel = computed<string>(() => {
  const label = column[columnAttr];
  return label === undefined || label === null ? '' : String(label);
});
const showMobileLabel = computed<boolean>(() => get(isMobile) && column.key !== 'expand' && get(mobileLabel).length > 0);
</script>

<template>
  <td
    :class="[
      column.tdClass,
      column.cellClass,
      isMobile ? 'flex items-start justify-between gap-4 text-right' : '',
    ]"
    :colspan="column.colspan ?? 1"
    :rowspan="column.rowspan ?? 1"
  >
    <span
      v-if="showMobileLabel"
      aria-hidden="true"
      class="shrink-0 text-left font-medium text-rui-text-secondary"
      data-id="cell-label"
    >
      {{ mobileLabel }}
    </span>
    <div :class="isMobile ? 'min-w-0 ml-auto' : 'contents'">
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
    </div>
  </td>
</template>
