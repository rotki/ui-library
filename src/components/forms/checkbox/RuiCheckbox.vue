<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { objectPick } from '@vueuse/shared';

export interface Props {
  modelValue?: boolean;
  indeterminate?: boolean;
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
  name: 'RuiCheckbox',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
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
  (e: 'update:modelValue', modelValue: boolean): void;
  (e: 'update:indeterminate', indeterminate: boolean): void;
}>();

const { size, modelValue, indeterminate, errorMessages, successMessages } = toRefs(props);

const el = ref<HTMLInputElement | null>(null);

const internalModelValue = computed({
  get: () => get(modelValue),
  set: (checked: boolean) => {
    if (checked)
      emit('update:indeterminate', false);
    emit('update:modelValue', checked);
  },
});

const iconSize: ComputedRef<number> = computed(() => {
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
        },
      ]"
      v-bind="objectPick($attrs, ['onClick'])"
    >
      <input
        ref="el"
        v-model="internalModelValue"
        type="checkbox"
        :class="$style.input"
        :disabled="disabled"
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
          @apply opacity-5;
        }
      }
    }
  }

  .checkbox {
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
