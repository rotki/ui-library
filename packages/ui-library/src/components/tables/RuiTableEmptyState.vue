<script lang="ts" setup>
import { useRotkiTheme } from '@/composables/theme';
import { tv } from '@/utils/tv';
import noDataPlaceholder from './table_no_data_placeholder.svg';
import noDataPlaceholderDark from './table_no_data_placeholder_dark.svg';

export interface TableEmptyStateProps {
  label?: string;
  description?: string;
}

defineOptions({
  name: 'RuiTableEmptyState',
});

const { label, description } = defineProps<TableEmptyStateProps>();

defineSlots<{
  description?: () => any;
}>();

const { isDark } = useRotkiTheme();

const emptyStyles = tv({
  slots: {
    root: 'flex flex-col gap-3 items-center justify-center flex-1 min-h-56 my-4',
    title: 'text-body-1 leading-none font-bold text-center text-current pb-0 mb-0',
    subtitle: 'text-body-2 text-center text-rui-text-secondary pb-0 mb-0',
  },
});

const ui = emptyStyles();
</script>

<template>
  <div :class="ui.root()">
    <img
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
