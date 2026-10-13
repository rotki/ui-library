<script lang="ts" setup generic="T extends object">
import { useDataTableStyling } from '@/components/tables/data-table/context';

defineProps<{
  row: T;
  index: number;
}>();

defineSlots<{
  'row-append': (props: { row: T; index: number }) => any;
}>();

const { classes, colspan, isMobile } = useDataTableStyling();

/**
 * Caps the content to the table's visible width, less the cell's 16px sides, and pins it to the left
 * edge while the table scrolls sideways, as the expanded panel does: a note under a wide row stays in
 * view instead of spanning the whole scroll width. Where the table resets `--rui-table-viewport`, on
 * mobile, the calc is invalid and the width stays auto.
 */
const contentStyle = { width: 'calc(var(--rui-table-viewport) - 2rem)' };
</script>

<template>
  <!-- the cell drops the row height floor and the top padding: it reads as the end of the row above -->
  <tr data-id="row-append">
    <td
      :colspan="colspan"
      class="pt-0 pb-2 h-auto whitespace-normal"
      :class="classes.td"
    >
      <div
        :class="{ 'sticky left-4': !isMobile }"
        :style="contentStyle"
        data-id="row-append-content"
      >
        <slot
          name="row-append"
          :row="row"
          :index="index"
        />
      </div>
    </td>
  </tr>
</template>
