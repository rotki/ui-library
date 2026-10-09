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
  /**
   * Takes the close button out of the tab order, for a chip inside a widget that removes chips from
   * the keyboard itself, as RuiAutoComplete does with Backspace. The button still takes clicks.
   */
  closeUnfocusable?: boolean;
  bgColor?: string;
  textColor?: string;
  classNames?: RuiChipClassNames;
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
  closeIcon = 'lu-x',
  closeUnfocusable = false,
  bgColor = undefined,
  textColor = undefined,
  classNames,
} = defineProps<Props>();

const emit = defineEmits<{
  'click:close': [];
  'click': [e: MouseEvent];
}>();

const slots = defineSlots<{
  prepend?: () => any;
  default?: () => any;
}>();

const root = useTemplateRef<HTMLDivElement>('root');

const chipStyles = tv({
  slots: {
    root: 'inline-flex items-center justify-between px-2 py-0.5 transition duration-150 cursor-default outline-hidden max-w-full truncate',
    // the avatar's neutral pair, so initials stay readable on any chip color
    prepend: 'rounded-full flex items-center justify-center shrink-0 w-6 h-6 text-[0.625rem] font-semibold text-rui-neutral-700 bg-rui-neutral-200 dark:text-rui-neutral-200 dark:bg-rui-neutral-700 overflow-hidden',
    label: 'truncate px-2 text-[0.8125rem]/5',
    // a round hover fill marks the close icon as its own button
    close: 'rounded-full flex items-center p-0.5 inset-y-0 focus:outline-hidden transition-colors hover:bg-rui-pressed',
    closeIcon: 'opacity-60 hover:opacity-100 transition-opacity',
  },
  variants: {
    tile: {
      true: { root: 'rounded-rui-sm' },
      false: { root: 'rounded-full' },
    },
    size: {
      // 28px, to sit in a 44px table row; sm is 24px with 12px text, the smallest the library sets
      md: { root: 'min-h-7' },
      sm: {
        root: 'min-h-6',
        prepend: 'text-[0.5rem] p-[0.08rem] w-4 h-4',
        label: 'px-1.5 text-xs/4',
        close: 'p-px',
      },
    },
    // a leading circle sits as far from the start edge as from the top, like an avatar in a pill
    prepended: {
      true: { root: 'pl-0.5' },
      false: {},
    },
    closeable: {
      true: {},
      false: {},
    },
    disabled: {
      true: { root: '!text-rui-text-disabled cursor-default', close: 'cursor-default hover:bg-transparent dark:hover:bg-transparent' },
      false: {},
    },
    clickable: {
      true: { root: 'cursor-pointer' },
      false: { root: 'cursor-default', close: 'cursor-default' },
    },
    variant: {
      filled: {},
      outlined: {},
      tonal: {},
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
    // Interactive states (clickable + not disabled): a tint over any fill, which keeps the text color
    { clickable: true, disabled: false, class: { root: 'hover:state-layer active:state-layer-pressed focus-visible:focus-ring' } },

    // Grey filled/outlined
    { color: 'grey', variant: 'filled', class: { root: 'bg-rui-neutral-100 dark:bg-rui-neutral-800' } },
    { color: 'grey', variant: 'outlined', class: { root: 'border border-rui-outline bg-transparent' } },

    // Context colors — filled bg
    { color: 'primary', variant: 'filled', class: { root: 'bg-rui-primary' } },
    { color: 'secondary', variant: 'filled', class: { root: 'bg-rui-secondary' } },
    // in dark a status color's `main` is a text tone, so the fill is its deep `darker`
    { color: 'error', variant: 'filled', class: { root: 'bg-rui-error dark:bg-rui-error-darker' } },
    { color: 'warning', variant: 'filled', class: { root: 'bg-rui-warning dark:bg-rui-warning-darker' } },
    { color: 'info', variant: 'filled', class: { root: 'bg-rui-info dark:bg-rui-info-darker' } },
    { color: 'success', variant: 'filled', class: { root: 'bg-rui-success dark:bg-rui-success-darker' } },

    // Context colors — outlined base
    { color: 'primary', variant: 'outlined', class: { root: 'border text-rui-primary dark:text-rui-primary-lighter border-rui-primary/50 bg-transparent' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'border text-rui-secondary dark:text-rui-secondary-lighter border-rui-secondary/50 bg-transparent' } },
    { color: 'error', variant: 'outlined', class: { root: 'border text-rui-error dark:text-rui-error-lighter border-rui-error/50 bg-transparent' } },
    { color: 'warning', variant: 'outlined', class: { root: 'border text-rui-warning border-rui-warning/50 bg-transparent' } },
    { color: 'info', variant: 'outlined', class: { root: 'border text-rui-info border-rui-info/50 bg-transparent' } },
    { color: 'success', variant: 'outlined', class: { root: 'border text-rui-success border-rui-success/50 bg-transparent' } },

    // Context colors — tonal: a tint of the hue with its deeper tone as text, 4.5:1 in both themes
    { color: 'grey', variant: 'tonal', class: { root: 'bg-rui-neutral-100 dark:bg-rui-neutral-800' } },
    { color: 'primary', variant: 'tonal', class: { root: 'bg-rui-primary/10 text-rui-primary-darker dark:bg-rui-primary/20 dark:text-rui-primary-lighter' } },
    { color: 'secondary', variant: 'tonal', class: { root: 'bg-rui-secondary/10 text-rui-secondary-darker dark:bg-rui-secondary/20 dark:text-rui-secondary-lighter' } },
    { color: 'error', variant: 'tonal', class: { root: 'bg-rui-error/10 text-rui-error-darker dark:bg-rui-error/20 dark:text-rui-error-lighter' } },
    { color: 'warning', variant: 'tonal', class: { root: 'bg-rui-warning/10 text-rui-warning-darker dark:bg-rui-warning/20 dark:text-rui-warning-lighter' } },
    { color: 'info', variant: 'tonal', class: { root: 'bg-rui-info/10 text-rui-info-darker dark:bg-rui-info/20 dark:text-rui-info-lighter' } },
    { color: 'success', variant: 'tonal', class: { root: 'bg-rui-success/10 text-rui-success-darker dark:bg-rui-success/20 dark:text-rui-success-lighter' } },

    // sm: a 16px circle in a 24px chip, 4px in from the start as from the top
    { size: 'sm', prepended: true, class: { root: 'pl-1' } },
    // in a tile chip the prefix follows the corners: the chip's 6px radius less the 2px inset
    { tile: true, class: { prepend: 'rounded-sm' } },
    // the close button's round hover area mirrors the prefix: as far from the end edge as from the top
    { closeable: true, class: { root: 'pr-1', label: 'pr-1' } },
    { closeable: true, size: 'sm', class: { root: 'pr-1', label: 'pr-0.5' } },

    // Disabled: a flat neutral chip in any color, like a disabled button
    { disabled: true, variant: ['filled', 'tonal'], class: { root: '!bg-rui-neutral-100 dark:!bg-rui-neutral-800' } },
    { disabled: true, variant: 'outlined', class: { root: '!border-rui-divider' } },
  ],
  compoundSlots: [
    // Every filled color takes light text, in both themes
    { slots: ['root'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], variant: 'filled', class: 'text-rui-dark-text' },
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
  prepended: !!slots.prepend,
  closeable,
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

/**
 * Enter and Space activate a clickable chip as they would a button, through a
 * real click so the handler still gets a `MouseEvent`.
 *
 * @param e - the key press on the chip
 */
function onKeydown(e: KeyboardEvent): void {
  if (!clickable || disabled || e.target !== get(root))
    return;
  if (e.key !== 'Enter' && e.key !== ' ')
    return;

  e.preventDefault();
  get(root)?.click();
}
</script>

<template>
  <div
    ref="root"
    :class="ui.root({ class: cn(classNames?.root) })"
    :style="style"
    :data-variant="variant"
    :data-color="color"
    :data-disabled="disabled || undefined"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : undefined"
    :aria-disabled="clickable && disabled ? true : undefined"
    v-bind="objectOmit($attrs, ['onClick'])"
    @click="click($event)"
    @keydown="onKeydown($event)"
  >
    <div
      v-if="$slots.prepend"
      :class="ui.prepend()"
    >
      <slot name="prepend" />
    </div>
    <span :class="ui.label({ class: cn(classNames?.content) })">
      <slot />
    </span>
    <button
      v-if="closeable"
      :class="ui.close()"
      :disabled="disabled"
      type="button"
      aria-label="Remove"
      :tabindex="closeUnfocusable ? -1 : undefined"
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
