<script lang="ts" setup>
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type TablePaginationData, usePaginationNavigation } from '@/components/tables/use-pagination-navigation';
import { useTable } from '@/composables/defaults/table';
import { tv } from '@/utils/tv';

export type { TablePaginationData };

export interface Props {
  dense?: boolean;
  disablePerPage?: boolean;
  loading?: boolean;
}

const modelValue = defineModel<TablePaginationData>({ required: true });

const { dense = false, loading = false, disablePerPage = false } = defineProps<Props>();

const paginationStyles = tv({
  slots: {
    wrapper: 'relative flex flex-wrap items-center justify-end gap-x-4 gap-y-0',
    limit: 'flex items-center space-x-2 text-caption',
    ranges: 'flex items-center space-x-2 text-caption pr-2',
    sectionLabel: 'text-rui-text-secondary whitespace-nowrap py-3',
    indicator: 'text-rui-text text-caption whitespace-nowrap',
    navigation: 'flex items-center',
  },
  variants: {
    dense: {
      true: {
        wrapper: 'gap-x-2',
      },
    },
  },
});

const ui = computed<ReturnType<typeof paginationStyles>>(() => paginationStyles({ dense }));

const tableDefaults = useTable();

const {
  limits,
  currentLimit,
  ranges,
  indicatorText,
  currentRange,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onFirst,
  onLast,
} = usePaginationNavigation(modelValue, tableDefaults);
</script>

<template>
  <div :class="ui.wrapper()">
    <div
      :class="ui.limit()"
      data-id="table-pagination-limit-section"
    >
      <span :class="ui.sectionLabel()">Rows per page:</span>
      <RuiMenuSelect
        v-model="currentLimit"
        :options="limits"
        :disabled="loading || disablePerPage"
        label-class="!text-xs !min-h-8"
        name="limit"
        key-attr="limit"
        text-attr="limit"
        hide-details
        dense
        data-id="table-pagination-limit"
      />
    </div>
    <div
      :class="ui.ranges()"
      data-id="table-pagination-ranges-section"
    >
      <span :class="ui.sectionLabel()">Items #</span>
      <RuiMenuSelect
        v-if="ranges.length > 0"
        v-model="currentRange"
        :options="ranges"
        :disabled="loading"
        label-class="!text-xs !min-h-8"
        name="ranges"
        key-attr="page"
        text-attr="text"
        hide-details
        dense
        data-id="table-pagination-ranges"
      />
      <span :class="ui.indicator()">
        {{ indicatorText }}
      </span>
    </div>
    <div
      :class="ui.navigation()"
      data-id="table-pagination-navigation"
    >
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev || loading"
        variant="text"
        icon
        data-id="table-pagination-first"
        @click="onFirst()"
      >
        <RuiIcon name="lu-chevrons-left" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev || loading"
        variant="text"
        icon
        data-id="table-pagination-prev"
        @click="onPrev()"
      >
        <RuiIcon name="lu-chevron-left" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext || loading"
        variant="text"
        icon
        data-id="table-pagination-next"
        @click="onNext()"
      >
        <RuiIcon name="lu-chevron-right" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext || loading"
        variant="text"
        icon
        data-id="table-pagination-last"
        @click="onLast()"
      >
        <RuiIcon name="lu-chevrons-right" />
      </RuiButton>
    </div>
  </div>
</template>
