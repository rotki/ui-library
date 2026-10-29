<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { BadgePlacement, BadgeRounded, BadgeSize } from '@/components/overlays/badge/badge-props';
import { badgeStyles } from './badge-styles';

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
