<script lang="ts" setup>
import type { StyleValue } from 'vue';
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import type { VueClassValue } from '@/types/class-value';
import { objectOmit } from '@vueuse/shared';
import { CHIP_CLOSE_ICON_SIZES, ChipSize, ChipVariant } from '@/components/chips/chip-props';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { cn, tv } from '@/utils/tv';

export interface RuiChipClassNames {
  root?: VueClassValue;
  content?: VueClassValue;
}

export interface Props {
  tile?: boolean;
  clickable?: boolean;
  closeable?: boolean;
  disabled?: boolean;
  size?: ChipSize;
  variant?: ChipVariant;
  color?: 'grey' | ContextColorsType;
  closeIcon?: RuiIcons;
  bgColor?: string;
  textColor?: string;
  classNames?: RuiChipClassNames;
  /** @deprecated Use `classNames.content` instead */
  contentClass?: string;
}

defineOptions({
  name: 'RuiChip',
  inheritAttrs: false,
});

const {
  tile = false,
  size = ChipSize.md,
  color = 'grey',
  clickable = false,
  closeable = false,
  disabled = false,
  variant = ChipVariant.filled,
  closeIcon = 'lu-circle-x',
  bgColor = undefined,
  textColor = undefined,
  classNames,
  contentClass = '',
} = defineProps<Props>();

const emit = defineEmits<{
  'click:close': [];
  'click': [e: MouseEvent];
}>();

defineSlots<{
  prepend?: () => any;
  default?: () => any;
}>();

const chipStyles = tv({
  slots: {
    root: 'inline-flex items-center justify-between px-1.5 py-1 transition-all cursor-default outline-none max-w-full truncate',
    prepend: 'rounded-full flex items-center justify-center pr-0 w-6 h-6 text-[0.6rem] text-white bg-rui-grey-400 dark:bg-rui-grey-700 -ml-0.5 overflow-hidden',
    label: 'truncate px-[0.375rem] text-[0.8125rem]',
    close: 'rounded-full flex items-center p-[0.13rem] pl-0 inset-y-0 focus:outline-none -mr-1',
    closeIcon: 'opacity-50 hover:opacity-80 dark:hover:text-rui-grey-300 transition-opacity',
  },
  variants: {
    tile: {
      true: { root: 'rounded-sm' },
      false: { root: 'rounded-full' },
    },
    size: {
      md: { root: 'min-h-[2.26rem]' },
      sm: {
        root: 'py-[0.19rem]',
        prepend: 'text-[0.5rem] p-[0.08rem] w-4 h-4 -ml-1',
        label: 'px-[0.3rem] text-[0.7rem]',
        close: 'p-[0.08rem] -mr-1.5',
      },
    },
    disabled: {
      true: { root: 'opacity-40 cursor-default', close: 'cursor-default' },
      false: {},
    },
    clickable: {
      true: { root: 'cursor-pointer' },
      false: { root: 'cursor-default', close: 'cursor-default' },
    },
    variant: {
      filled: {},
      outlined: {},
    },
    color: {
      grey: { root: 'text-rui-text' },
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // Interactive states (clickable + not disabled)
    { clickable: true, disabled: false, class: { root: 'hover:brightness-90 focus:brightness-75 dark:hover:brightness-110' } },

    // Grey filled/outlined
    { color: 'grey', variant: 'filled', class: { root: 'bg-rui-grey-200 dark:bg-rui-grey-800' } },
    { color: 'grey', variant: 'outlined', class: { root: 'border border-black/[0.26] bg-transparent dark:border-white/[0.26]' } },
    { color: 'grey', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-black/[0.04] focus:bg-black/[0.12] dark:hover:bg-white/[0.04] dark:focus:bg-white/[0.12]' } },

    // Context colors — filled bg
    { color: 'primary', variant: 'filled', class: { root: 'bg-rui-primary' } },
    { color: 'secondary', variant: 'filled', class: { root: 'bg-rui-secondary' } },
    { color: 'error', variant: 'filled', class: { root: 'bg-rui-error' } },
    { color: 'warning', variant: 'filled', class: { root: 'bg-rui-warning' } },
    { color: 'info', variant: 'filled', class: { root: 'bg-rui-info' } },
    { color: 'success', variant: 'filled', class: { root: 'bg-rui-success' } },

    // Context colors — outlined base
    { color: 'primary', variant: 'outlined', class: { root: 'border text-rui-primary border-rui-primary/50 bg-transparent' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'border text-rui-secondary border-rui-secondary/50 bg-transparent' } },
    { color: 'error', variant: 'outlined', class: { root: 'border text-rui-error border-rui-error/50 bg-transparent' } },
    { color: 'warning', variant: 'outlined', class: { root: 'border text-rui-warning border-rui-warning/50 bg-transparent' } },
    { color: 'info', variant: 'outlined', class: { root: 'border text-rui-info border-rui-info/50 bg-transparent' } },
    { color: 'success', variant: 'outlined', class: { root: 'border text-rui-success border-rui-success/50 bg-transparent' } },

    // Context colors — outlined interactive
    { color: 'primary', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-primary/[0.04] focus:bg-rui-primary/[0.12]' } },
    { color: 'secondary', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-secondary/[0.04] focus:bg-rui-secondary/[0.12]' } },
    { color: 'error', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-error/[0.04] focus:bg-rui-error/[0.12]' } },
    { color: 'warning', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-warning/[0.04] focus:bg-rui-warning/[0.12]' } },
    { color: 'info', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-info/[0.04] focus:bg-rui-info/[0.12]' } },
    { color: 'success', variant: 'outlined', clickable: true, disabled: false, class: { root: 'hover:bg-rui-success/[0.04] focus:bg-rui-success/[0.12]' } },
  ],
  compoundSlots: [
    // All context colors filled share dark text
    { slots: ['root'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], variant: 'filled', class: 'text-rui-dark-text' },
    // Dark mode: warning/success/info filled use light text
    { slots: ['root'], color: ['warning', 'success', 'info'], variant: 'filled', class: 'dark:text-rui-light-text' },
  ],
  defaultVariants: {
    tile: false,
    size: 'md',
    disabled: false,
    clickable: false,
    variant: 'filled',
    color: 'grey',
  },
});

const ui = computed<ReturnType<typeof chipStyles>>(() => chipStyles({
  tile,
  size,
  color,
  variant,
  disabled,
  clickable,
}));

const style = computed<Partial<StyleValue>>(() => {
  const s: Partial<StyleValue> = {};
  if (bgColor)
    s.backgroundColor = bgColor;
  if (textColor)
    s.color = textColor;
  return s;
});

function click(e: MouseEvent): void {
  if (!clickable || disabled)
    return;

  emit('click', e);
}
</script>

<template>
  <div
    :class="ui.root({ class: cn(classNames?.root) })"
    :style="style"
    :data-variant="variant"
    :data-color="color"
    :data-disabled="disabled || undefined"
    role="button"
    tabindex="0"
    v-bind="objectOmit($attrs, ['onClick'])"
    @click="click($event)"
  >
    <div
      v-if="$slots.prepend"
      :class="ui.prepend()"
    >
      <slot name="prepend" />
    </div>
    <span :class="ui.label({ class: cn(classNames?.content) ?? contentClass })">
      <slot />
    </span>
    <button
      v-if="closeable"
      :class="ui.close()"
      :disabled="disabled"
      type="button"
      @click.stop="emit('click:close')"
    >
      <RuiIcon
        :class="ui.closeIcon()"
        :size="CHIP_CLOSE_ICON_SIZES[size]"
        :name="closeIcon"
      />
    </button>
  </div>
</template>
