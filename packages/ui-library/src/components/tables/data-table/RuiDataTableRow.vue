<script lang="ts" setup generic="T extends object">
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { useDataTableColumns, useDataTableExpansion, useDataTableRowIdentity, useDataTableSelection, useDataTableStyling } from '@/components/tables/data-table/context';
import RuiDataTableCell from '@/components/tables/data-table/RuiDataTableCell.vue';
import RuiDataTableExpandedRow from '@/components/tables/data-table/RuiDataTableExpandedRow.vue';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';

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

const { classes, dense, isMobile } = useDataTableStyling();
const { cellValue, columns, itemSlotKeys } = useDataTableColumns<T>();
const { isDisabledRow, isSelected, onCheckboxClick, onSelect, selectedData } = useDataTableSelection<T>();
const { expandable, isExpanded, onToggleExpand } = useDataTableExpansion<T>();
const { getRowId, itemClass } = useDataTableRowIdentity<T>();

const rowId = computed<T[keyof T]>(() => getRowId(row));
const selected = computed<boolean>(() => isSelected(get(rowId)));
const disabled = computed<boolean>(() => isDisabledRow(get(rowId)));
const expanded = computed<boolean>(() => get(expandable) && !!slots['expanded-item'] && isExpanded(get(rowId)));
const rowClass = computed<string>(() => typeof itemClass === 'string' ? itemClass : itemClass(row));

// A column is pinned to the mobile card header when it is flagged `mobileHeader`
// (typically an action column) or when it is the auto-generated expand column.
function isMobileHeaderColumn(column: TableColumn<T>): boolean {
  return !!column.mobileHeader || column.key === 'expand';
}

// A pinned column only earns a spot in the header if it actually renders
// something: the expand toggle, a provided item slot, or a non-empty cell value.
// Without this, a pinned column with no content (e.g. an action column whose
// `#item.action` slot is not provided in a nested table) would leave an empty
// header bar with just its divider line.
function mobileHeaderColumnHasContent(column: TableColumn<T>): boolean {
  if (column.key === 'expand')
    return true;
  if (itemSlotKeys.has(column.key.toString()))
    return true;
  const value = cellValue(row, column.key);
  return value !== undefined && value !== null && value !== '';
}

// In the stacked mobile layout, header columns render in the card header row
// instead of as a label/value pair. Everything else stacks below in the body.
const mobileHeaderColumns = computed<TableColumn<T>[]>(() =>
  get(isMobile) ? get(columns).filter(column => isMobileHeaderColumn(column) && mobileHeaderColumnHasContent(column)) : [],
);
const bodyColumns = computed<TableColumn<T>[]>(() =>
  get(isMobile) ? get(columns).filter(column => !isMobileHeaderColumn(column)) : get(columns),
);
const showMobileHeader = computed<boolean>(() =>
  get(isMobile) && (!!get(selectedData) || get(mobileHeaderColumns).length > 0),
);

// `!border-y` defeats the `divide-y-0` on the mobile tbody, which otherwise
// zeroes the top/bottom border on every card except the first one. When the
// card is expanded, its bottom edge flattens so the expanded panel attaches
// flush beneath it.
const mobileCardClass = computed<string>(() => {
  const shared = 'relative flex flex-col border !border-y border-black/[0.12] dark:border-white/[0.12] overflow-hidden';
  // These bindings are not run through tailwind-merge, so avoid emitting
  // conflicting utilities (mb-0 vs mb-3, rounded-b-none vs rounded-lg): pick the
  // right one per state instead.
  return get(expanded)
    ? `${shared} rounded-t-lg mb-0`
    : `${shared} rounded-lg mb-3 last:mb-0`;
});
</script>

<template>
  <tr
    :class="[selected ? classes.trSelected : classes.tr, rowClass, isMobile ? mobileCardClass : '']"
    :aria-selected="selectedData ? selected : undefined"
    data-id="row"
  >
    <!-- Mobile card header: checkbox on the left, pinned action columns on the right -->
    <td
      v-if="showMobileHeader"
      class="flex items-center justify-between gap-2 px-4 py-2 border-b border-black/[0.12] dark:border-white/[0.12]"
      data-id="mobile-card-header"
    >
      <RuiCheckbox
        v-if="selectedData"
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
      <span v-else />

      <div
        v-if="mobileHeaderColumns.length > 0"
        class="flex items-center gap-1 min-w-0"
      >
        <template
          v-for="(column, headerIndex) in mobileHeaderColumns"
          :key="`header-${headerIndex}`"
        >
          <RuiExpandButton
            v-if="column.key === 'expand'"
            :expanded="isExpanded(rowId)"
            @click="onToggleExpand(row)"
          />
          <slot
            v-else-if="itemSlotKeys.has(column.key.toString())"
            :name="`item.${column.key.toString()}`"
            :column="column"
            :row="row"
            :index="index"
          />
          <template v-else>
            {{ cellValue(row, column.key) }}
          </template>
        </template>
      </div>
    </td>

    <!-- Desktop checkbox cell -->
    <td
      v-else-if="selectedData && !isMobile"
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
      v-for="(column, subIndex) in bodyColumns"
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
