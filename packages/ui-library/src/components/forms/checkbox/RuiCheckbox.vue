<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { objectPick } from '@vueuse/shared';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface Props {
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
  name: 'RuiCheckbox',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const indeterminate = defineModel<boolean>('indeterminate', { default: false });

const props = withDefaults(defineProps<Props>(), {
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

const { size, errorMessages, successMessages } = toRefs(props);

const el = ref<HTMLInputElement | null>(null);

const internalModelValue = computed<boolean>({
  get: () => get(modelValue),
  set: (checked: boolean) => {
    if (checked)
      set(indeterminate, false);
    set(modelValue, checked);
  },
});

const iconSize = computed<number>(() => {
  const sizeVal = get(size);
  if (sizeVal === 'lg')
    return 28;

  if (sizeVal === 'sm')
    return 20;

  return 24;
});

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);

watch(indeterminate, (val) => {
  const input = get(el);
  if (input) {
    input.checked = !val;
    if (val)
      input.value = 'off';
    else
      input.value = 'on';
  }
});

watch(internalModelValue, (val) => {
  const input = get(el);
  if (input && input.checked !== val)
    input.checked = val;
});
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
      v-bind="objectPick($attrs, ['onClick'])"
      :data-error="hasError ? '' : undefined"
    >
      <input
        ref="el"
        v-model="internalModelValue"
        type="checkbox"
        :class="$style.input"
        :disabled="disabled"
        :aria-invalid="hasError"
        v-bind="getNonRootAttrs($attrs, ['onInput', 'onClick'])"
      />
      <span
        :class="[
          $style.checkbox,
          $style[color ?? ''],
          $style[size ?? ''],
          {
            [$style.checked]: modelValue || indeterminate,
            [$style.disabled]: disabled,
            [$style['with-error']]: hasError,
            [$style['with-success']]: hasSuccess && !hasError,
          },
        ]"
      >
        <RuiIcon
          v-if="indeterminate"
          name="lu-checkbox-indeterminate-fill"
          :size="iconSize"
        />
        <RuiIcon
          v-else-if="modelValue"
          name="lu-checkbox-fill"
          :size="iconSize"
        />
        <RuiIcon
          v-else
          name="lu-checkbox-blank"
          :size="iconSize"
        />
      </span>
      <span
        v-if="label || $slots.default"
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
      </span>
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

    .checkbox {
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
      + .checkbox {
        &:before {
          @apply opacity-15;
        }
      }
    }
  }

  .checkbox {
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
