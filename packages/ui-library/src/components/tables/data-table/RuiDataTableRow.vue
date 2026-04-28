<script lang="ts" setup generic="T extends object">
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { useDataTableColumns, useDataTableExpansion, useDataTableRowIdentity, useDataTableSelection, useDataTableStyling } from '@/components/tables/data-table/context';
import RuiDataTableCell from '@/components/tables/data-table/RuiDataTableCell.vue';
import RuiDataTableExpandedRow from '@/components/tables/data-table/RuiDataTableExpandedRow.vue';

const {
  row,
  index,
} = defineProps<{
  row: T;
  index: number;
}>();

const slots = defineSlots<Partial<
  Record<`item.${string}`, (props: { column: TableColumn<T>; row: T; index: number }) => any> & {
    'expanded-item'?: (props: { row: T; index: number }) => any;
  }
>>();

const { classes, dense } = useDataTableStyling();
const { columns, itemSlotKeys } = useDataTableColumns<T>();
const { isDisabledRow, isSelected, onCheckboxClick, onSelect, selectedData } = useDataTableSelection<T>();
const { expandable, isExpanded } = useDataTableExpansion<T>();
const { getRowId, itemClass } = useDataTableRowIdentity<T>();

const rowId = computed<T[keyof T]>(() => getRowId(row));
const selected = computed<boolean>(() => isSelected(get(rowId)));
const disabled = computed<boolean>(() => isDisabledRow(get(rowId)));
const expanded = computed<boolean>(() => get(expandable) && isExpanded(get(rowId)));
const rowClass = computed<string>(() => typeof itemClass === 'string' ? itemClass : itemClass(row));
</script>

<template>
  <tr
    :class="[selected ? classes.trSelected : classes.tr, rowClass]"
    :aria-selected="selectedData ? selected : undefined"
    data-id="row"
  >
    <td
      v-if="selectedData"
      :class="classes.checkbox"
      colspan="1"
      rowspan="1"
    >
      <RuiCheckbox
        :data-id="`table-toggle-check-${index}`"
        :model-value="selected"
        :disabled="disabled"
        :size="dense ? 'sm' : undefined"
        color="primary"
        class="select-none"
        hide-details
        @update:model-value="onSelect($event, rowId, true)"
        @click="onCheckboxClick($event, rowId, index)"
      />
    </td>

    <RuiDataTableCell
      v-for="(column, subIndex) in columns"
      :key="subIndex"
      :column="column"
      :row="row"
      :index="index"
      :row-id="rowId"
    >
      <template
        v-if="itemSlotKeys.has(column.key.toString())"
        #default="slotData"
      >
        <slot
          :name="`item.${column.key.toString()}`"
          v-bind="slotData"
        />
      </template>
    </RuiDataTableCell>
  </tr>

  <RuiDataTableExpandedRow
    v-if="expanded"
    :row="row"
    :index="index"
  >
    <template
      v-if="slots['expanded-item']"
      #expanded-item="slotData"
    >
      <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
      <slot
        name="expanded-item"
        v-bind="slotData"
      />
    </template>
  </RuiDataTableExpandedRow>
</template>
