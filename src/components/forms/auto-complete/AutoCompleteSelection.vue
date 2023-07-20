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

const props = withDefaults(defineProps<Props>(), {
  keyProp: 'id',
  textProp: 'text',
  itemDisabledProp: '',
  dense: false,
});

const emit = defineEmits<{ (e: 'remove', option: Option): void }>();

const css = useCssModule();
const attrs = useAttrs();

const { data, textProp, wrapperWidth } = toRefs(props);

const wrapper = ref<HTMLDivElement>();

const multiple = computed(() => Array.isArray(get(data)));

const displayValue = computed(() => {
  const value = get(data);
  if (Array.isArray(value) || !value) {
    return undefined;
  }

  return value[get(textProp)];
});

const maxChipWidth = computed(() => get(wrapperWidth) - 40); // -min input width
</script>

<template>
  <div v-if="multiple && data?.length" ref="wrapper" :class="css.wrapper">
    <div :class="css.chips_wrapper">
      <div :class="[css.chips, css[variant ?? '']]">
        <Chip
          v-for="chip in data.slice(0, 2)"
          :key="chip[keyProp]"
          :class="css.chip"
          :disabled="!!itemDisabledProp && chip[itemDisabledProp]"
          :dismissible="!!itemDisabledProp && !chip[itemDisabledProp]"
          :label="chip[textProp] ?? ''"
          :size="dense ? 'sm' : 'md'"
          @remove="emit('remove', chip)"
        />
        <div v-if="data?.length > 2" :class="css.remaining">
          <Chip
            :class="css.chip"
            :label="`+${data?.length - 2} more`"
            :size="dense ? 'sm' : 'md'"
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
    v-bind="objectOmit(attrs, ['value', 'dense'])"
  />
</template>

<style lang="scss" module>
.wrapper {
  @apply mr-2;
  max-width: calc(v-bind(maxChipWidth) * 1px);

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
  @apply inline-flex w-auto grow min-w-[5rem] #{!important};

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
