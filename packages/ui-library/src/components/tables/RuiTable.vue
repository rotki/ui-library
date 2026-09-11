<script lang="ts" setup>
import { computed } from 'vue';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';
import RuiTableErrorState from '@/components/tables/RuiTableErrorState.vue';
import RuiTableLoadingState from '@/components/tables/RuiTableLoadingState.vue';
import { tv } from '@/utils/tv';

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

/**
 * Every rule that lands on a `th` or a `td` wraps the `&` in `:where()`, which
 * compiles to `:where(.generated-class) th` and so carries the specificity of
 * the element alone. A consumer writing `class="p-0"` on one cell is a single
 * class, which outranks that, so a one-off override needs no `!important` the
 * way a plain `[&_th]:` rule would.
 */
const tableStyles = tv({
  slots: {
    root: 'w-full overflow-y-auto',
    table: [
      'w-full',
      '[:where(&)_thead]:border-b [:where(&)_thead]:border-rui-grey-200 dark:[:where(&)_thead]:border-rui-grey-800',
      '[:where(&)_thead_th]:font-medium [:where(&)_thead_th]:text-rui-text-secondary [:where(&)_thead_th]:text-start',
      '[:where(&)_tbody_td]:border-b-0',
    ],
  },
  variants: {
    variant: {
      default: {},
      outlined: {
        root: 'border rounded-md border-rui-grey-200 dark:border-rui-grey-800',
      },
    },
    dense: {
      true: {
        table: '[:where(&)_th]:py-1 [:where(&)_th]:px-2 [:where(&)_td]:py-1 [:where(&)_td]:px-2 [:where(&)_thead_th]:text-xs',
      },
      false: {
        table: '[:where(&)_th]:py-2 [:where(&)_th]:px-4 [:where(&)_td]:py-2 [:where(&)_td]:px-4 [:where(&)_thead_th]:text-sm',
      },
    },
  },
});

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
