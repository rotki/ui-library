<script lang="ts" setup>
import { objectOmit } from '@vueuse/shared';
import { logicAnd, logicNot } from '@vueuse/math';
import { type ContextColorsType } from '@/consts/colors';
import RuiIcon from '@/components/icons/Icon.vue';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import { type RuiIcons } from '~/src';

export interface Props {
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  color?: ContextColorsType;
  textColor?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  prependOuterIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
  noResize?: boolean;
  minRows?: number | string;
  maxRows?: number | string;
  rowHeight?: number | string;
  autoGrow?: boolean;
}

defineOptions({
  name: 'RuiTextArea',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  value: '',
  label: '',
  placeholder: '',
  disabled: false,
  variant: 'default',
  color: undefined,
  textColor: undefined,
  dense: false,
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  prependIcon: undefined,
  prependOuterIcon: undefined,
  appendIcon: undefined,
  readonly: false,
  clearable: false,
  noResize: false,
  minRows: 2,
  rowHeight: 1.5, // in rems
  maxRows: undefined,
  autoGrow: false,
});

const emit = defineEmits<{
  (e: 'input', modelValue: string): void;
  (e: 'click:clear'): void;
}>();

const {
  label,
  value,
  autoGrow,
  clearable,
  disabled,
  readonly,
  minRows,
  maxRows,
  noResize,
  rowHeight,
  errorMessages,
  successMessages,
} = toRefs(props);

const prepend = ref<HTMLDivElement>();
const append = ref<HTMLDivElement>();
const textarea = ref<HTMLTextAreaElement>();
const textareaSizer = ref<HTMLTextAreaElement>();
const focusedDebounced = ref(false);

const labelWithQuote = computed(() => {
  const labelVal = get(label);
  if (!labelVal) {
    return '"\\200B"';
  }
  return `'  ${get(label)}  '`;
});

const fieldStyles = computed(() => {
  const height = Number(get(rowHeight));
  const min = Number(get(minRows));
  const max = Number(get(maxRows));
  const value: { minHeight: string; maxHeight?: string } = {
    minHeight: `${min * height + 0.75}rem`,
  };
  if (max) {
    value.maxHeight = `${max * height + 0.75}rem`;
  }
  return value;
});

const internalValue = computed({
  get: () => get(value),
  set: (val: string) => emit('input', val),
});

const prependWidth = computed(() => {
  const width = get(useElementBounding(prepend).width);
  if (!width) {
    return '0rem';
  }
  return `${(width + 24) / 16}rem`;
});

const appendWidth = computed(() => {
  const width = get(useElementBounding(append).width);
  if (!width) {
    return '0rem';
  }
  return `${(width + 24) / 16}rem`;
});

const colorClass = computed(() => (props.color ? css[props.color] : undefined));

const showClearIcon = logicAnd(
  clearable,
  internalValue,
  logicNot(disabled),
  logicNot(readonly),
);

const { hasError, hasSuccess, hasMessages } = useFormTextDetail(
  errorMessages,
  successMessages,
);

const css = useCssModule();
const attrs = useAttrs();
const slots = useSlots();

const clearIconClicked = () => {
  set(internalValue, '');
  emit('click:clear');
};

const computeFieldHeight = (newVal?: string, oldVal?: string) => {
  if (!get(autoGrow)) {
    return;
  }
  const field = get(textarea);
  const fieldValue = newVal ?? get(value);
  const fieldSizer = get(textareaSizer);
  if (!(field && fieldSizer)) {
    return;
  }
  nextTick(() => {
    field.style.minHeight = get(fieldStyles).minHeight;
    const sizerHeight = fieldSizer.scrollHeight;
    const fieldHeight = field.scrollHeight;
    let height = `${Math.max(sizerHeight, fieldHeight) / 16}rem`;
    if (oldVal && oldVal.length > fieldValue.length) {
      height = `${Math.min(sizerHeight, fieldHeight) / 16}rem`;
    }
    field.style.height = height;
  });
};

const { focused } = useFocus(textarea);

watchDebounced(
  focused,
  (focused) => {
    set(focusedDebounced, focused);
  },
  { debounce: 500 },
);

watch(value, computeFieldHeight);
onMounted(computeFieldHeight);
</script>

<template>
  <div>
    <div
      :class="[
        css.wrapper,
        colorClass,
        css[variant],
        {
          [css.dense]: dense,
          [css.disabled]: disabled,
          [css['no-label']]: !label,
          [css['with-error']]: hasError,
          [css['with-success']]: hasSuccess && !hasError,
          [css[`text_${textColor}`]]: textColor && !hasMessages,
        },
      ]"
    >
      <div
        v-if="slots.prepend || prependIcon"
        ref="prepend"
        class="flex items-center gap-1 shrink-0"
        :class="css.prepend"
      >
        <div v-if="slots.prepend">
          <slot name="prepend" />
        </div>
        <div v-else-if="prependIcon" :class="[css.icon]">
          <RuiIcon :name="prependIcon" />
        </div>
      </div>
      <div :class="css.inner_wrapper">
        <textarea
          v-if="autoGrow"
          ref="textareaSizer"
          :value="internalValue"
          :class="[css.textarea_sizer]"
          :style="fieldStyles"
          aria-hidden="true"
          disabled
          readonly
        />
        <textarea
          ref="textarea"
          v-model="internalValue"
          :placeholder="placeholder || ' '"
          :class="[css.textarea, noResize ? 'resize-none' : 'resize-y']"
          :style="fieldStyles"
          :disabled="disabled"
          :readonly="readonly"
          v-bind="objectOmit(attrs, ['class'])"
        />
        <label :class="css.label">
          {{ label }}
        </label>
        <fieldset v-if="variant === 'outlined'" :class="css.fieldset">
          <legend />
        </fieldset>
      </div>
      <div
        v-if="slots.append || appendIcon || showClearIcon"
        ref="append"
        class="flex items-center gap-1 shrink-0"
        :class="css.append"
      >
        <RuiButton
          v-if="showClearIcon"
          :class="{ hidden: !focusedDebounced }"
          variant="text"
          type="button"
          icon
          class="!p-2"
          :color="color"
          @click="clearIconClicked()"
        >
          <RuiIcon name="close-line" size="20" />
        </RuiButton>
        <div v-if="slots.append">
          <slot name="append" />
        </div>
        <div v-else-if="appendIcon" :class="[css.icon]">
          <RuiIcon :name="appendIcon" />
        </div>
      </div>
    </div>
    <FormTextDetail
      v-if="!hideDetails"
      class="pt-1 px-3"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;
:global(.dark) {
  .wrapper {
    .label {
      @apply border-white/[0.42];
      &:after {
        @apply border-white;
      }
    }
    .icon {
      @apply text-white/[0.56];
    }
    &.filled {
      .textarea {
        &:focus {
          + .label {
            @apply bg-white/[0.13];
          }
        }
      }
      .label {
        @apply bg-white/[0.09];
      }
    }
    &.outlined {
      .fieldset {
        @apply border-white/[0.23];
      }
      .textarea {
        &:focus {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }
}
.wrapper {
  @apply relative w-full min-w-[12.5rem] flex items-start;
  .inner_wrapper {
    @apply flex flex-1 pt-4;
  }
  .append {
    @apply absolute right-0;
  }
  .textarea {
    @apply leading-6 text-rui-text w-full bg-transparent pb-2 pt-0;
    @apply outline-0 outline-none placeholder:opacity-0 focus:placeholder:opacity-100;
    --x-padding: 0.75rem;
    padding-right: calc(var(--x-padding) + v-bind(appendWidth)) !important;
    &_sizer {
      @apply invisible absolute top-0 left-0 w-full h-0 -z-10 pointer-events-none py-2 px-3 #{!important};
      padding-right: calc(var(--x-padding) + v-bind(appendWidth)) !important;
    }
    &:focus {
      @apply outline-0;
      + .label {
        @apply after:scale-x-100;
      }
    }
    &:not(:placeholder-shown),
    &:autofill,
    &:-webkit-autofill,
    &[data-has-value='true'],
    &:focus {
      + .label {
        @apply text-xs leading-tight;
        padding-left: var(--x-padding);
        padding-right: var(--x-padding);
      }
    }
    &:disabled {
      @apply border-dotted;
      &,
      + .label {
        @apply text-rui-text-disabled;
      }
      ~ .fieldset {
        @apply border-dotted;
      }
    }
  }
  .label {
    @apply left-0 text-base leading-[3.2] text-rui-text-secondary pointer-events-none absolute top-0 flex h-full w-full select-none transition-all border-b border-black/[0.42];
    --x-padding: 0rem;
    padding-left: calc(var(--x-padding) + v-bind(prependWidth));
    padding-right: calc(var(--x-padding) + v-bind(appendWidth));
    &:after {
      content: '';
      @apply absolute bottom-0 left-0 block w-full scale-x-0 border-b-2 mb-[-1px] transition-transform duration-300 border-black;
    }
  }
  .icon {
    @apply text-black/[0.54];
  }
  .prepend,
  .append {
    @apply mt-4 mx-3;
    .textarea {
      --x-padding: 0rem;
    }
  }
  @each $color in c.$context-colors {
    &.#{$color} {
      .textarea {
        &:focus {
          + .label {
            @apply text-rui-#{$color};
          }
        }
      }
      .label {
        @apply after:border-rui-#{$color};
      }
      &.outlined {
        .textarea {
          &:focus {
            ~ .fieldset {
              @apply border-rui-#{$color};
            }
          }
        }
      }
    }
    &.text_#{$color},
    &.with-#{$color} {
      .prepend,
      .append,
      .textarea {
        @apply text-rui-#{$color};
      }
      &:not(.disabled) .prepend svg,
      &:not(.disabled) .append svg {
        @apply text-rui-#{$color};
      }
    }
  }
  @each $color in 'error', 'success' {
    &.with-#{$color} {
      .textarea {
        @apply border-rui-#{$color} #{!important};
      }
      .label {
        @apply text-rui-#{$color} after:border-rui-#{$color} #{!important};
      }
      .fieldset {
        @apply border-rui-#{$color} #{!important};
      }
    }
  }
  &.dense {
    .inner_wrapper {
      @apply pt-2;
      .textarea {
        @apply py-1;
        &_sizer {
          @apply py-1;
        }
      }
    }
  }
  &.filled,
  &.outlined {
    .textarea {
      @apply px-3;
    }
    .prepend {
      @apply mr-0;
      + .inner_wrapper .textarea {
        &:not(:placeholder-shown),
        &:autofill,
        &:-webkit-autofill,
        &[data-has-value='true'],
        &:focus {
          + .label {
            --x-padding: 0.75rem;
          }
        }
      }
    }
    .append {
      @apply ml-0;
    }
    .prepend,
    .append {
      + .inner_wrapper > .label {
        --x-padding: 0rem;
      }
    }
    .label {
      --x-padding: 0.75rem;
    }
  }
  &.filled {
    .label {
      @apply rounded-t bg-black/[0.06];
    }
    &.no-label {
      .textarea {
        @apply py-4;
        &_sizer {
          @apply py-4;
        }
      }
      &.dense {
        .textarea {
          @apply py-3;
        }
      }
    }
  }
  &.outlined {
    .textarea {
      &:focus {
        ~ .fieldset {
          @apply border-2 border-black;
        }
      }
      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        @apply border-t-transparent;
        + .label {
          @apply leading-[0] pl-4;
        }
        ~ .fieldset {
          legend {
            &:after {
              content: v-bind(labelWithQuote);
            }
          }
        }
      }
    }
    .fieldset {
      @apply absolute w-full h-[calc(100%+0.5rem)] top-0 left-0 pointer-events-none rounded border border-black/[0.23] px-2 transition-all -mt-2;
      legend {
        @apply opacity-0 text-xs;
        &:after {
          @apply whitespace-break-spaces;
          content: '\200B';
        }
      }
    }
    .label {
      @apply border-0 border-transparent;
      &:after {
        content: none !important;
      }
    }
    &.dense {
      .label {
        @apply leading-[2.5];
      }
    }
  }
}
</style>
