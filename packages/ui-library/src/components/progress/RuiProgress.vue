<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { ProgressVariant } from '@/components/progress/progress-props';
import { tv } from '@/utils/tv';

export interface Props {
  /**
   * in percentage value, required when variant === determinate or buffer
   * @example - 0 <= value <= 100
   */
  value?: number;
  /**
   * in percentage value, required when variant === buffer
   * @example - 0 <= value <= 100
   */
  bufferValue?: number;
  variant?: ProgressVariant;
  color?: ContextColorsType | 'inherit';
  circular?: boolean;
  showLabel?: boolean;
  /**
   * Sets the stroke thickness in pixels
   */
  thickness?: number | string;
  /**
   * only used for circular progress
   */
  size?: number | string;
}

defineOptions({
  name: 'RuiProgress',
});

const {
  value = 0,
  bufferValue = 0,
  variant = ProgressVariant.determinate,
  color = 'inherit',
  circular = false,
  showLabel = false,
  thickness = 4,
  size = 40,
} = defineProps<Props>();

defineSlots<Record<string, never>>();

const CIRCLE_RADIUS = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~125.66

function clampPercent(val: number | undefined): number {
  return Math.max(0, Math.min(val ?? 100, 100));
}

const progressStyles = tv({
  slots: {
    wrapper: '',
    progressbar: 'w-full overflow-hidden relative',
    rail: 'w-full h-full',
    bar: 'transition-all duration-150 ease-in-out absolute left-0 top-0 h-full w-full',
    indeterminateBar: 'absolute left-0 top-0 h-full w-auto transition-transform duration-200 ease-linear origin-left animate-slide-rail',
    bufferDots: 'absolute h-0 w-[200%] -top-px -left-full border-dashed border-y-[0.2rem] animate-buffer-pulse',
    bufferRail: 'w-full h-full transition-transform duration-200 ease-linear origin-left',
    circularContainer: 'inline-block relative',
    svg: 'block',
    circle: 'stroke-current',
    label: 'dark:text-white',
  },
  variants: {
    color: {
      primary: { circularContainer: 'text-rui-primary' },
      secondary: { circularContainer: 'text-rui-secondary' },
      error: { circularContainer: 'text-rui-error' },
      warning: { circularContainer: 'text-rui-warning' },
      info: { circularContainer: 'text-rui-info' },
      success: { circularContainer: 'text-rui-success' },
      inherit: { circularContainer: 'text-current' },
    },
    variant: {
      [ProgressVariant.determinate]: { svg: '-rotate-90' },
      [ProgressVariant.indeterminate]: {
        svg: 'animate-circular-spin',
        circle: 'animate-collapse-stroke [stroke-dasharray:80px,200px] [stroke-linecap:round]',
      },
      [ProgressVariant.buffer]: {},
    },
    circular: {
      true: { wrapper: 'inline-flex' },
      false: { wrapper: 'w-full' },
    },
    hasLabel: {
      true: { wrapper: 'inline-flex items-center relative' },
    },
  },
  compoundVariants: [
    // Linear label
    { circular: false, hasLabel: true, class: { label: 'block text-sm ml-4' } },
    // Circular label (overlays the circle)
    { circular: true, hasLabel: true, class: { label: 'absolute inset-0 flex items-center justify-center text-[0.6rem] leading-none' } },
  ],
  compoundSlots: [
    // Rail background (track behind the bar)
    { slots: ['rail', 'bufferDots'], color: 'primary', class: 'bg-rui-primary/20 border-rui-primary/20' },
    { slots: ['rail', 'bufferDots'], color: 'secondary', class: 'bg-rui-secondary/20 border-rui-secondary/20' },
    { slots: ['rail', 'bufferDots'], color: 'error', class: 'bg-rui-error/20 border-rui-error/20' },
    { slots: ['rail', 'bufferDots'], color: 'warning', class: 'bg-rui-warning/20 border-rui-warning/20' },
    { slots: ['rail', 'bufferDots'], color: 'info', class: 'bg-rui-info/20 border-rui-info/20' },
    { slots: ['rail', 'bufferDots'], color: 'success', class: 'bg-rui-success/20 border-rui-success/20' },
    { slots: ['rail', 'bufferDots'], color: 'inherit', class: 'bg-current opacity-20 border-current' },

    // Bar fill (active progress)
    { slots: ['bar', 'indeterminateBar'], color: 'primary', class: 'bg-rui-primary' },
    { slots: ['bar', 'indeterminateBar'], color: 'secondary', class: 'bg-rui-secondary' },
    { slots: ['bar', 'indeterminateBar'], color: 'error', class: 'bg-rui-error' },
    { slots: ['bar', 'indeterminateBar'], color: 'warning', class: 'bg-rui-warning' },
    { slots: ['bar', 'indeterminateBar'], color: 'info', class: 'bg-rui-info' },
    { slots: ['bar', 'indeterminateBar'], color: 'success', class: 'bg-rui-success' },
    { slots: ['bar', 'indeterminateBar'], color: 'inherit', class: 'bg-current' },
  ],
});

const hasLabel = computed<boolean>(() => showLabel && variant !== ProgressVariant.indeterminate);

const ui = computed<ReturnType<typeof progressStyles>>(() => progressStyles({
  color,
  variant,
  circular,
  hasLabel: get(hasLabel),
}));

const currentValue = computed<number>(() => clampPercent(value));

const label = computed<string>(() => `${Math.floor(get(currentValue))}%`);

const progress = computed<number>(() => -100 + get(currentValue));

const barStyle = computed<Record<string, string>>(() => ({
  transform: `translateX(${get(progress)}%)`,
}));

const bufferRailStyle = computed<Record<string, string>>(() => ({
  transform: `translateX(${-100 + clampPercent(bufferValue)}%)`,
}));

const linearStyle = computed<Record<string, string>>(() => ({
  height: `${+thickness}px`,
}));

const circularSize = computed<Record<string, string>>(() => ({
  width: `${+size}px`,
  height: `${+size}px`,
}));

const circularGeometry = computed<{ scaledThickness: number; viewSize: number }>(() => {
  const scaledThickness = (+thickness * 32) / +size;
  return { scaledThickness, viewSize: 40 + scaledThickness };
});

const circularStrokeStyle = computed<Record<string, string>>(() => ({
  strokeDasharray: `${CIRCLE_CIRCUMFERENCE}`,
  strokeDashoffset: `${(get(progress) / 100) * -CIRCLE_CIRCUMFERENCE}`,
  transition: 'stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
}));
</script>

<template>
  <div :class="ui.wrapper()">
    <!-- Circular progress (not supported for buffer variant) -->
    <div
      v-if="circular && variant !== ProgressVariant.buffer"
      :aria-valuenow="value"
      :class="ui.circularContainer()"
      :style="circularSize"
      :data-variant="variant"
      :data-color="color"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
    >
      <svg
        :class="ui.svg()"
        :viewBox="`0 0 ${circularGeometry.viewSize} ${circularGeometry.viewSize}`"
      >
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          :r="CIRCLE_RADIUS"
          :class="ui.circle()"
          :style="variant === ProgressVariant.determinate ? circularStrokeStyle : undefined"
          :stroke-width="circularGeometry.scaledThickness"
        />
      </svg>
      <div
        v-if="hasLabel"
        :class="ui.label()"
      >
        {{ label }}
      </div>
    </div>

    <!-- Linear progress (also used as fallback for circular + buffer) -->
    <div
      v-else
      :aria-valuenow="value"
      :class="ui.progressbar()"
      :style="linearStyle"
      :data-variant="variant"
      :data-color="color"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
    >
      <div
        v-if="variant === ProgressVariant.buffer"
        :class="ui.bufferDots()"
      />
      <div
        :class="variant === ProgressVariant.buffer ? [ui.rail(), ui.bufferRail()] : ui.rail()"
        :style="variant === ProgressVariant.buffer ? bufferRailStyle : undefined"
      />
      <div
        v-if="variant === ProgressVariant.indeterminate"
        :class="ui.indeterminateBar()"
      />
      <div
        v-else
        :class="ui.bar()"
        :style="barStyle"
      />
    </div>

    <!-- Linear label -->
    <div
      v-if="hasLabel && !circular"
      :class="ui.label()"
    >
      {{ label }}
    </div>
  </div>
</template>
