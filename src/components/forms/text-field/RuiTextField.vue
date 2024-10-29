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
  variant?: 'default' | 'filled';
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
  required?: boolean;
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
  color: 'primary',
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
  required: false,
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
  required,
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
      <span
        v-if="required"
        class="text-rui-error"
      >
        *
      </span>
    </label>
    <div
      :class="[
        $style.wrapper,
        $style[color ?? 'primary'],
        {
          [$style.filled]: variant === 'filled',
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
          :required="required"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
          @blur="emit('blur', $event)"
          @remove="emit('remove', $event)"
        />
        <div
          v-if="$slots.append || appendIcon || showClearIcon"
          ref="append"
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
          :class="$style.append"
        >
          <RuiButton
            v-if="showClearIcon"
            :class="{ hidden: !focusedDebounced }"
            variant="text"
            type="button"
            icon
            class="!p-1 clear-btn"
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
  @apply block text-sm font-medium text-rui-text mb-1.5 leading-5;
}

.details {
  @apply mt-1 text-xs text-rui-text-secondary;
}

.wrapper {
  @apply relative w-full flex items-center rounded-md;

  .input {
    @apply leading-5 text-rui-text w-full bg-transparent py-2 px-3;
    @apply text-[13px] font-normal rounded-md;
    @apply box-border;
    @apply border border-rui-text-disabled;
    @apply outline-none ring-0;
    &::placeholder {
      @apply text-rui-text-disabled font-light;
    }

    &:focus {
      @apply border-2 border-rui-primary;
      @apply py-[7px] px-[11px];
      @apply outline-none ring-0;
    }

    &.withPrepend {
      @apply pl-8;
      &:focus {
        @apply pl-[31px];
      }
    }

    &.withAppend {
      @apply pr-10;
      &:focus {
        @apply pr-[39px];
      }
    }
  }

  &:not(.disabled):hover .input {
    @apply border-rui-primary;
  }

  .icon {
    @apply text-rui-text-disabled;

    svg {
      @apply w-4 h-4;
    }
  }

  .prepend {
    @apply left-2;
  }

  &.filled {
    @apply bg-black bg-opacity-[0.06];

    .input {
      @apply border-0;

      &:focus {
        @apply border-2 border-rui-primary;
      }
    }
  }

  &.disabled {
    .input {
      @apply text-rui-text-disabled cursor-not-allowed;
      @apply border-dotted;
      @apply bg-black bg-opacity-[0.02];

      &::placeholder {
        @apply text-rui-text-disabled;
      }
    }

    .icon {
      @apply opacity-50;
    }
  }

  &.dense {
    .input {
      @apply py-1.5;
      &:focus {
        @apply py-[5px];
      }
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      &:not(.disabled) {
        &:hover .input {
          @apply border-rui-#{$color};
        }

        .input:focus {
          @apply border-2 border-rui-#{$color};
        }
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
      .input {
        @apply border-rui-#{$color} #{!important};

        &:focus {
          @apply border-2;
        }

        ~ div .icon {
          @apply text-rui-#{$color};
        }
      }
    }
  }

  &.readonly {
    .input {
      @apply bg-black bg-opacity-[0.05] cursor-default;
    }
  }
}

:global(.dark) {
  .wrapper {
    @apply bg-transparent;

    .icon {
      @apply text-white opacity-60;
    }

    .input {
      @apply border-white border-opacity-25;

      &::placeholder {
        @apply text-rui-text-disabled font-light;
      }

      &:focus {
        @apply border-2 border-rui-primary;
      }
    }

    &.filled {
      @apply bg-white bg-opacity-[0.06];
    }

    &:not(.disabled):hover .input {
      @apply border-rui-primary;
    }

    &.disabled {
      .input {
        @apply border-white border-opacity-25 border-dotted;
      }
    }

    @each $color in c.$context-colors {
      &.#{$color} {
        &:not(.disabled) {
          &:hover .input {
            @apply border-rui-#{$color};
          }

          .input:focus {
            @apply border-2 border-rui-#{$color};
          }
        }
      }
    }
  }
}
</style>
