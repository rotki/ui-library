<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import SimpleSelect from '@/components/forms/select/SimpleSelect.vue';

export interface TablePaginationData {
  page: number;
  total: number;
  limit: number;
  limits?: number[];
}

export interface Props {
  modelValue: TablePaginationData;
  dense?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:model-value', value: TablePaginationData): void;
}>();

const { modelValue } = toRefs(props);

const css = useCssModule();

const tableDefaults = useTable();

const limits = computed(
  () => get(modelValue).limits ?? get(tableDefaults.limits),
);

const currentLimit = computed({
  get: () => get(modelValue).limit,
  set: value =>
    emit('update:model-value', {
      ...get(modelValue),
      limit: Number(value),
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

  return segments;
});

const indicatorText = computed(() => {
  const { total } = get(modelValue);
  return `${!total ? '0 ' : ''}of ${formatInteger(total)}`;
});

const currentRange = computed({
  get: () => pageRangeText(get(modelValue).page),
  set: value =>
    emit('update:model-value', {
      ...get(modelValue),
      page: get(ranges).indexOf(value) + 1,
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
      <SimpleSelect
        v-model="currentLimit"
        :options="limits"
        :disabled="loading"
        name="limit"
      />
    </div>
    <div :class="css.ranges">
      <span :class="css.ranges__text">Items #</span>
      <SimpleSelect
        v-if="ranges.length > 0"
        v-model="currentRange"
        :options="ranges"
        :disabled="loading"
        name="ranges"
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
