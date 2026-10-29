import { ProgressVariant } from '@/components/progress/progress-props';
import { tv } from '@/utils/tv';

export const progressStyles = tv({
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
    // Track behind the bar: one neutral for every named color, neutral-700 in dark like the footer stepper pills, which reads on a near-black page
    { slots: ['rail'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' },
    { slots: ['bufferDots'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'border-rui-neutral-200 dark:border-rui-neutral-700' },
    { slots: ['circleTrack'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: 'stroke-rui-neutral-200 dark:stroke-rui-neutral-700' },
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
