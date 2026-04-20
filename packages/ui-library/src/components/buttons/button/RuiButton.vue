<script lang="ts" generic="T = undefined" setup>
import type { ContextColorsType } from '@/consts/colors';
import { type ButtonSize, ButtonVariant, FAB_DEFAULT_ELEVATION, getButtonSpinnerSize, NO_ELEVATION } from '@/components/buttons/button/button-props';
import { buttonStyles } from '@/components/buttons/button/button-styles';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { cn } from '@/utils/tv';

export interface Props<T = undefined> {
  disabled?: boolean;
  loading?: boolean;
  color?: ContextColorsType;
  rounded?: boolean;
  elevation?: number | string | null;
  variant?: ButtonVariant;
  icon?: boolean;
  active?: boolean;
  size?: ButtonSize;
  tag?: 'button' | 'a';
  type?: 'button' | 'submit';
  modelValue?: T;
  hideFocusIndicator?: boolean;
}

defineOptions({
  name: 'RuiButton',
  inheritAttrs: false,
});

const {
  disabled = false,
  loading = false,
  color = undefined,
  rounded = false,
  elevation = null,
  variant = ButtonVariant.default,
  icon = false,
  active = false,
  size = undefined,
  tag = 'button',
  type = 'button',
  modelValue = undefined,
  hideFocusIndicator = false,
} = defineProps<Props<T>>();

const emit = defineEmits<{
  'update:modelValue': [value?: T];
}>();

const slots = defineSlots<{
  prepend?: () => any;
  append?: () => any;
  default?: () => any;
}>();

const btnValue = computed<T | undefined>(() => modelValue);

const defaultElevation = computed<number>(() => variant === ButtonVariant.fab ? FAB_DEFAULT_ELEVATION : NO_ELEVATION);
const usedElevation = computed<number | string>(() => disabled ? NO_ELEVATION : elevation ?? get(defaultElevation));

const spinnerSize = computed<number>(() => getButtonSpinnerSize(size));

const ui = computed<ReturnType<typeof buttonStyles>>(() => buttonStyles({
  variant,
  color: color ?? 'grey',
  size,
  rounded,
  icon,
  active,
  loading,
  hideFocusIndicator,
}));
</script>

<template>
  <Component
    :is="tag"
    :class="[
      ui.root({ class: cn($attrs.class) }),
      `shadow-${usedElevation}`,
    ]"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    :data-variant="variant"
    :data-color="color"
    :data-active="active || undefined"
    v-bind="{ ...$attrs, class: undefined }"
    @click="emit('update:modelValue', btnValue)"
  >
    <slot name="prepend" />
    <span
      v-if="slots.default"
      :class="ui.label()"
      data-id="btn-label"
    >
      <slot />
    </span>
    <slot name="append" />
    <RuiProgress
      v-if="loading"
      circular
      data-spinner
      :class="ui.spinner()"
      variant="indeterminate"
      thickness="2"
      :size="spinnerSize"
    />
  </Component>
</template>
