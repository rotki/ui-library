<script lang="ts" setup>
import { useRotkiTheme } from '@/composables/theme';
import { emptyStyles } from './table-empty-state-styles';
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
