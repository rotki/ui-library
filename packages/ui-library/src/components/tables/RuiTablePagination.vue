<script lang="ts" setup>
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { type TablePaginationData, usePaginationNavigation } from '@/components/tables/use-pagination-navigation';
import { useTable } from '@/composables/defaults/table';
import { tv } from '@/utils/tv';

export type { TablePaginationData };

export interface Props {
  dense?: boolean;
  disablePerPage?: boolean;
  loading?: boolean;
  /**
   * Maximum number of pages before the jump-to-page dropdown is replaced
   * with a numeric input. Set to `0` to always use the input, or a very
   * large number to always use the dropdown. Defaults to `500` — past that
   * materialising the full range list stalls the main thread.
   */
  rangesThreshold?: number;
}

const modelValue = defineModel<TablePaginationData>({ required: true });

const {
  dense = false,
  loading = false,
  disablePerPage = false,
  rangesThreshold = 500,
} = defineProps<Props>();

const paginationStyles = tv({
  slots: {
    wrapper: 'relative flex flex-wrap items-center justify-end gap-x-4 gap-y-0',
    limit: 'flex items-center space-x-2 text-caption',
    ranges: 'flex items-center space-x-2 text-caption pr-2',
    pageInput: 'w-14 [&_input]:text-center',
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
  pages,
  ranges,
  indicatorText,
  currentRange,
  useInputJump,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onFirst,
  onLast,
} = usePaginationNavigation(modelValue, tableDefaults, () => rangesThreshold);

const pageDraft = ref<string>(String(get(currentRange)));

watch(currentRange, (value) => {
  set(pageDraft, String(value));
});

function commitPageInput(): void {
  const parsed = Number.parseInt(get(pageDraft), 10);
  const maxPage = get(pages);
  if (!Number.isFinite(parsed) || maxPage === 0) {
    set(pageDraft, String(get(currentRange)));
    return;
  }
  const clamped = Math.min(Math.max(parsed, 1), maxPage);
  if (clamped !== get(currentRange))
    set(currentRange, clamped);
  set(pageDraft, String(clamped));
}
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
      <span :class="ui.sectionLabel()">{{ useInputJump ? 'Page' : 'Items #' }}</span>
      <RuiTextField
        v-if="useInputJump"
        v-model="pageDraft"
        :disabled="loading"
        :class="[ui.pageInput()]"
        class="[&_input]:!pr-0"
        type="number"
        min="1"
        :max="pages"
        inputmode="numeric"
        hide-details
        dense
        data-id="table-pagination-ranges-input"
        @blur="commitPageInput()"
        @keydown.enter="commitPageInput()"
      />
      <RuiMenuSelect
        v-else-if="ranges.length > 0"
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
