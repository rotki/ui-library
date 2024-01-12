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
  set: (value) =>
    emit('update:model-value', {
      ...get(modelValue),
      limit: Number(value),
      page: 1,
    }),
});

const pages = computed(() => {
  const { limit, total } = get(modelValue);
  if (!total) {
    return 0;
  }
  return Math.ceil(total / limit);
});

const indicatorText = computed(() => {
  const { limit, total, page } = get(modelValue);

  return `${formatInteger((page - 1) * limit + 1)}-${formatInteger(
    Math.min(page * limit, total),
  )} of ${formatInteger(total)}`;
});

const hasPrev = computed(() => get(modelValue).page > 1);
const hasNext = computed(() => get(pages) > get(modelValue).page);

const goToPage = (page: number) => {
  emit('update:model-value', {
    ...get(modelValue),
    page,
  });
};

const onNavigate = (delta: number) => {
  goToPage(get(modelValue).page + delta);
};

const onPrev = () => {
  if (!get(hasPrev)) {
    return;
  }
  onNavigate(-1);
};

const onNext = () => {
  if (!get(hasNext)) {
    return;
  }
  onNavigate(1);
};

const onFirst = () => {
  if (!get(hasPrev)) {
    return;
  }
  goToPage(1);
};

const onLast = () => {
  if (!get(hasNext)) {
    return;
  }
  goToPage(get(pages));
};
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
    <span :class="css.indicator">
      {{ indicatorText }}
    </span>
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

  .indicator {
    @apply text-rui-text text-caption px-3;
  }

  .navigation {
    @apply flex items-center pl-3;
  }
}
</style>
