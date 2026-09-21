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
   * Render a compact, touch-friendly layout: the sections spread across the
   * full width and the first/last jump buttons are dropped to save space.
   */
  mobile?: boolean;
  /**
   * Maximum number of pages before the jump-to-page dropdown is replaced
   * with a numeric input. Set to `1` to use the input whenever there is more
   * than one page, or `0` to always use the dropdown. Defaults to `500`, since
   * past that materialising the full range list stalls the main thread.
   */
  rangesThreshold?: number;
}

const modelValue = defineModel<TablePaginationData>({ required: true });

const {
  dense = false,
  loading = false,
  disablePerPage = false,
  rangesThreshold = 500,
  mobile = false,
} = defineProps<Props>();

const paginationStyles = tv({
  slots: {
    wrapper: 'relative flex flex-wrap items-center justify-end gap-x-4 gap-y-0',
    limit: 'flex items-center space-x-2 text-caption',
    ranges: 'flex items-center space-x-2 text-caption pr-2',
    pageInput: 'w-14 [&_input]:text-center [&_input]:!px-1 [&_input]:!text-xs [&_input]:!leading-5',
    sectionLabel: 'text-rui-text-secondary whitespace-nowrap py-3',
    select: '!text-xs !pl-3',
    indicator: 'text-rui-text text-caption whitespace-nowrap',
    navigation: 'flex items-center',
  },
  variants: {
    // the selects match the icon buttons, 28px with `size="sm"` and 32px without
    dense: {
      true: {
        select: '!min-h-7',
        pageInput: '[&_input]:!py-1',
      },
      false: {
        select: '!min-h-8',
        pageInput: '[&_input]:!py-1.5',
      },
    },
    mobile: {
      true: {
        wrapper: 'flex-nowrap justify-between gap-x-2 gap-y-0',
        ranges: 'pr-0',
        // sr-only rather than hidden: a display:none label names nothing
        sectionLabel: 'sr-only',
      },
    },
  },
});

const ui = computed<ReturnType<typeof paginationStyles>>(() => paginationStyles({ dense, mobile }));

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

/**
 * With every row on one page the bar stays in place, as a summary, but the
 * page jump has nowhere to go, so it disables like the arrows beside it.
 */
const singlePage = computed<boolean>(() => get(pages) <= 1);

/**
 * The rows-per-page select disables only once every option would fit all the
 * rows. Until then it stays live even on a single page: it is how a user
 * lowers a limit they raised past the row count.
 */
const everyLimitFits = computed<boolean>(() => {
  const { total } = get(modelValue);
  return get(singlePage) && get(limits).every(({ limit }) => limit >= total);
});

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

const limitId = useId();
const rangesId = useId();
</script>

<template>
  <div :class="ui.wrapper()">
    <div
      :class="ui.limit()"
      data-id="table-pagination-limit-section"
    >
      <label
        :for="limitId"
        :class="ui.sectionLabel()"
      >
        Rows per page:
      </label>
      <RuiMenuSelect
        :id="limitId"
        v-model="currentLimit"
        :options="limits"
        :disabled="loading || disablePerPage || everyLimitFits"
        :class-names="{ label: ui.select() }"
        variant="outlined"
        label=""
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
      <label
        :for="rangesId"
        :class="ui.sectionLabel({ class: useInputJump ? undefined : 'sr-only' })"
      >
        Page
      </label>
      <RuiTextField
        v-if="useInputJump"
        :id="rangesId"
        v-model="pageDraft"
        variant="outlined"
        :disabled="loading || singlePage"
        :class="[ui.pageInput()]"
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
        :id="rangesId"
        v-model="currentRange"
        :options="ranges"
        :disabled="loading || singlePage"
        :class-names="{ label: ui.select() }"
        variant="outlined"
        label=""
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
        v-if="!mobile"
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev || loading"
        variant="text"
        icon
        aria-label="First page"
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
        aria-label="Previous page"
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
        aria-label="Next page"
        data-id="table-pagination-next"
        @click="onNext()"
      >
        <RuiIcon name="lu-chevron-right" />
      </RuiButton>
      <RuiButton
        v-if="!mobile"
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext || loading"
        variant="text"
        icon
        aria-label="Last page"
        data-id="table-pagination-last"
        @click="onLast()"
      >
        <RuiIcon name="lu-chevrons-right" />
      </RuiButton>
    </div>
  </div>
</template>
