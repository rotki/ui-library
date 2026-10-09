<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { tv } from '@/utils/tv';

export interface Props {
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
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
  hideDetails = false,
  required = false,
} = defineProps<Props>();

defineSlots<{
  default?: () => any;
}>();

const switchStyles = tv({
  slots: {
    wrapper: 'relative flex gap-2 items-start cursor-pointer group/switch',
    // 40 × 22, nudged down a pixel to sit centred on the label's 24px line
    inner: 'relative w-10 h-5.5 mt-px shrink-0',
    input: 'peer appearance-none relative w-full h-full rounded-full bg-rui-neutral-300 dark:bg-rui-neutral-700 transition-all duration-75 ease-in-out cursor-pointer focus-visible:focus-ring',
    toggle: [
      'absolute size-4.5 transition-all duration-75 ease-in-out -translate-y-1/2 top-1/2 rounded-full pointer-events-none',
      'bg-white left-0.5 shadow-rui-control',
    ].join(' '),
    label: 'text-rui-text text-sm/6',
  },
  variants: {
    checked: {
      true: {
        toggle: 'left-5',
      },
      false: {},
    },
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
        input: 'bg-rui-neutral-200! dark:bg-rui-neutral-800! cursor-not-allowed',
        toggle: 'bg-rui-neutral-50! dark:bg-rui-neutral-600! shadow-none!',
        label: 'text-rui-text-disabled',
      },
    },
    size: {
      sm: {
        inner: 'w-8.5 h-4.5 mt-0.75',
        toggle: 'size-3.5',
      },
    },
    validation: {
      error: {
        input: 'bg-rui-error!',
        label: 'text-rui-error',
      },
      success: {
        input: 'bg-rui-success!',
        label: 'text-rui-success',
      },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    { checked: false, disabled: false, class: { input: 'group-hover/switch:bg-rui-neutral-400 dark:group-hover/switch:bg-rui-neutral-600' } },

    // Checked (no color): an inverted neutral track, with a dark knob in dark mode
    { checked: true, disabled: false, class: { input: 'bg-rui-neutral-900 dark:bg-rui-neutral-100', toggle: 'dark:bg-rui-neutral-900' } },

    // Checked + color: a solid track with the white knob, in both themes
    { checked: true, disabled: false, color: 'primary', class: { input: 'bg-rui-primary dark:bg-rui-primary', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'secondary', class: { input: 'bg-rui-secondary dark:bg-rui-secondary', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'error', class: { input: 'bg-rui-error dark:bg-rui-error', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'warning', class: { input: 'bg-rui-warning dark:bg-rui-warning', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'info', class: { input: 'bg-rui-info dark:bg-rui-info', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'success', class: { input: 'bg-rui-success dark:bg-rui-success', toggle: 'dark:bg-white' } },

    // Size sm + checked: 34 - 14 - 2
    { size: 'sm', checked: true, class: { toggle: 'left-4.5' } },
  ],
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const ui = computed<ReturnType<typeof switchStyles>>(() => switchStyles({
  checked: get(modelValue),
  disabled,
  size,
  validation: get(validation),
  color,
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
          ﹡
        </span>
      </span>
    </label>
    <RuiFormTextDetail
      v-if="!hideDetails"
      class="pt-1"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
