<script lang="ts" setup>
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { useDataTableStyling } from '@/components/tables/data-table/context';

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr>
    <td
      :class="classes.tbodyLoader"
      :colspan="colspan"
      data-id="tbody-loader"
    >
      <div :class="classes.tbodyLoaderContent">
        <RuiProgress
          color="primary"
          variant="indeterminate"
          circular
        />
      </div>
    </td>
  </tr>
</template>
