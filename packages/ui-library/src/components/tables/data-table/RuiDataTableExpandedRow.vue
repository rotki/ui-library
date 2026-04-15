<script lang="ts" setup generic="T extends object">
import { useDataTableStyling } from '@/components/tables/data-table/context';

defineProps<{
  row: T;
  index: number;
}>();

defineSlots<{
  'expanded-item': (props: { row: T; index: number }) => any;
}>();

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr
    :class="classes.trExpandable"
    data-id="row-expanded"
  >
    <td
      :colspan="colspan"
      :class="classes.td"
    >
      <slot
        name="expanded-item"
        :row="row"
        :index="index"
      />
    </td>
  </tr>
</template>
