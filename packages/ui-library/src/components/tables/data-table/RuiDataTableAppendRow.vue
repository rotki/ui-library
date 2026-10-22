<script lang="ts" setup generic="T extends object">
import { useDataTableStyling } from '@/components/tables/data-table/context';

defineProps<{
  row: T;
  index: number;
}>();

defineSlots<{
  'row-append': (props: { row: T; index: number }) => any;
}>();

/*
 * No row height floor or top padding: the cell reads as the end of the row above. Unlike the
 * expanded panel, which stays in view, its content scrolls sideways with the row, keeping its
 * text under the row's columns.
 */
const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr data-id="row-append">
    <td
      :colspan="colspan"
      class="pt-0 pb-2 h-auto whitespace-normal"
      :class="classes.td"
    >
      <div data-id="row-append-content">
        <slot
          name="row-append"
          :row="row"
          :index="index"
        />
      </div>
    </td>
  </tr>
</template>
