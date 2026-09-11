<script lang="ts" setup>
import { useDataTableStyling } from '@/components/tables/data-table/context';
import RuiTableLoadingState from '@/components/tables/RuiTableLoadingState.vue';

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr>
    <td
      :class="classes.tbodyLoader"
      :colspan="colspan"
      data-id="tbody-loader"
    >
      <RuiTableLoadingState />
    </td>
  </tr>
</template>
