<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { BadgePlacement, BadgeRounded, BadgeSize } from '@/components/overlays/badge/badge-props';
import { tv } from '@/utils/tv';

type PosConfig = [left: number, right: string, edge: string, center: number];

export interface Props {
  text?: string | null;
  icon?: RuiIcons | null;
  modelValue?: boolean;
  dot?: boolean;
  left?: boolean;
  offsetX?: string | number;
  offsetY?: string | number;
  placement?: BadgePlacement;
  size?: BadgeSize;
  rounded?: BadgeRounded;
  color?: 'default' | ContextColorsType;
}

defineOptions({
  name: 'RuiBadge',
});

const {
  text = null,
  icon = null,
  modelValue = true,
  dot = false,
  placement = BadgePlacement.top,
  left = false,
  size = BadgeSize.md,
  rounded = BadgeRounded.full,
  color = 'primary',
  offsetX = 0,
  offsetY = 0,
} = defineProps<Props>();

const slots = defineSlots<{
  default?: () => any;
  badge?: () => any;
  icon?: () => any;
}>();

const badgeStyles = tv({
  slots: {
    wrapper: 'relative inline-block',
    badge: 'flex items-center justify-center text-xs font-medium absolute bg-transparent text-rui-light-text dark:text-rui-text',
    content: 'flex items-center px-1.5',
  },
  variants: {
    color: {
      default: { badge: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' },
      primary: { badge: 'text-white bg-rui-primary' },
      secondary: { badge: 'text-white bg-rui-secondary' },
      // in dark a status color's `main` is a text tone, so a badge with text fills with the deep `darker`
      error: { badge: 'text-white bg-rui-error dark:bg-rui-error-darker' },
      warning: { badge: 'text-white bg-rui-warning dark:bg-rui-warning-darker' },
      info: { badge: 'text-white bg-rui-info dark:bg-rui-info-darker' },
      success: { badge: 'text-white bg-rui-success dark:bg-rui-success-darker' },
    },
    size: {
      sm: { badge: 'min-h-4 min-w-4' },
      md: { badge: 'min-h-5 min-w-5' },
      lg: { badge: 'min-h-6 min-w-6' },
    },
    rounded: {
      sm: { badge: 'rounded-xs' },
      md: { badge: 'rounded-md' },
      lg: { badge: 'rounded-lg' },
      full: { badge: 'rounded-full' },
    },
    dot: {
      true: {},
    },
  },
  compoundVariants: [
    // Dot default color
    { dot: true, color: 'default', class: { badge: 'bg-rui-neutral-500' } },
    // A dot carries no text, so it keeps the brighter `main`, which reads better as a small mark on a dark page
    { dot: true, color: 'error', class: { badge: 'dark:bg-rui-error' } },
    { dot: true, color: 'warning', class: { badge: 'dark:bg-rui-warning' } },
    { dot: true, color: 'info', class: { badge: 'dark:bg-rui-info' } },
    { dot: true, color: 'success', class: { badge: 'dark:bg-rui-success' } },

    // Dot sizes (smaller than normal badge)
    { dot: true, size: 'sm', class: { badge: 'min-w-1.5 min-h-1.5' } },
    { dot: true, size: 'md', class: { badge: 'min-w-2 min-h-2' } },
    { dot: true, size: 'lg', class: { badge: 'min-w-2.5 min-h-2.5' } },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    rounded: 'full',
    dot: false,
  },
});

const hasText = computed<boolean>(() => !!text || !!slots.badge);

const hasIconAndText = computed<boolean>(() => (!!icon || !!slots.icon) && get(hasText));

const ui = computed<ReturnType<typeof badgeStyles>>(() => badgeStyles({
  color,
  size,
  rounded,
  dot,
}));

// Position configs: [leftOffset, rightBase, edgeBase, centerOffset] (rem / calc expressions)
const DOT_POS: PosConfig = [-0.25, '100% - 0.25rem', '100% - 0.25rem', 0.25];
const BADGE_POS: Record<BadgeSize, PosConfig> = {
  sm: [-0.85, '100% - 0.375rem', '100% - 0.375rem', 0.55],
  md: [-0.95, '100% - 0.5rem', '100% - 0.5rem', 0.65],
  lg: [-1.05, '100% - 0.5rem', '100% - 0.5rem', 0.75],
};

const positionStyle = computed<Record<string, string>>(() => {
  const ox = Number(offsetX) * 0.0625;
  const oy = Number(offsetY) * 0.0625;
  const [l, r, edge, center] = dot ? DOT_POS : BADGE_POS[size];

  const horizontal = `calc(${left ? `${l}rem` : r} + ${ox}rem)`;
  const vertical = placement === 'center'
    ? `calc(50% - ${center}rem - ${oy}rem)`
    : `calc(${edge} - ${oy}rem)`;

  return {
    left: horizontal,
    [placement === 'top' ? 'bottom' : 'top']: vertical,
  };
});
</script>

<template>
  <div :class="ui.wrapper()">
    <slot />
    <Transition
      appear
      enter-active-class="transform ease-out duration-200"
      enter-from-class="scale-0"
      enter-to-class="scale-100"
      leave-active-class="transform ease-in duration-150"
      leave-from-class="scale-100"
      leave-to-class="scale-0"
    >
      <div
        v-if="modelValue"
        :class="ui.badge()"
        :style="positionStyle"
        :data-placement="placement"
        :data-dot="dot || undefined"
        :data-left="left || undefined"
        aria-atomic="true"
        aria-label="Badge"
        aria-live="polite"
        role="status"
      >
        <span
          v-if="!dot"
          :class="ui.content({ class: hasIconAndText ? 'px-2.5' : undefined })"
        >
          <slot name="badge">
            {{ text }}
          </slot>
          <slot name="icon">
            <RuiIcon
              v-if="icon"
              :name="icon"
              size="16"
              :class="{ 'ml-0.5': hasText }"
            />
          </slot>
        </span>
      </div>
    </Transition>
  </div>
</template>
