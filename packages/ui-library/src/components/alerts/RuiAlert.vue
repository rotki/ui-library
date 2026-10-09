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
    root: 'px-4 py-2.5 rounded-sm flex between:ml-4 between:mr-0',
    content: 'flex between:ml-3 between:mr-0 py-1 grow',
    icon: '',
    texts: 'between:mt-1 between:mb-0 grow',
    action: '',
    close: '',
  },
  variants: {
    variant: {
      default: {},
      filled: {
        icon: 'text-rui-dark-text!',
        texts: 'text-rui-dark-text!',
        action: 'text-rui-dark-text!',
        close: 'text-rui-dark-text!',
      },
      outlined: { root: 'border -m-px bg-white dark:bg-black' },
    },
    /*
     * Each type names its color once, as `--rui-alert`, and the variants mix from it. The tints
     * and shades used to be paused CSS animations behind an `@supports (color-mix())` check that
     * never matched (it is not a valid condition), so every browser took the animation; mixing
     * directly gives the same colors without it.
     */
    type: {
      primary: { root: '[--rui-alert:var(--rui-primary-main)]' },
      secondary: { root: '[--rui-alert:var(--rui-secondary-main)]' },
      error: { root: '[--rui-alert:var(--rui-error-main)]' },
      warning: { root: '[--rui-alert:var(--rui-warning-main)]' },
      info: { root: '[--rui-alert:var(--rui-info-main)]' },
      success: { root: '[--rui-alert:var(--rui-success-main)]' },
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      class: { root: 'bg-[color-mix(in_srgb,white_90%,rgb(var(--rui-alert)))] dark:bg-[color-mix(in_srgb,black_90%,rgb(var(--rui-alert)))]' },
    },
    { variant: 'filled', class: { root: 'bg-[rgb(var(--rui-alert))]' } },
    // Filled dark text override for warning/success/info
    {
      variant: 'filled',
      type: ['warning', 'success', 'info'],
      class: { root: 'dark:text-rui-light-text!' },
    },
    { variant: 'outlined', class: { root: 'border-[rgb(var(--rui-alert))]' } },
  ],
  compoundSlots: [
    {
      slots: ['icon', 'texts', 'action', 'close'],
      variant: ['default', 'outlined'],
      class: 'text-[color-mix(in_srgb,black_60%,rgb(var(--rui-alert)))] dark:text-[color-mix(in_srgb,white_60%,rgb(var(--rui-alert)))]',
    },
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
