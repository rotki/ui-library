<script lang="ts" setup>
import { computed } from 'vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { tv } from '@/utils/tv';

export interface TableLoadingStateProps {
  /** Diameter of the spinner, in pixels. */
  size?: number | string;
  /**
   * Drops the reserved height, for a table that only has room to say a read is
   * in flight. Matches the same flag on RuiTableEmptyState, so the two states
   * do not resize the table as they swap.
   */
  compact?: boolean;
}

defineOptions({
  name: 'RuiTableLoadingState',
});

const { size = 40, compact = false } = defineProps<TableLoadingStateProps>();

const loadingStyles = tv({
  slots: {
    root: 'flex items-center justify-center',
  },
  variants: {
    compact: {
      true: { root: 'py-6' },
      false: { root: 'min-h-56 py-8' },
    },
  },
});

const ui = computed<ReturnType<typeof loadingStyles>>(() => loadingStyles({ compact }));
</script>

<template>
  <div
    :class="ui.root()"
    data-id="table-loading"
  >
    <RuiProgress
      circular
      color="primary"
      :size="size"
      variant="indeterminate"
    />
  </div>
</template>
