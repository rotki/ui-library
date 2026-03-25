<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { tv } from '@/utils/tv';

export interface Props {
  title?: string;
  description?: string;
  type?: ContextColorsType;
  icon?: RuiIcons;
  variant?: 'default' | 'filled' | 'outlined';
  actionText?: string;
  closeable?: boolean;
}

defineOptions({
  name: 'RuiAlert',
  inheritAttrs: false,
});

const {
  title = '',
  description = '',
  type = 'primary',
  icon = undefined,
  variant = 'default',
  actionText = '',
  closeable = false,
} = defineProps<Props>();

const emit = defineEmits<{
  action: [];
  close: [];
}>();

defineSlots<{
  title?: () => any;
  default?: () => any;
}>();

const alertStyles = tv({
  slots: {
    root: 'px-4 py-2.5 rounded flex space-x-4',
    content: 'flex space-x-3 py-1 flex-grow',
    icon: '',
    texts: 'space-y-1 flex-grow',
    action: '',
    close: '',
  },
  variants: {
    variant: {
      default: {},
      filled: {
        icon: '!text-rui-dark-text',
        texts: '!text-rui-dark-text',
        action: '!text-rui-dark-text',
        close: '!text-rui-dark-text',
      },
      outlined: { root: 'border m-[-1px] bg-white dark:bg-black' },
    },
    type: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // Default variant backgrounds
    {
      variant: 'default',
      type: 'primary',
      class: { root: 'bg-rui-primary bg-tint-[.9] color-mix-supported:bg-rui-primary-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-primary-shade/[.9]' },
    },
    {
      variant: 'default',
      type: 'secondary',
      class: { root: 'bg-rui-secondary bg-tint-[.9] color-mix-supported:bg-rui-secondary-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-secondary-shade/[.9]' },
    },
    {
      variant: 'default',
      type: 'error',
      class: { root: 'bg-rui-error bg-tint-[.9] color-mix-supported:bg-rui-error-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-error-shade/[.9]' },
    },
    {
      variant: 'default',
      type: 'warning',
      class: { root: 'bg-rui-warning bg-tint-[.9] color-mix-supported:bg-rui-warning-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-warning-shade/[.9]' },
    },
    {
      variant: 'default',
      type: 'info',
      class: { root: 'bg-rui-info bg-tint-[.9] color-mix-supported:bg-rui-info-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-info-shade/[.9]' },
    },
    {
      variant: 'default',
      type: 'success',
      class: { root: 'bg-rui-success bg-tint-[.9] color-mix-supported:bg-rui-success-tint/[.9] dark:bg-shade-[.9] dark:color-mix-supported:bg-rui-success-shade/[.9]' },
    },

    // Filled variant backgrounds
    { variant: 'filled', type: 'primary', class: { root: 'bg-rui-primary' } },
    { variant: 'filled', type: 'secondary', class: { root: 'bg-rui-secondary' } },
    { variant: 'filled', type: 'error', class: { root: 'bg-rui-error' } },
    { variant: 'filled', type: 'warning', class: { root: 'bg-rui-warning' } },
    { variant: 'filled', type: 'info', class: { root: 'bg-rui-info' } },
    { variant: 'filled', type: 'success', class: { root: 'bg-rui-success' } },

    // Filled dark text override for warning/success/info
    {
      variant: 'filled',
      type: ['warning', 'success', 'info'],
      class: { root: 'dark:!text-rui-light-text' },
    },

    // Outlined variant borders
    { variant: 'outlined', type: 'primary', class: { root: 'border-rui-primary' } },
    { variant: 'outlined', type: 'secondary', class: { root: 'border-rui-secondary' } },
    { variant: 'outlined', type: 'error', class: { root: 'border-rui-error' } },
    { variant: 'outlined', type: 'warning', class: { root: 'border-rui-warning' } },
    { variant: 'outlined', type: 'info', class: { root: 'border-rui-info' } },
    { variant: 'outlined', type: 'success', class: { root: 'border-rui-success' } },

  ],
  compoundSlots: [
    // Content text colors for default + outlined (shared across all content slots)
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'primary',
      class: 'text-rui-primary text-shade-[.6] color-mix-supported:text-rui-primary-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-primary-tint/[.6]',
    },
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'secondary',
      class: 'text-rui-secondary text-shade-[.6] color-mix-supported:text-rui-secondary-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-secondary-tint/[.6]',
    },
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'error',
      class: 'text-rui-error text-shade-[.6] color-mix-supported:text-rui-error-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-error-tint/[.6]',
    },
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'warning',
      class: 'text-rui-warning text-shade-[.6] color-mix-supported:text-rui-warning-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-warning-tint/[.6]',
    },
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'info',
      class: 'text-rui-info text-shade-[.6] color-mix-supported:text-rui-info-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-info-tint/[.6]',
    },
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      type: 'success',
      class: 'text-rui-success text-shade-[.6] color-mix-supported:text-rui-success-shade/[.6] color-mix-supported:animate-none dark:text-tint-[.6] dark:color-mix-supported:text-rui-success-tint/[.6]',
    },

    // Icon-only dark mode base color
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'primary', class: 'dark:text-rui-primary' },
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'secondary', class: 'dark:text-rui-secondary' },
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'error', class: 'dark:text-rui-error' },
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'warning', class: 'dark:text-rui-warning' },
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'info', class: 'dark:text-rui-info' },
    { slots: ['icon'], variant: ['default', 'outlined'], type: 'success', class: 'dark:text-rui-success' },
  ],
});

const ui = computed<ReturnType<typeof alertStyles>>(() => alertStyles({ variant, type }));

const usedIcon = computed<RuiIcons | undefined>(() => {
  if (icon)
    return icon;

  const iconMap: Record<ContextColorsType, RuiIcons | undefined> = {
    primary: undefined,
    secondary: undefined,
    warning: 'lu-triangle-alert',
    info: 'lu-info',
    error: 'lu-circle-alert',
    success: 'lu-circle-check',
  };

  return iconMap[type];
});
</script>

<template>
  <div
    :class="ui.root()"
    v-bind="$attrs"
    :data-variant="variant"
    :data-type="type"
  >
    <div :class="ui.content()">
      <div
        v-if="usedIcon"
        :class="ui.icon()"
      >
        <RuiIcon
          :name="usedIcon"
          size="22"
        />
      </div>
      <div :class="ui.texts()">
        <div
          v-if="$slots.title || title"
          :class="{
            'font-medium': !!title,
          }"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div
          v-if="$slots.default || description"
          class="text-body-2"
        >
          <slot>
            {{ description }}
          </slot>
        </div>
      </div>
    </div>
    <div v-if="actionText">
      <RuiButton
        variant="text"
        size="sm"
        :color="variant === 'filled' ? undefined : type"
        :class="ui.action()"
        data-id="alert-action"
        @click="emit('action')"
      >
        {{ actionText }}
      </RuiButton>
    </div>
    <div v-if="closeable">
      <RuiButton
        :color="variant === 'filled' ? undefined : type"
        size="sm"
        icon
        variant="text"
        :class="ui.close()"
        data-id="alert-close"
        @click="emit('close')"
      >
        <RuiIcon
          name="lu-x"
          size="20"
        />
      </RuiButton>
    </div>
  </div>
</template>
