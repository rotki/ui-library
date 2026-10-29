<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { type FormDetails, useFormDetails, useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { switchStyles } from './switch-styles';

export interface Props {
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  /** The line under the control for its hint and messages: `reserve`, `auto` or `hidden`; falls back to the nearest `RuiFieldDefaults`, then the app default, then `reserve`. */
  details?: FormDetails;
  /** @deprecated Use `details="hidden"`. Removed in 4.0. */
  hideDetails?: boolean;
  /** Puts the hint or message under the label text instead of under the track, so a list of switches keeps one text column. */
  detailsUnderLabel?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiSwitch',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const {
  disabled = false,
  color = undefined,
  size = undefined,
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  details = undefined,
  hideDetails = false,
  detailsUnderLabel = false,
  required = false,
} = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);
const detailsMode = useFormDetails(() => details, () => hideDetails);

const ui = computed<ReturnType<typeof switchStyles>>(() => switchStyles({
  checked: get(modelValue),
  disabled,
  size,
  validation: get(validation),
  color,
  underLabel: detailsUnderLabel,
}));

function input(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLInputElement)
    set(modelValue, target.checked);
}
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      :class="ui.wrapper()"
      :data-disabled="disabled || undefined"
      :data-checked="modelValue || undefined"
      :data-error="hasError ? '' : undefined"
    >
      <div :class="ui.inner()">
        <input
          :checked="modelValue"
          type="checkbox"
          :class="ui.input()"
          :disabled="disabled"
          :aria-invalid="hasError"
          v-bind="getNonRootAttrs($attrs)"
          @input="input($event)"
        />
        <div :class="ui.toggle()" />
      </div>
      <span
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
      </span>
    </label>
    <RuiFormTextDetail
      v-if="detailsMode !== 'hidden'"
      :class="ui.details()"
      :details="detailsMode"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
