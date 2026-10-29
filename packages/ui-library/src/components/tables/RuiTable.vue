<script lang="ts" setup>
import { computed } from 'vue';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';
import RuiTableErrorState from '@/components/tables/RuiTableErrorState.vue';
import RuiTableLoadingState from '@/components/tables/RuiTableLoadingState.vue';
import { tableStyles } from './table-styles';

export interface TableEmpty {
  label?: string;
  description?: string;
}

export interface Props {
  variant?: 'default' | 'outlined';
  dense?: boolean;
  /** Shows a spinner under the header while a read is in flight. */
  loading?: boolean;
  /** Why the last read failed, which takes precedence over `empty`. */
  error?: string;
  /** Heading for that failure. */
  errorTitle?: string;
  /** Label for the retry control; without one, no control is offered. */
  retryText?: string;
  /**
   * Says the table is knowingly empty. A table whose rows simply have not
   * arrived should stay `loading` instead, so the two never read alike.
   */
  empty?: TableEmpty | boolean;
}

defineOptions({
  name: 'RuiTable',
  inheritAttrs: false,
});

const {
  variant = 'outlined',
  dense = false,
  loading = false,
  error = '',
  errorTitle = '',
  retryText = '',
  empty = false,
} = defineProps<Props>();

const emit = defineEmits<{
  retry: [];
}>();

defineSlots<{
  default: () => any;
  loading?: () => any;
  error?: () => any;
  empty?: () => any;
}>();

/**
 * The three states are mutually exclusive, and a failed read outranks an empty
 * one: rows that did not arrive are not rows that are not there.
 */
const state = computed<'loading' | 'error' | 'empty' | undefined>(() => {
  if (loading)
    return 'loading';

  if (error)
    return 'error';

  if (empty)
    return 'empty';

  return undefined;
});

const emptyProps = computed<TableEmpty>(() => (typeof empty === 'object' ? empty : {}));

const ui = computed<ReturnType<typeof tableStyles>>(() => tableStyles({ dense, variant }));
</script>

<template>
  <div
    :class="ui.root()"
    v-bind="$attrs"
  >
    <table :class="ui.table()">
      <slot />
    </table>

    <slot
      v-if="state === 'loading'"
      name="loading"
    >
      <RuiTableLoadingState compact />
    </slot>

    <slot
      v-else-if="state === 'error'"
      name="error"
    >
      <RuiTableErrorState
        :action-text="retryText"
        :message="error"
        :title="errorTitle"
        @action="emit('retry')"
      />
    </slot>

    <slot
      v-else-if="state === 'empty'"
      name="empty"
    >
      <RuiTableEmptyState
        compact
        :description="emptyProps.description"
        :label="emptyProps.label"
      />
    </slot>
  </div>
</template>
