<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import MenuSelect from '@/components/forms/select/MenuSelect.vue';

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface Props {
  modelValue: TablePaginationData;
  dense?: boolean;
  disablePerPage?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  loading: false,
  disablePerPage: false,
});

const emit = defineEmits<{
  (e: 'update:model-value', value: TablePaginationData): void;
}>();

const { modelValue } = toRefs(props);

const css = useCssModule();

const tableDefaults = useTable();

const limits = computed(
  () => (get(modelValue).limits ?? get(tableDefaults.limits)).map(limit => ({ limit })),
);

const currentLimit = computed({
  get: () => ({ limit: get(modelValue).limit }),
  set: ({ limit }) =>
    emit('update:model-value', {
      ...get(modelValue),
      limit: Number(limit),
      page: 1,
    }),
});

const pages = computed(() => {
  const { limit, total } = get(modelValue);
  if (!total)
    return 0;

  return Math.ceil(total / limit);
});

const ranges = computed(() => {
  const segments = [];

  for (let i = 1; i <= get(pages); i++)
    segments.push(pageRangeText(i));

  return segments.map(page => ({ page }));
});

const indicatorText = computed(() => {
  const { total } = get(modelValue);
  return `${!total ? '0 ' : ''}of ${formatInteger(total)}`;
});

const currentRange = computed({
  get: () => ({ page: pageRangeText(get(modelValue).page) }),
  set: ({ page }) =>
    emit('update:model-value', {
      ...get(modelValue),
      page: get(ranges).findIndex(range => range.page === page) + 1,
    }),
});

const hasPrev = computed(() => get(modelValue).page > 1);
const hasNext = computed(() => get(pages) > get(modelValue).page);

function goToPage(page: number) {
  emit('update:model-value', {
    ...get(modelValue),
    page,
  });
}

function pageRangeText(page: number) {
  const { limit, total } = get(modelValue);
  return `${formatInteger((page - 1) * limit + 1)}-${formatInteger(
    Math.min(page * limit, total),
  )}`;
}

function onNavigate(delta: number) {
  goToPage(get(modelValue).page + delta);
}

function onPrev() {
  if (!get(hasPrev))
    return;

  onNavigate(-1);
}

function onNext() {
  if (!get(hasNext))
    return;

  onNavigate(1);
}

function onFirst() {
  if (!get(hasPrev))
    return;

  goToPage(1);
}

function onLast() {
  if (!get(hasNext))
    return;

  goToPage(get(pages));
}
</script>

<template>
  <div :class="css.wrapper">
    <div :class="css.limit">
      <span :class="css.limit__text">Rows per page:</span>
      <MenuSelect
        v-model="currentLimit"
        :options="limits"
        :disabled="loading || disablePerPage"
        :dense="dense"
        name="limit"
        key-attr="limit"
        text-attr="limit"
      />
    </div>
    <div :class="css.ranges">
      <span :class="css.ranges__text">Items #</span>
      <MenuSelect
        v-if="ranges.length > 0"
        v-model="currentRange"
        :options="ranges"
        :disabled="loading"
        :dense="dense"
        name="ranges"
        key-attr="page"
        text-attr="page"
      />
      <span :class="css.indicator">
        {{ indicatorText }}
      </span>
    </div>
    <div :class="css.navigation">
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev"
        variant="text"
        icon
        @click="onFirst()"
      >
        <Icon name="arrow-left-double-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasPrev"
        variant="text"
        icon
        @click="onPrev()"
      >
        <Icon name="arrow-left-s-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext"
        variant="text"
        icon
        @click="onNext()"
      >
        <Icon name="arrow-right-s-line" />
      </Button>
      <Button
        :size="dense ? 'sm' : undefined"
        :disabled="!hasNext"
        variant="text"
        icon
        @click="onLast()"
      >
        <Icon name="arrow-right-double-line" />
      </Button>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative flex flex-wrap items-center justify-end;

  .limit {
    @apply flex items-center space-x-2 text-caption px-3;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-4;
    }
  }

  .ranges {
    @apply flex items-center space-x-2 text-caption px-3;

    &__text {
      @apply text-rui-text-secondary whitespace-nowrap py-4;
    }
  }

  .indicator {
    @apply text-rui-text text-caption;
  }

  .navigation {
    @apply flex items-center pl-3;
  }
}
</style>
