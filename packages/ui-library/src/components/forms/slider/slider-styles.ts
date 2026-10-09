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
  primary: '!bg-rui-primary-fill',
  secondary: '!bg-rui-secondary-fill',
  error: '!bg-rui-error-fill',
  warning: '!bg-rui-warning-fill',
  info: '!bg-rui-info-fill',
  success: '!bg-rui-success-fill',
};

/** Default highlighted tick color (non-big-tick) */
export const HIGHLIGHT_DEFAULT = 'bg-rui-neutral-100 dark:bg-rui-neutral-950';

export const sliderStyles = tv({
  slots: {
    root: '',
    wrapper: 'flex items-start',
    // classes added to RuiFieldLabel, which carries the type and its neutral and disabled colors
    label: '',
    outer: 'relative h-8 flex-1 min-w-[7.5rem]',
    inner: 'relative',
    input: 'peer h-full w-full opacity-0 cursor-pointer',
    // the range input is invisible, so its keyboard focus rings the thumb drawn over it
    slider: 'absolute h-full w-full top-0 px-2 pointer-events-none peer-focus-visible:[&_[data-id=slider-thumb]]:focus-ring',
    sliderInner: 'relative h-full w-full cursor-pointer',
    // a quiet neutral rail in every color, so only the filled part and the thumb carry it; a step lighter in dark to stay findable
    container: 'absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-rui-neutral-200 dark:bg-rui-neutral-700',
    track: 'transition-all ease-linear duration-75 h-full rounded-full',
    ticks: 'h-full absolute top-0 flex justify-between items-center',
    tick: 'rounded-full',
    // a white knob with a colored edge, like the switch's, that gains a soft halo instead of growing
    thumb: [
      'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full',
      'bg-white border-2 shadow-rui-control transition-[left,top,box-shadow] ease-linear duration-75',
    ].join(' '),
    thumbLabel: [
      'invisible opacity-0',
      'absolute -mt-7 transition-all ease-linear duration-75 -translate-x-1/2',
      'px-2 py-1 text-xs font-normal',
      'bg-rui-neutral-900 dark:bg-rui-neutral-700 text-white rounded-rui-control shadow-rui-tooltip',
    ].join(' '),
  },
  variants: {
    disabled: {
      true: {
        container: '!bg-rui-neutral-200 dark:!bg-rui-neutral-800',
        track: '!bg-rui-neutral-400 dark:!bg-rui-neutral-600',
        thumb: '!border-rui-neutral-400 dark:!border-rui-neutral-600 dark:!bg-rui-neutral-300 !ring-0',
      },
    },
    vertical: {
      true: {
        // the label stays above, centred over the upright rail, which takes the height left under it
        root: 'flex flex-col',
        wrapper: 'flex-col-reverse items-center flex-1 min-h-0',
        label: 'text-center',
        outer: 'min-w-0 min-h-[7.5rem] w-8',
        // turned about its top-left corner, then pushed down its own height back into the box
        inner: '-rotate-90 translate-y-(--rui-slider-shift)',
        thumbLabel: 'mt-6 rotate-90 translate-x-0 [transform-origin:0_50%]',
      },
    },
    interaction: {
      idle: {},
      hover: { thumb: 'ring-4' },
      // keyboard focus shows the value too, since arrow keys move the thumb without a press
      focus: { thumbLabel: 'visible opacity-100' },
      active: { thumb: 'ring-6', thumbLabel: 'visible opacity-100' },
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
      // small ticks sit inside the rail, whose rounded ends already mark the first and last stop
      false: {
        ticks: '[&>span:first-child]:invisible [&>span:last-child]:invisible',
        // two shades off the rail in either theme, so a 2px dot still shows on the empty part
        tick: 'bg-rui-neutral-500 dark:bg-rui-neutral-300',
      },
      true: {},
    },
    hasLabel: {
      true: {},
      false: {},
    },
  },
  compoundSlots: [
    // The filled part takes the color's fill tone, which is the deep one for a status color in dark
    { slots: ['track'], color: 'primary', class: 'bg-rui-primary-fill' },
    { slots: ['track'], color: 'secondary', class: 'bg-rui-secondary-fill' },
    { slots: ['track'], color: 'error', class: 'bg-rui-error-fill' },
    { slots: ['track'], color: 'warning', class: 'bg-rui-warning-fill' },
    { slots: ['track'], color: 'info', class: 'bg-rui-info-fill' },
    { slots: ['track'], color: 'success', class: 'bg-rui-success-fill' },

    // The thumb's edge and its hover halo
    { slots: ['thumb'], color: 'primary', class: 'border-rui-primary-fill ring-rui-primary-soft' },
    { slots: ['thumb'], color: 'secondary', class: 'border-rui-secondary-fill ring-rui-secondary-soft' },
    { slots: ['thumb'], color: 'error', class: 'border-rui-error-fill ring-rui-error-soft' },
    { slots: ['thumb'], color: 'warning', class: 'border-rui-warning-fill ring-rui-warning-soft' },
    { slots: ['thumb'], color: 'info', class: 'border-rui-info-fill ring-rui-info-soft' },
    { slots: ['thumb'], color: 'success', class: 'border-rui-success-fill ring-rui-success-soft' },
  ],
  compoundVariants: [
    // Big tick: lighter default, color highlighted
    { bigTick: true, color: 'primary', class: { tick: '!bg-rui-primary-lighter' } },
    { bigTick: true, color: 'secondary', class: { tick: '!bg-rui-secondary-lighter' } },
    { bigTick: true, color: 'error', class: { tick: '!bg-rui-error-lighter' } },
    { bigTick: true, color: 'warning', class: { tick: '!bg-rui-warning-lighter' } },
    { bigTick: true, color: 'info', class: { tick: '!bg-rui-info-lighter' } },
    { bigTick: true, color: 'success', class: { tick: '!bg-rui-success-lighter' } },
    // the rail sits mid-way down its 32px hit area, so a label above pulls that area up to keep the gap of a field
    { vertical: false, hasLabel: true, class: { outer: '-mt-2' } },
  ],
  defaultVariants: {
    interaction: 'idle',
    color: 'primary',
    bigTick: false,
  },
});
