<script lang="ts" setup generic="TValue">
import type { ContextColorsType } from '@/consts/colors';
import { RuiCheckboxGroupContextKey } from '@/components/forms/checkbox/checkbox-group/context';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';

export interface Props {
  inline?: boolean;
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  required?: boolean;
}

defineOptions({
  name: 'RuiCheckboxGroup',
  inheritAttrs: false,
});

const modelValue = defineModel<TValue[]>({ default: () => [] });

const {
  inline = false,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  disabled = false,
  color,
  size,
  required = false,
} = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();

function arrayIncludes(arr: readonly TValue[], value: unknown): boolean {
  return Array.prototype.includes.call(arr, value);
}

provide(RuiCheckboxGroupContextKey, {
  isChecked: (value: unknown): boolean => arrayIncludes(get(modelValue), value),
  toggle: (value: unknown, checked: boolean): void => {
    const current = get(modelValue);
    const present = arrayIncludes(current, value);
    if (checked === present)
      return;
    if (checked)
      set(modelValue, [...current, value as TValue]);
    else
      set(modelValue, current.filter(v => v !== value));
  },
  disabled: () => disabled,
  color: () => color,
  size: () => size,
});
</script>

<template>
  <div
    role="group"
    v-bind="$attrs"
  >
    <div
      v-if="label"
      class="text-rui-text-secondary text-body-1"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-rui-error"
      >
        ﹡
      </span>
    </div>
    <div :class="{ 'flex space-x-6': inline }">
      <slot />
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
