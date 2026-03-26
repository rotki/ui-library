import type { ContextColorsType } from '@/consts/colors';
import { tv } from '@/utils/tv';

export const SliderInteraction = {
  idle: 'idle',
  hover: 'hover',
  focus: 'focus',
  active: 'active',
} as const;

export type SliderInteraction = (typeof SliderInteraction)[keyof typeof SliderInteraction];

/** Static class map for highlighted big-tick colors (avoids dynamic class construction) */
export const HIGHLIGHT_COLOR_MAP: Record<ContextColorsType, string> = {
  primary: '!bg-rui-primary',
  secondary: '!bg-rui-secondary',
  error: '!bg-rui-error',
  warning: '!bg-rui-warning',
  info: '!bg-rui-info',
  success: '!bg-rui-success',
};

/** Default highlighted tick color (non-big-tick) */
export const HIGHLIGHT_DEFAULT = 'bg-rui-grey-100 dark:bg-[#121212]';

export const sliderStyles = tv({
  slots: {
    wrapper: 'flex items-start gap-3',
    label: 'mt-1 text-rui-text text-body-1',
    outer: 'relative h-8 flex-1 min-w-[7.5rem]',
    inner: 'relative',
    input: 'h-full w-full opacity-0 cursor-pointer',
    slider: 'absolute h-full w-full top-0 px-2 pointer-events-none',
    sliderInner: 'relative h-full w-full cursor-pointer',
    container: 'absolute top-1/2 -translate-y-1/2 w-full h-1 rounded-full',
    track: 'transition-all ease-linear duration-75 h-full rounded-full',
    ticks: 'h-full absolute top-0 flex justify-between items-center',
    tick: 'rounded-full',
    thumb: 'absolute top-1/2 transition-all ease-linear duration-75 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-2',
    thumbRipple: [
      `before:content-[''] before:w-8 before:h-8 before:rounded-full before:absolute before:top-1/2 before:left-1/2`,
      'before:opacity-10 before:transition before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0',
    ].join(' '),
    thumbLabel: [
      'invisible opacity-0',
      'absolute -mt-7 transition-all ease-linear duration-75 -translate-x-1/2',
      'px-2 py-1 text-xs font-normal',
      'bg-rui-grey-700/90 text-white rounded shadow',
    ].join(' '),
  },
  variants: {
    disabled: {
      true: {
        label: 'text-rui-text-disabled',
        container: '!bg-rui-grey-300 dark:!bg-rui-grey-800',
        track: '!bg-rui-grey-400 dark:!bg-rui-grey-700',
        thumb: '!bg-rui-grey-400 dark:!bg-rui-grey-700',
      },
    },
    vertical: {
      true: {
        wrapper: 'flex-col-reverse items-center h-full',
        label: 'mb-2 text-center',
        outer: 'min-w-0 min-h-[7.5rem] w-8',
        inner: '-rotate-90',
        thumbLabel: 'mt-6 rotate-90 translate-x-0 [transform-origin:0_50%]',
      },
    },
    interaction: {
      idle: {},
      hover: { thumbRipple: 'before:scale-100' },
      focus: { thumbRipple: 'before:scale-100 before:opacity-15' },
      active: { thumbRipple: 'before:scale-100 before:opacity-30', thumbLabel: 'visible opacity-100' },
    },
    validation: {
      error: { label: 'text-rui-error' },
      success: { label: 'text-rui-success' },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
    bigTick: {
      true: {},
    },
  },
  compoundSlots: [
    // Container bg (with opacity)
    { slots: ['container'], color: 'primary', class: 'bg-rui-primary bg-opacity-40' },
    { slots: ['container'], color: 'secondary', class: 'bg-rui-secondary bg-opacity-40' },
    { slots: ['container'], color: 'error', class: 'bg-rui-error bg-opacity-40' },
    { slots: ['container'], color: 'warning', class: 'bg-rui-warning bg-opacity-40' },
    { slots: ['container'], color: 'info', class: 'bg-rui-info bg-opacity-40' },
    { slots: ['container'], color: 'success', class: 'bg-rui-success bg-opacity-40' },

    // Track + thumb + thumb ripple + tick color
    { slots: ['track', 'thumb', 'tick'], color: 'primary', class: 'bg-rui-primary' },
    { slots: ['track', 'thumb', 'tick'], color: 'secondary', class: 'bg-rui-secondary' },
    { slots: ['track', 'thumb', 'tick'], color: 'error', class: 'bg-rui-error' },
    { slots: ['track', 'thumb', 'tick'], color: 'warning', class: 'bg-rui-warning' },
    { slots: ['track', 'thumb', 'tick'], color: 'info', class: 'bg-rui-info' },
    { slots: ['track', 'thumb', 'tick'], color: 'success', class: 'bg-rui-success' },

    // Thumb ripple (before pseudo) color
    { slots: ['thumbRipple'], color: 'primary', class: 'before:bg-rui-primary' },
    { slots: ['thumbRipple'], color: 'secondary', class: 'before:bg-rui-secondary' },
    { slots: ['thumbRipple'], color: 'error', class: 'before:bg-rui-error' },
    { slots: ['thumbRipple'], color: 'warning', class: 'before:bg-rui-warning' },
    { slots: ['thumbRipple'], color: 'info', class: 'before:bg-rui-info' },
    { slots: ['thumbRipple'], color: 'success', class: 'before:bg-rui-success' },
  ],
  compoundVariants: [
    // Big tick: lighter default, color highlighted
    { bigTick: true, color: 'primary', class: { tick: '!bg-rui-primary-lighter' } },
    { bigTick: true, color: 'secondary', class: { tick: '!bg-rui-secondary-lighter' } },
    { bigTick: true, color: 'error', class: { tick: '!bg-rui-error-lighter' } },
    { bigTick: true, color: 'warning', class: { tick: '!bg-rui-warning-lighter' } },
    { bigTick: true, color: 'info', class: { tick: '!bg-rui-info-lighter' } },
    { bigTick: true, color: 'success', class: { tick: '!bg-rui-success-lighter' } },
  ],
  defaultVariants: {
    interaction: 'idle',
    color: 'primary',
  },
});
