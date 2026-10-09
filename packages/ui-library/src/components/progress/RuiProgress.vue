<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import { ProgressVariant } from '@/components/progress/progress-props';
import { tv } from '@/utils/tv';

export interface Props {
  /**
   * in percentage value, required when variant === determinate or buffer
   * Ranges from 0 to 100.
   */
  value?: number;
  /**
   * in percentage value, required when variant === buffer
   * Ranges from 0 to 100.
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
  /**
   * What is loading, as the progress bar's accessible name ("Loading" when not given)
   */
  ariaLabel?: string;
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
  ariaLabel = 'Loading',
} = defineProps<Props>();

defineSlots<Record<string, never>>();

const CIRCLE_RADIUS = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~125.66
/** width of `100%` in ems, measured with tabular figures */
const LABEL_WIDTH_EM = 2.95;
/** keeps the label off the stroke rather than merely inside it */
const LABEL_BREATHING_ROOM = 0.9;
/** below this font size a label inside the ring is unreadable, so the ring drops it rather than change its footprint */
const MIN_INSIDE_LABEL_PX = 9;

function clampPercent(val: number | undefined): number {
  return Math.max(0, Math.min(val ?? 100, 100));
}

const progressStyles = tv({
  slots: {
    wrapper: '',
    progressbar: 'w-full overflow-hidden relative rounded-full',
    rail: 'w-full h-full',
    bar: 'transition-all duration-150 ease-in-out absolute left-0 top-0 h-full w-full',
    indeterminateBar: 'absolute left-0 top-0 h-full w-auto transition-transform duration-200 ease-linear origin-left animate-slide-rail',
    bufferDots: 'absolute h-0 w-[200%] -top-px -left-full border-dashed border-y-[0.2rem] animate-buffer-pulse',
    bufferRail: 'w-full h-full transition-transform duration-200 ease-linear origin-left',
    circularContainer: 'inline-block relative',
    svg: 'block',
    circle: 'stroke-current',
    circleTrack: '',
    label: 'text-rui-text',
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
    { circular: false, hasLabel: true, class: { label: 'block text-sm ml-4 text-rui-text-secondary tabular-nums' } },
    // Circular label (overlays the circle, font size derived from `size`)
    { circular: true, hasLabel: true, class: { label: 'absolute inset-0 flex items-center justify-center leading-none font-medium tabular-nums whitespace-nowrap' } },
  ],
  compoundSlots: [
    // Track behind the bar: one neutral for every named color, which reads in both themes where a tint of a dark hue vanished on a dark page
    { slots: ['rail'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'bg-rui-neutral-200 dark:bg-rui-neutral-800' },
    { slots: ['bufferDots'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'border-rui-neutral-200 dark:border-rui-neutral-800' },
    { slots: ['circleTrack'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'stroke-rui-neutral-200 dark:stroke-rui-neutral-800' },
    // `inherit` keeps a tint of whatever color it is given
    { slots: ['rail', 'bufferDots'], color: 'inherit', class: 'bg-current opacity-20 border-current' },
    { slots: ['circleTrack'], color: 'inherit', class: 'stroke-current opacity-20' },

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

/**
 * The font size that fits the widest label (`100%`) inside the ring, solved against the chord
 * it spans. Always computed for that widest label so the text does not resize as the value climbs.
 */
const insideLabelFit = computed<number>(() => {
  const innerRadius = Math.max((+size - 2 * +thickness) / 2, 0);
  return (LABEL_BREATHING_ROOM * 2 * innerRadius) / Math.sqrt(LABEL_WIDTH_EM ** 2 + 1);
});

const labelFits = computed<boolean>(() => get(insideLabelFit) >= MIN_INSIDE_LABEL_PX);

const ui = computed<ReturnType<typeof progressStyles>>(() => progressStyles({
  color,
  variant,
  circular,
  hasLabel: get(hasLabel),
}));

const currentValue = computed<number>(() => clampPercent(value));

/** An indeterminate bar has no value to report, so it leaves `aria-valuenow` off. */
const ariaValueNow = computed<number | undefined>(() =>
  variant === ProgressVariant.indeterminate ? undefined : get(currentValue));

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

/**
 * The label inside the ring scales with both `size` and `thickness`. The fit is capped by
 * a sublinear curve so large rings do not end up with an oversized number in the middle.
 */
const circularLabelStyle = computed<Record<string, string>>(() => ({
  fontSize: `${Math.min(get(insideLabelFit), +size * 0.15 + 6)}px`,
}));

const circularStrokeStyle = computed<Record<string, string>>(() => ({
  strokeDasharray: `${CIRCLE_CIRCUMFERENCE}`,
  strokeDashoffset: `${(get(progress) / 100) * -CIRCLE_CIRCUMFERENCE}`,
  // the library's own motion, not Material's standard curve
  transition: 'stroke-dashoffset 200ms ease-out',
}));
</script>

<template>
  <div :class="ui.wrapper()">
    <!-- Circular progress (not supported for buffer variant) -->
    <div
      v-if="circular && variant !== ProgressVariant.buffer"
      :aria-valuenow="ariaValueNow"
      :class="ui.circularContainer()"
      :style="circularSize"
      :data-variant="variant"
      :data-color="color"
      :aria-label="ariaLabel"
      :title="hasLabel && !labelFits ? label : undefined"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
    >
      <svg
        :class="ui.svg()"
        :viewBox="`0 0 ${circularGeometry.viewSize} ${circularGeometry.viewSize}`"
      >
        <!-- Track behind the arc, mirroring the linear rail. Indeterminate spins, so it gets no track. -->
        <circle
          v-if="variant === ProgressVariant.determinate"
          cx="50%"
          cy="50%"
          fill="none"
          :r="CIRCLE_RADIUS"
          :class="ui.circleTrack()"
          :stroke-width="circularGeometry.scaledThickness"
        />
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
        v-if="hasLabel && labelFits"
        :class="ui.label()"
        :style="circularLabelStyle"
        aria-hidden="true"
      >
        {{ label }}
      </div>
    </div>

    <!-- Linear progress (also used as fallback for circular + buffer) -->
    <div
      v-else
      :aria-valuenow="ariaValueNow"
      :class="ui.progressbar()"
      :style="linearStyle"
      :data-variant="variant"
      :data-color="color"
      :aria-label="ariaLabel"
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
        data-id="progress-rail"
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
