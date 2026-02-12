<script lang="ts" setup>
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { useTable } from '@/composables/defaults/table';
import { formatInteger } from '@/utils/helpers';

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface Props {
  dense?: boolean;
  disablePerPage?: boolean;
  loading?: boolean;
}

const modelValue = defineModel<TablePaginationData>({ required: true });

const { dense = false, loading = false, disablePerPage = false } = defineProps<Props>();

const tableDefaults = useTable();

const limits = computed<{ limit: number }[]>(() =>
  (get(modelValue).limits ?? get(tableDefaults.limits)).map(limit => ({ limit })),
);

const currentLimit = computed<number>({
  get: () => get(modelValue).limit,
  set: limit =>
    set(modelValue, {
      ...get(modelValue),
      limit: Number(limit),
      page: 1,
    }),
});

const pages = computed<number>(() => {
  const { limit, total } = get(modelValue);
  if (!total)
    return 0;

  return Math.ceil(total / limit);
});

const ranges = computed<{ page: number; text: string }[]>(() => {
  const segments = [];

  for (let page = 1; page <= get(pages); page++) segments.push({ page, text: pageRangeText(page) });

  return segments;
});

const indicatorText = computed<string>(() => {
  const { total } = get(modelValue);
  return `${!total ? '0 ' : ''}of ${formatInteger(total)}`;
});

const currentRange = computed<number>({
  get: () => get(modelValue).page,
  set: page =>
    set(modelValue, {
      ...get(modelValue),
      page,
    }),
});

const hasPrev = computed<boolean>(() => get(modelValue).page > 1);
const hasNext = computed<boolean>(() => get(pages) > get(modelValue).page);

function goToPage(page: number): void {
  set(modelValue, {
    ...get(modelValue),
    page,
  });
}

function pageRangeText(page: number): string {
  const { limit, total } = get(modelValue);
  return `${formatInteger((page - 1) * limit + 1)} - ${formatInteger(
    Math.min(page * limit, total),
  )}`;
}

function onNavigate(delta: number): void {
  goToPage(get(modelValue).page + delta);
}

function onPrev(): void {
  if (!get(hasPrev))
    return;

  onNavigate(-1);
}

function onNext(): void {
  if (!get(hasNext))
    return;

  onNavigate(1);
}

function onFirst(): void {
  if (!get(hasPrev))
    return;

  goToPage(1);
}

function onLast(): void {
  if (!get(hasNext))
    return;

  goToPage(get(pages));
}
</script>

<template>
  <div :class="[$style.wrapper, { [$style['wrapper-dense'] ?? '']: dense }]">
    <div :class="$style.limit">
      <span :class="$style.limit__text">Rows per page:</span>
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
        data-cy="table-pagination-limit"
      />
    </div>
    <div :class="$style.ranges">
      <span :class="$style.ranges__text">Items #</span>
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
        data-cy="table-pagination-ranges"
      />
      <span :class="$style.indicator">
        {{ indicatorText }}
      </span>
    </div>
    <div
      :class="$style.navigation"
      data-cy="table-pagination-navigation"
    >
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev || loading"
        variant="text"
        icon
        data-cy="table-pagination-first"
        @click="onFirst()"
      >
        <RuiIcon name="lu-chevrons-left" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev || loading"
        variant="text"
        icon
        data-cy="table-pagination-prev"
        @click="onPrev()"
      >
        <RuiIcon name="lu-chevron-left" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext || loading"
        variant="text"
        icon
        data-cy="table-pagination-next"
        @click="onNext()"
      >
        <RuiIcon name="lu-chevron-right" />
      </RuiButton>
      <RuiButton
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext || loading"
        variant="text"
        icon
        data-cy="table-pagination-last"
        @click="onLast()"
      >
        <RuiIcon name="lu-chevrons-right" />
      </RuiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative flex flex-wrap items-center justify-end gap-x-4 gap-y-0;

  .limit {
    @apply flex items-center space-x-2 text-caption;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-3;
    }
  }

  .ranges {
    @apply flex items-center space-x-2 text-caption pr-2;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-3;
    }
  }

  .indicator {
    @apply text-rui-text text-caption whitespace-nowrap;
  }

  .navigation {
    @apply flex items-center;
  }

  &-dense {
    @apply gap-x-2;
  }
}
</style>
