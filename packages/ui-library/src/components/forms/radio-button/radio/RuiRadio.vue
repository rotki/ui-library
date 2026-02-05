<script lang="ts" setup generic='TValue'>
import type { ContextColorsType } from '@/consts/colors';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface RadioProps<TValue> {
  value: TValue;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiRadio',
  inheritAttrs: false,
});

const modelValue = defineModel<TValue>({ required: false });

const props = withDefaults(defineProps<RadioProps<TValue>>(), {
  disabled: false,
  color: undefined,
  size: undefined,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  required: false,
});

const { value, successMessages, errorMessages }
  = toRefs(props);

function input(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked)
    set(modelValue, get(value));
}

const iconSize: ComputedRef<number> = computed(() => {
  const size = props.size;
  if (size === 'lg')
    return 28;

  if (size === 'sm')
    return 20;

  return 24;
});

const selected = computed(() => get(modelValue) === get(value));

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      :class="[
        $style.wrapper,
        $style[size ?? ''],
        {
          [$style.disabled]: disabled,
          [$style['with-error']]: hasError,
        },
      ]"
      :data-error="hasError ? '' : undefined"
    >
      <input
        :checked="selected"
        type="radio"
        :class="$style.input"
        :disabled="disabled"
        :aria-invalid="hasError"
        v-bind="getNonRootAttrs($attrs)"
        :value="value"
        @input="input($event)"
      />
      <div
        :class="[
          $style.radio,
          $style[color ?? ''],
          $style[size ?? ''],
          {
            [$style.checked]: selected,
            [$style.disabled]: disabled,
            [$style['with-error']]: hasError,
            [$style['with-success']]: hasSuccess && !hasError,
          },
        ]"
      >
        <RuiIcon
          v-if="selected"
          name="lu-radio-button-fill"
          :size="iconSize"
        />
        <RuiIcon
          v-else
          name="lu-checkbox-blank-circle"
          :size="iconSize"
        />
      </div>
      <div
        :class="$style.label"
        class="text-body-1"
      >
        <slot>{{ label }}</slot>
        <span
          v-if="required"
          class="text-rui-error"
        >
          ﹡
        </span>
      </div>
    </label>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.wrapper {
  @apply relative flex items-start cursor-pointer -ml-[9px];

  &.disabled {
    @apply cursor-not-allowed;

    .radio {
      @apply opacity-50;

      &:before {
        content: none !important;
      }
    }

    .label {
      @apply text-rui-text-disabled;
    }
  }

  .input {
    @apply appearance-none w-[1px] h-[1px] absolute z-[2] outline-none select-none;

    &:focus {
      + .radio {
        &:before {
          @apply opacity-15;
        }
      }
    }
  }

  .radio {
    @apply relative text-rui-text-secondary p-[9px];

    &:before {
      content: '';
      @apply absolute top-1/2 left-1/2 block h-[42px] w-[42px] -translate-y-1/2 -translate-x-1/2 rounded-full opacity-0 transition-opacity;
      @apply bg-black dark:bg-white;
    }

    &.with-error {
      @apply text-rui-error #{!important};
    }

    &.with-success {
      @apply text-rui-success #{!important};
    }

    &:hover {
      &:before {
        @apply opacity-5;
      }
    }

    &:active {
      &:before {
        @apply opacity-30;
      }
    }

    &.lg {
      &:before {
        @apply h-[46px] w-[46px];
      }
    }

    &.sm {
      &:before {
        @apply h-[38px] w-[38px];
      }
    }

    @each $color in c.$context-colors {
      &.#{$color} {
        @apply before:bg-rui-#{$color};
        &.checked {
          @apply text-rui-#{$color};
        }
      }
    }
  }

  .label {
    @apply flex-1 text-rui-text;

    &:not(:empty) {
      @apply mt-[9px] mb-1;
    }
  }

  &.sm {
    .label {
      &:not(:empty) {
        @apply mt-[7px];
      }
    }
  }

  &.lg {
    .label {
      &:not(:empty) {
        @apply mt-[11px];
      }
    }
  }
}
</style>
