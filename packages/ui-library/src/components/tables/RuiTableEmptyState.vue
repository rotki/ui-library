<script lang="ts" setup>
import { useRotkiTheme } from '@/composables/theme';
import { tv } from '@/utils/tv';
import noDataPlaceholder from './table_no_data_placeholder.svg';
import noDataPlaceholderDark from './table_no_data_placeholder_dark.svg';

export interface TableEmptyStateProps {
  label?: string;
  description?: string;
  /**
   * Drops the illustration and the reserved height, for a table that only has
   * room to say the row count is zero.
   */
  compact?: boolean;
}

defineOptions({
  name: 'RuiTableEmptyState',
});

const { label, description, compact = false } = defineProps<TableEmptyStateProps>();

defineSlots<{
  description?: () => any;
}>();

const { isDark } = useRotkiTheme();

const emptyStyles = tv({
  slots: {
    root: 'flex flex-col items-center justify-center flex-1',
    title: 'text-body-1 leading-none font-bold text-center text-current pb-0 mb-0',
    subtitle: 'text-body-2 text-center text-rui-text-secondary pb-0 mb-0',
  },
  variants: {
    compact: {
      true: {
        root: 'gap-1 py-6',
        title: 'font-normal text-rui-text-secondary',
      },
      false: {
        root: 'gap-3 min-h-56 my-4',
      },
    },
  },
});

const ui = computed<ReturnType<typeof emptyStyles>>(() => emptyStyles({ compact }));
</script>

<template>
  <div :class="ui.root()">
    <img
      v-if="!compact"
      :src="isDark ? noDataPlaceholderDark : noDataPlaceholder"
      :alt="label"
      class="h-32"
    />
    <p
      v-if="label"
      :class="ui.title()"
      data-id="empty-label"
    >
      {{ label }}
    </p>
    <slot name="description">
      <p
        v-if="description"
        :class="ui.subtitle()"
        data-id="empty-description"
      >
        {{ description }}
      </p>
    </slot>
  </div>
</template>
