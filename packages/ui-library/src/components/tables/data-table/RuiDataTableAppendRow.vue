<script lang="ts" setup generic="T extends object">
import { useDataTableStyling } from '@/components/tables/data-table/context';

defineProps<{
  row: T;
  index: number;
}>();

defineSlots<{
  'row-append': (props: { row: T; index: number }) => any;
}>();

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <!--
    The cell drops the row height floor and the top padding: it reads as the end of the row above.
    Its content scrolls sideways with the row, unlike the expanded panel, which stays in view: a
    follow-up is part of the row, so its text keeps its place under the row's columns.
  -->
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
