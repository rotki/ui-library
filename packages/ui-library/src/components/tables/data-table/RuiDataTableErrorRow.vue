<script lang="ts" setup>
import { useDataTableStyling } from '@/components/tables/data-table/context';
import RuiTableErrorState from '@/components/tables/RuiTableErrorState.vue';

defineProps<{
  message: string;
  title: string;
  retryText: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();

defineSlots<{
  error?: () => any;
}>();

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr
    :class="classes.trEmpty"
    data-id="row-error"
  >
    <td
      :class="classes.td"
      :colspan="colspan"
    >
      <slot name="error">
        <RuiTableErrorState
          :action-text="retryText"
          :message="message"
          :title="title"
          @action="emit('retry')"
        />
      </slot>
    </td>
  </tr>
</template>
