<script lang="ts" setup>
import { logicAnd, logicNot } from '@vueuse/math';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  color?: ContextColorsType;
  textColor?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  as?: string | object;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  prependIcon?: RuiIcons;
  appendIcon?: RuiIcons;
  readonly?: boolean;
  clearable?: boolean;
}

defineOptions({
  name: 'RuiTextField',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TextFieldProps>(), {
  label: '',
  placeholder: '',
  disabled: false,
  variant: 'default',
  color: undefined,
  textColor: undefined,
  dense: false,
  hint: '',
  as: 'input',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  prependIcon: undefined,
  appendIcon: undefined,
  readonly: false,
  clearable: false,
});

const emit = defineEmits<{
  (e: 'focus-input', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'remove', value: unknown): void;
  (e: 'clear'): void;
}>();

const modelValue = defineModel<string>({ required: true });

const {
  label,
  clearable,
  disabled,
  readonly,
  errorMessages,
  successMessages,
} = toRefs(props);

function input(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  set(modelValue, value);
}

const labelWithQuote = computed(() => {
  const labelVal = get(label);
  if (!labelVal)
    return '"\\200B"';

  return `'  ${labelVal}  '`;
});

const prepend = ref<HTMLDivElement>();
const append = ref<HTMLDivElement>();
const innerWrapper = ref<HTMLDivElement>();
const inputRef = ref();

const prependWidth = ref('0px');
const appendWidth = ref('0px');

const { width } = useElementBounding(innerWrapper);

useResizeObserver(prepend, (entries) => {
  const [entry] = entries;
  const { width, left } = entry.contentRect;
  set(prependWidth, `${width + left}px`);
});

useResizeObserver(append, (entries) => {
  const [entry] = entries;
  const { width, right } = entry.contentRect;
  set(appendWidth, `${width + right}px`);
});

const { hasError, hasSuccess, hasMessages } = useFormTextDetail(
  errorMessages,
  successMessages,
);

const { focused } = useFocus(inputRef);
const focusedDebounced = refDebounced(focused, 500);

const showClearIcon = logicAnd(
  clearable,
  modelValue,
  logicNot(disabled),
  logicNot(readonly),
);

function clearIconClicked() {
  set(modelValue, '');
  emit('clear');
}
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <div
      :class="[
        $style.wrapper,
        $style[color ?? ''],
        $style[variant ?? ''],
        {
          [$style.dense]: dense,
          [$style.disabled]: disabled,
          [$style['no-label']]: !label,
          [$style['with-error']]: hasError,
          [$style['with-success']]: hasSuccess && !hasError,
          [$style[`text_${textColor}`]]: textColor && !hasMessages,
        },
      ]"
    >
      <div
        v-if="$slots.prepend || prependIcon"
        ref="prepend"
        class="flex items-center gap-1 shrink-0"
        :class="$style.prepend"
      >
        <slot
          v-if="$slots.prepend"
          name="prepend"
        />
        <div
          v-else-if="prependIcon"
          :class="[$style.icon]"
        >
          <RuiIcon :name="prependIcon" />
        </div>
      </div>
      <div
        ref="innerWrapper"
        class="flex flex-1 overflow-hidden"
        @click="emit('focus-input', $event)"
      >
        <Component
          :is="as"
          ref="inputRef"
          :value="modelValue"
          :placeholder="placeholder || ' '"
          :class="$style.input"
          :disabled="disabled"
          :dense="dense"
          :variant="variant"
          :readonly="readonly"
          :wrapper-width="width"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
          @blur="emit('blur', $event)"
          @remove="emit('remove', $event)"
        />
        <label :class="$style.label">
          <span>
            {{ label }}
          </span>
        </label>
        <fieldset
          v-if="variant === 'outlined'"
          :class="$style.fieldset"
        >
          <legend :class="{ [$style.show]: label }" />
        </fieldset>
      </div>
      <div
        v-if="$slots.append || appendIcon || showClearIcon"
        ref="append"
        class="flex items-center gap-1 shrink-0"
        :class="$style.append"
      >
        <RuiButton
          v-if="showClearIcon"
          :class="{ hidden: !focusedDebounced }"
          variant="text"
          type="button"
          icon
          class="!p-2 clear-btn"
          color="error"
          tabindex="-1"
          @click.stop="clearIconClicked()"
        >
          <RuiIcon
            name="close-line"
            size="20"
          />
        </RuiButton>
        <slot
          v-if="$slots.append"
          name="append"
        />
        <div
          v-else-if="appendIcon"
          :class="[$style.icon]"
        >
          <RuiIcon :name="appendIcon" />
        </div>
      </div>
    </div>
    <RuiFormTextDetail
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

    &:hover {
      .label {
        @apply border-white;
      }
    }

    &.filled {
      .input {
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

      &:not(.disabled) {
        .input {
          &:hover,
          &:focus {
            ~ .fieldset {
              @apply border-white;
            }
          }
        }
      }
    }
  }
}

.wrapper {
  @apply relative w-full flex items-center pt-3;

  .input {
    @apply leading-6 text-rui-text w-full bg-transparent py-1.5 pr-3 outline-0 outline-none transition-all placeholder:opacity-0 focus:placeholder:opacity-100;

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
    @apply left-0 text-base leading-[3.75] text-rui-text-secondary pointer-events-none absolute top-0 flex h-full w-full select-none transition-all duration-75 border-b border-black/[0.42];

    --x-padding: 0px;
    --prepend-width: v-bind(prependWidth);
    --append-width: v-bind(appendWidth);

    padding-left: calc(var(--x-padding) + var(--prepend-width, 0px));
    padding-right: calc(var(--x-padding) + var(--append-width, 0px));

    span {
      @apply truncate transition-all duration-75;
      content: v-bind(labelWithQuote);
    }

    &:after {
      content: '';
      @apply absolute bottom-0 left-0 block w-full scale-x-0 border-b-2 mb-[-1px] transition-transform duration-300 border-black;
    }
  }

  &:hover {
    .label {
      @apply border-black;
    }
  }

  .icon {
    @apply text-black/[0.54];
  }

  .prepend {
    &:not(:empty) {
      @apply pr-2;
    }
  }

  .append {
    &:not(:empty) {
      @apply pl-2;
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      .input {
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
        &:not(.disabled) {
          .input {
            &:focus {
              ~ .fieldset {
                @apply border-rui-#{$color};
              }
            }
          }
        }
      }
    }

    &.text_#{$color},
    &.with-#{$color} {
      .prepend,
      .append,
      .input {
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
      .input {
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
    .input {
      @apply py-1;
    }

    .label {
      @apply leading-[3.5];
    }
  }

  &.filled,
  &.outlined {
    @apply pt-0;

    .prepend {
      &:not(:empty) {
        @apply pl-3 pr-0;
      }
    }

    .append {
      &:not(:empty) {
        @apply pr-3 pl-0;
      }
    }

    .input {
      @apply px-3;
    }

    .label {
      @apply leading-[3.5];
      --x-padding: 0.75rem;
    }
  }

  &.filled {
    .input {
      @apply py-4;

      &:focus {
        + .label {
          @apply bg-black/[0.09];
        }
      }

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        + .label {
          @apply leading-[1.5] pl-4;

          padding-left: calc(var(--x-padding));
          padding-right: calc(var(--x-padding));
        }
      }
    }

    .label {
      @apply rounded-t bg-black/[0.06];
    }

    &.dense {
      .input {
        @apply pt-5 pb-1;
      }

      .label {
        @apply leading-[3];
      }

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        + .label {
          @apply leading-[2.25];
        }
      }
    }

    &.no-label {
      .input {
        @apply py-4;
      }

      &.dense {
        .input {
          @apply py-3;
        }
      }
    }
  }

  &.outlined {
    .input {
      @apply py-4 border-b-0;

      &:not(:placeholder-shown),
      &:autofill,
      &:-webkit-autofill,
      &[data-has-value='true'],
      &:focus {
        @apply border-t-transparent;

        + .label {
          @apply leading-[0] pl-4 -mt-3;

          span {
            @apply pt-3;
          }
        }

        ~ .fieldset {
          legend {
            &.show {
              @apply px-2;
            }
            &:after {
              content: v-bind(labelWithQuote);
            }
          }
        }
      }
    }

    .fieldset {
      @apply absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0 pointer-events-none rounded border border-black/[0.23] px-2 transition-all -mt-2;

      legend {
        @apply opacity-0 text-xs max-w-full truncate;

        &:before {
          content: ' ';
        }

        &:after {
          @apply truncate max-w-full leading-[0];
          content: '\200B';
        }
      }
    }

    &:not(.disabled) {
      .input {
        &:hover,
        &:focus {
          ~ .fieldset {
            @apply border border-black;
          }
        }

        &:focus {
          ~ .fieldset {
            @apply border-2;
          }
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
      .input {
        @apply py-2;
      }

      .label {
        @apply leading-[2.5];
      }
    }
  }
}
</style>
