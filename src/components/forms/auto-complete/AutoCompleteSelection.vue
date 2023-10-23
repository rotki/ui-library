<script lang="ts" setup>
import { ComboboxInput } from '@headlessui/vue';
import { objectOmit } from '@vueuse/shared';
import Chip from '@/components/chips/Chip.vue';
import type {
  Props as AutoCompleteProps,
  ModelValue,
  Option,
} from '@/components/forms/auto-complete/AutoComplete.vue';

export interface Props
  extends Pick<
    AutoCompleteProps,
    'textProp' | 'keyProp' | 'dense' | 'itemDisabledProp' | 'variant'
  > {
  data: ModelValue;
  hasValue: boolean;
  wrapperWidth: number;
}

defineOptions({
  name: 'RuiAutoCompleteSelection',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  keyProp: 'id',
  textProp: 'text',
  itemDisabledProp: '',
  dense: false,
});

const emit = defineEmits<{
  (e: 'remove', option: Option): void;
}>();

const css = useCssModule();
const attrs = useAttrs();

const { data, textProp, wrapperWidth } = toRefs(props);

const innerWrapper = ref<HTMLDivElement>();
const more = ref<HTMLDivElement>();
const minInputWidth = ref(120);
const maxChipsToRender = ref(0);

const multiple = computed(() => Array.isArray(get(data)));

const displayValue = computed(() => {
  const value = get(data);
  if (Array.isArray(value) || !value) {
    return undefined;
  }

  return value[get(textProp)];
});

const maxInnerWidth = computed(() => get(wrapperWidth) - get(minInputWidth));

const setMaxChips = async () => {
  const value = get(data);
  // for single select or when no value is selected, no need for this computation
  if (!Array.isArray(value) || value.length === 0) {
    set(maxChipsToRender, 0);
    return;
  }

  // change in data from last computation
  const delta = value.length - get(maxChipsToRender);

  // for negative change, a selection was removed
  if (delta <= 0) {
    set(maxChipsToRender, get(maxChipsToRender) + delta);
    return;
  }

  // width for "+9999" in chip is ~61px
  const maxMore = get(useElementBounding(more).width);

  // if available space cannot contain more indicator, just show only the count
  if (get(maxInnerWidth) < maxMore) {
    set(maxChipsToRender, 0);
    set(minInputWidth, get(wrapperWidth) - maxMore);
    return;
  }

  for (let i = 0; i < delta; i++) {
    set(maxChipsToRender, get(maxChipsToRender) + 1);

    await nextTick();
    // if chips width is greater than available space, remove
    // one of the added chips, this will essentially
    // introduce the "+x" chip at the end
    if (get(useElementBounding(innerWrapper).width) > get(maxInnerWidth)) {
      set(maxChipsToRender, get(maxChipsToRender) - 1);

      // if after adding the more indicator, the width is still
      // wider than available space, we remove another chip
      await nextTick();
      if (get(useElementBounding(innerWrapper).width) > get(maxInnerWidth)) {
        set(maxChipsToRender, get(maxChipsToRender) - 1);
      }
      break;
    }
  }
};

onMounted(async () => {
  nextTick(() => {
    setMaxChips();
  }).catch();
});

watch([data, wrapperWidth], () => {
  setMaxChips();
});
</script>

<template>
  <div v-if="multiple && data?.length" ref="innerWrapper" :class="css.wrapper">
    <div :class="css.chips_wrapper">
      <div :class="[css.chips, css[variant ?? '']]">
        <Chip
          v-for="chip in data.slice(0, maxChipsToRender)"
          :key="chip[keyProp]"
          :class="css.chip"
          :disabled="!!itemDisabledProp && chip[itemDisabledProp]"
          :label="chip[textProp] ?? ''"
          :size="dense ? 'sm' : 'md'"
          dismissible
          @remove="emit('remove', chip)"
        />
        <div
          v-if="data.length > maxChipsToRender"
          ref="more"
          :class="css.remaining"
        >
          <Chip
            :class="css.chip"
            :label="`+${data.length - maxChipsToRender}`"
            :size="dense ? 'sm' : 'md'"
            color="secondary"
          />
        </div>
      </div>
    </div>
  </div>
  <ComboboxInput
    :class="[
      css.input,
      css[variant ?? ''],
      { [css.multiple]: multiple, [css.has_value]: hasValue },
    ]"
    :data-has-value="hasValue"
    :display-value="(_) => displayValue"
    v-bind="objectOmit(attrs, ['value'])"
  />
</template>

<style lang="scss" module>
.wrapper {
  @apply mr-2;

  .chips_wrapper {
    @apply relative inline-flex items-center w-full shrink-0;

    .chips {
      @apply inline-flex space-x-2 items-center ml-2;

      &.default {
        @apply ml-0.5;
      }

      &.filled {
        @apply mt-6 mb-1;
      }

      &.default,
      &.outlined {
        @apply mt-2.5 mb-1;
      }
    }
  }
}

.input {
  @apply inline-flex w-auto grow #{!important};
  min-width: calc(v-bind(minInputWidth) * 1px) !important;

  &:not(.filled) {
    @apply px-0;
  }

  &.multiple {
    &.has_value {
      @apply pb-0;
    }

    &.outlined {
      @apply pb-2 #{!important};
    }
  }
}
</style>
