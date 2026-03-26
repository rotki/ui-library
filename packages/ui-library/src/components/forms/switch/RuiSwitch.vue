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
    inner: 'relative w-[2.6875rem] h-6 shrink-0',
    input: 'peer appearance-none relative w-full h-full rounded-full bg-rui-grey-400 dark:bg-rui-grey-700 transition-all duration-75 ease-in-out cursor-pointer',
    toggle: [
      'absolute w-5 h-5 transition-all duration-75 ease-in-out -translate-y-1/2 top-1/2 rounded-full pointer-events-none',
      'bg-white left-0.5',
      `before:content-[''] before:absolute before:size-10 before:bg-black dark:before:bg-white before:rounded-full`,
      'before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:ease-in-out before:opacity-0',
      'peer-active:before:opacity-20',
      'group-hover/switch:shadow-1',
    ].join(' '),
    label: 'text-rui-text text-body-1',
  },
  variants: {
    checked: {
      true: {
        toggle: 'left-[1.3125rem]',
      },
      false: {},
    },
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
        input: '!bg-rui-grey-300 dark:!bg-rui-grey-800 cursor-not-allowed',
        toggle: '!bg-rui-grey-500 dark:!bg-rui-grey-600 before:!content-none group-hover/switch:!shadow-none',
        label: 'text-rui-text-disabled',
      },
    },
    size: {
      sm: {
        inner: 'w-10 h-5 mt-0.5',
        toggle: 'w-4 h-4 before:size-6',
      },
    },
    validation: {
      error: {
        input: '!bg-rui-error dark:!bg-rui-error/[0.5]',
        label: 'text-rui-error',
        toggle: 'dark:!bg-rui-error',
      },
      success: {
        input: '!bg-rui-success dark:!bg-rui-success/[0.5]',
        label: 'text-rui-success',
        toggle: 'dark:!bg-rui-success',
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
    // Checked (no color): track + toggle dark mode
    { checked: true, disabled: false, class: { input: 'bg-black dark:bg-white' } },
    { checked: true, disabled: false, class: { toggle: 'dark:bg-black' } },

    // Checked + color (light: track bg, dark: track bg/50 + toggle bg)
    { checked: true, disabled: false, color: 'primary', class: { input: 'bg-rui-primary dark:bg-rui-primary/[0.5]', toggle: 'dark:bg-rui-primary' } },
    { checked: true, disabled: false, color: 'secondary', class: { input: 'bg-rui-secondary dark:bg-rui-secondary/[0.5]', toggle: 'dark:bg-rui-secondary' } },
    { checked: true, disabled: false, color: 'error', class: { input: 'bg-rui-error dark:bg-rui-error/[0.5]', toggle: 'dark:bg-rui-error' } },
    { checked: true, disabled: false, color: 'warning', class: { input: 'bg-rui-warning dark:bg-rui-warning/[0.5]', toggle: 'dark:bg-rui-warning' } },
    { checked: true, disabled: false, color: 'info', class: { input: 'bg-rui-info dark:bg-rui-info/[0.5]', toggle: 'dark:bg-rui-info' } },
    { checked: true, disabled: false, color: 'success', class: { input: 'bg-rui-success dark:bg-rui-success/[0.5]', toggle: 'dark:bg-rui-success' } },

    // Size sm + checked: different toggle position
    { size: 'sm', checked: true, class: { toggle: 'left-[1.375rem]' } },
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
