<script lang="ts" setup>
import { computed } from 'vue';
import { tv } from '@/utils/tv';

export interface Props {
  variant?: 'default' | 'outlined';
  dense?: boolean;
}

defineOptions({
  name: 'RuiTable',
  inheritAttrs: false,
});

const { variant = 'outlined', dense = false } = defineProps<Props>();

defineSlots<{
  default: () => any;
}>();

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
  </div>
</template>
