<script lang="ts" setup>
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import Icon from '@/components/icons/Icon.vue';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import type { ContextColorsType } from '@/consts/colors';

export interface RadioProps {
  value: string;
  modelValue?: string;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiRadio',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: '',
  disabled: false,
  color: undefined,
  size: undefined,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
}>();

const { modelValue, size, value, successMessages, errorMessages }
  = toRefs(props);

function input(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked)
    emit('update:modelValue', get(value));
}

const iconSize: ComputedRef<number> = computed(() => {
  const sizeVal = get(size);
  if (sizeVal === 'lg')
    return 28;

  if (sizeVal === 'sm')
    return 20;

  return 24;
});

const selected = computed(() => get(modelValue) === get(value));

const css = useCssModule();
const attrs = useAttrs();

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);
</script>

<template>
  <div v-bind="getRootAttrs(attrs)">
    <label
      :class="[
        css.wrapper,
        css[size ?? ''],
        {
          [css.disabled]: disabled,
        },
      ]"
    >
      <input
        :checked="selected"
        type="radio"
        :class="css.input"
        :disabled="disabled"
        v-bind="getNonRootAttrs(attrs)"
        :value="value"
        @input="input($event)"
      />
      <div
        :class="[
          css.radio,
          css[color ?? ''],
          css[size ?? ''],
          {
            [css.checked]: selected,
            [css.disabled]: disabled,
            [css['with-error']]: hasError,
            [css['with-success']]: hasSuccess && !hasError,
          },
        ]"
      >
        <Icon
          v-if="selected"
          name="radio-button-line"
          :size="iconSize"
        />
        <Icon
          v-else
          name="checkbox-blank-circle-line"
          :size="iconSize"
        />
      </div>
      <div
        :class="css.label"
        class="text-body-1"
      >
        <slot>{{ label }}</slot>
      </div>
    </label>
    <FormTextDetail
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
          @apply opacity-5;
        }
      }
    }
  }

  .radio {
    @apply relative text-rui-text-secondary p-[9px];

    &:before {
      content: '';
      @apply absolute top-1/2 left-1/2 block h-[42px] w-[42px] -translate-y-1/2 -translate-x-1/2 rounded-full opacity-0 transition-opacity;
      @apply bg-black;
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
