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
    badge: 'flex items-center justify-center text-xs font-medium tabular-nums absolute bg-transparent text-rui-text',
    content: 'flex items-center gap-1 px-1.5',
  },
  variants: {
    // `-fill` is `main` in light and, for a status color, the deep `darker` in dark, where `main` is a text tone
    color: {
      default: { badge: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' },
      primary: { badge: 'bg-rui-primary-fill text-rui-primary-foreground' },
      secondary: { badge: 'bg-rui-secondary-fill text-rui-secondary-foreground' },
      error: { badge: 'bg-rui-error-fill text-rui-error-foreground' },
      warning: { badge: 'bg-rui-warning-fill text-rui-warning-foreground' },
      info: { badge: 'bg-rui-info-fill text-rui-info-foreground' },
      success: { badge: 'bg-rui-success-fill text-rui-success-foreground' },
    },
    // the icon is 60% of the badge height, as the text is, rather than filling it
    size: {
      sm: { badge: 'min-h-4 min-w-4 text-caption-2 [--rui-icon-size:0.625rem]' },
      md: { badge: 'min-h-5 min-w-5 [--rui-icon-size:0.75rem]' },
      lg: { badge: 'min-h-6 min-w-6 [--rui-icon-size:0.875rem]' },
    },
    rounded: {
      sm: { badge: 'rounded-xs' },
      md: { badge: 'rounded-rui-control' },
      lg: { badge: 'rounded-rui-card' },
      full: { badge: 'rounded-full' },
    },
    dot: {
      true: {},
    },
    // an icon alone needs no side padding, so the badge stays as wide as it is tall
    iconOnly: {
      true: { content: 'px-0' },
      false: {},
    },
  },
  compoundVariants: [
    // the default dot is a step lighter in dark, where neutral-500 nearly vanished against a dark control
    { dot: true, color: 'default', class: { badge: 'bg-rui-neutral-500 dark:bg-rui-neutral-400' } },
    // A dot carries no text, so it keeps the brighter `main`, which reads better as a small mark on a dark page
    { dot: true, color: 'error', class: { badge: 'dark:bg-rui-error' } },
    { dot: true, color: 'warning', class: { badge: 'dark:bg-rui-warning' } },
    { dot: true, color: 'info', class: { badge: 'dark:bg-rui-info' } },
    { dot: true, color: 'success', class: { badge: 'dark:bg-rui-success' } },

    // Dot sizes: 8, 10 and 12px, since half of a dot sits off the corner and reads smaller than it is
    { dot: true, size: 'sm', class: { badge: 'min-w-2 min-h-2' } },
    { dot: true, size: 'md', class: { badge: 'min-w-2.5 min-h-2.5' } },
    { dot: true, size: 'lg', class: { badge: 'min-w-3 min-h-3' } },
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
  iconOnly: (!!icon || !!slots.icon) && !get(hasText),
}));

/** Dot positions as [leftOffset, rightBase, edgeBase, centerOffset]; a dot's center sits on the corner, so each size moves by half its diameter. */
const DOT_POS: Record<BadgeSize, PosConfig> = {
  sm: [-0.25, '100% - 0.25rem', '100% - 0.25rem', 0.25],
  md: [-0.3125, '100% - 0.3125rem', '100% - 0.3125rem', 0.3125],
  lg: [-0.375, '100% - 0.375rem', '100% - 0.375rem', 0.375],
};
const BADGE_POS: Record<BadgeSize, PosConfig> = {
  sm: [-0.85, '100% - 0.375rem', '100% - 0.375rem', 0.55],
  md: [-0.95, '100% - 0.5rem', '100% - 0.5rem', 0.65],
  lg: [-1.05, '100% - 0.5rem', '100% - 0.5rem', 0.75],
};

const positionStyle = computed<Record<string, string>>(() => {
  const ox = Number(offsetX) * 0.0625;
  const oy = Number(offsetY) * 0.0625;
  const [l, r, edge, center] = dot ? DOT_POS[size] : BADGE_POS[size];

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
    <!-- under reduced motion the badge appears and leaves at full size, with no scale -->
    <Transition
      appear
      enter-active-class="transition-[scale] ease-out duration-200 motion-reduce:transition-none"
      enter-from-class="scale-0 motion-reduce:scale-100"
      enter-to-class="scale-100"
      leave-active-class="transition-[scale] ease-in duration-150 motion-reduce:transition-none"
      leave-from-class="scale-100"
      leave-to-class="scale-0 motion-reduce:scale-100"
    >
      <div
        v-if="modelValue"
        :class="ui.badge()"
        :style="positionStyle"
        :data-placement="placement"
        :data-dot="dot || undefined"
        :data-left="left || undefined"
        aria-atomic="true"
        aria-live="polite"
        role="status"
      >
        <!-- no aria-label: on a live region it replaced the count, so a reader announced "Badge" -->
        <span
          v-if="!dot"
          :class="ui.content({ class: hasIconAndText ? 'px-2' : undefined })"
        >
          <slot name="badge">
            {{ text }}
          </slot>
          <slot name="icon">
            <RuiIcon
              v-if="icon"
              :name="icon"
            />
          </slot>
        </span>
      </div>
    </Transition>
  </div>
</template>
