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

const modelValue = defineModel<string>({ required: true });

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
    <label
      v-if="label"
      :class="$style.label"
    >
      {{ label }}
    </label>
    <div
      :class="[
        $style.wrapper,
        $style[color ?? ''],
        $style[variant ?? ''],
        {
          [$style.dense]: dense,
          [$style.disabled]: disabled,
          [$style['with-error']]: hasError,
          [$style['with-success']]: hasSuccess && !hasError,
          [$style[`text_${textColor}`]]: textColor && !hasMessages,
        },
      ]"
    >
      <div
        ref="innerWrapper"
        class="flex flex-1 overflow-hidden relative"
        @click="emit('focus-input', $event)"
      >
        <div
          v-if="$slots.prepend || prependIcon"
          ref="prepend"
          class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10"
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
        <Component
          :is="as"
          ref="inputRef"
          :value="modelValue"
          :placeholder="placeholder"
          :class="[
            $style.input,
            { [$style.withPrepend]: $slots.prepend || prependIcon },
            { [$style.withAppend]: $slots.append || appendIcon || showClearIcon },
          ]"
          :disabled="disabled"
          :readonly="readonly"
          :wrapper-width="width"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
          @blur="emit('blur', $event)"
          @remove="emit('remove', $event)"
        />
        <div
          v-if="$slots.append || appendIcon || showClearIcon"
          ref="append"
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10"
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
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :class="$style.details"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.label {
  @apply block text-subtitle-1 font-[400] text-rui-text mb-1;
}

.details {
  @apply mt-1 text-caption text-rui-text-secondary;
}

:global(.dark) {
  .wrapper {
    @apply bg-transparent;

    .icon {
      @apply text-white/[0.56];
    }

    &.default {
      .input {
        @apply border-b-white/[0.42];

        &:hover {
          @apply border-b-white;
        }

        &:focus {
          @apply border-b-2 border-white;
        }
      }
    }

    &.filled {
      @apply bg-white/[0.06];

      .input {
        &:hover {
          @apply bg-white/[0.09];
        }

        &:focus {
          @apply bg-white/[0.13];
        }
      }
    }

    &.outlined {
      .input {
        @apply border-white/[0.23];

        &:hover {
          @apply border-white;
        }

        &:focus {
          @apply border-2 border-white;
        }
      }
    }
  }
}

.wrapper {
  @apply relative w-full flex items-center rounded;

  .input {
    @apply leading-6 text-rui-text w-full bg-transparent py-2 px-3;
    @apply outline-0 transition-colors placeholder:text-rui-text-secondary;

    &.withPrepend {
      @apply pl-10;
    }

    &.withAppend {
      @apply pr-10;
    }

    &:disabled {
      @apply text-rui-text-disabled cursor-not-allowed border-dotted;
    }
  }

  .icon {
    @apply text-black/[0.54];
  }

  &.default {
    .input {
      @apply border-b border-black/[0.42];

      &:hover {
        @apply border-b-black;
      }

      &:focus {
        @apply border-b-2 border-black;
      }
    }
  }

  &.filled {
    @apply bg-black/[0.06];

    .input {
      @apply py-4;

      &:hover {
        @apply bg-black/[0.09];
      }

      &:focus {
        @apply bg-black/[0.13];
      }

      &:disabled {
        @apply bg-black/[0.02];
      }
    }
  }

  &.outlined {
    .input {
      @apply border border-black/[0.23] rounded;

      &:hover {
        @apply border-black;
      }

      &:focus {
        @apply border-2 border-black;
      }
    }
  }

  &.dense {
    .input {
      @apply py-1;
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      &.default .input:focus {
        @apply border-b-2 border-rui-#{$color};
      }

      &.outlined .input:focus {
        @apply border-2 border-rui-#{$color};
      }

      &:not(.disabled) .prepend svg,
      &:not(.disabled) .append svg {
        @apply text-rui-#{$color};
      }
    }

    &.text_#{$color} {
      .input {
        @apply text-rui-#{$color};
      }
    }
  }

  @each $color in 'error', 'success' {
    &.with-#{$color} {
      &.default .input {
        @apply border-b border-rui-#{$color};
      }

      &.outlined .input {
        @apply border border-rui-#{$color};
      }
    }
  }

  .input {
    &:not(:placeholder-shown),
    &:autofill,
    &:-webkit-autofill,
    &[data-has-value='true'] {
      &[readonly] {
        @apply bg-black/[0.05];
      }
    }
  }
}
</style>
