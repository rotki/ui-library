<script lang="ts" setup>
import { useDataTableStyling } from '@/components/tables/data-table/context';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';

defineProps<{
  empty: { label?: string; description?: string };
}>();

defineSlots<{
  'no-data'?: () => any;
  'empty-description'?: () => any;
}>();

const { classes, colspan } = useDataTableStyling();
</script>

<template>
  <tr
    :class="classes.trEmpty"
    data-id="row-empty"
  >
    <Transition
      appear
      enter-active-class="transition ease-out duration-200 delay-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <td
        :class="classes.td"
        :colspan="colspan"
      >
        <slot name="no-data">
          <RuiTableEmptyState
            :label="empty.label"
            :description="empty.description"
          >
            <template
              v-if="$slots['empty-description']"
              #description
            >
              <slot name="empty-description" />
            </template>
          </RuiTableEmptyState>
        </slot>
      </td>
    </Transition>
  </tr>
</template>
