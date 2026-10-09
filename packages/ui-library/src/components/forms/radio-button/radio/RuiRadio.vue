<script lang="ts" setup generic="TValue">
import type { ContextColorsType } from '@/consts/colors';
import { checkControlStyles } from '@/components/forms/check-control-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
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

const {
  value,
  disabled = false,
  color,
  size,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  required = false,
} = defineProps<RadioProps<TValue>>();

defineSlots<{
  default?: () => any;
}>();

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const selected = computed<boolean>(() => get(modelValue) === value);

const ui = computed<ReturnType<typeof checkControlStyles>>(() => checkControlStyles({
  size,
  shape: 'round',
  disabled,
  checked: get(selected),
  validation: get(validation),
  color: color ?? 'grey',
}));

function input(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.checked)
    set(modelValue, value);
}
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      :class="ui.wrapper()"
      :data-disabled="disabled || undefined"
      :data-checked="selected || undefined"
      :data-error="hasError ? '' : undefined"
    >
      <input
        :checked="selected"
        type="radio"
        :class="ui.input()"
        :disabled="disabled"
        :aria-invalid="hasError"
        v-bind="getNonRootAttrs($attrs)"
        :value="value"
        @input="input($event)"
      />
      <div :class="ui.control()">
        <span
          :class="ui.mark()"
          data-mark
          :data-state="selected ? 'checked' : 'unchecked'"
        >
          <span
            v-if="selected"
            :class="ui.dot()"
          />
        </span>
      </div>
      <div
        v-if="label || $slots.default"
        :class="ui.label()"
      >
        <slot>{{ label }}</slot>
        <span
          v-if="required"
          class="text-rui-error"
        >
          *
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
