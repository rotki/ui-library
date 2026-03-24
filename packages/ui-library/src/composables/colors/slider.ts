import type { ContextColorsType } from '@/consts/colors';
import { textColorMap } from '@/composables/colors/common';

interface SliderColorClasses {
  /** Container background with opacity: `bg-rui-{color} bg-opacity-40` */
  container: string;
  /** Track background */
  track: string;
  /** Thumb background */
  thumb: string;
  /** Thumb before pseudo-element */
  thumbBefore: string;
  /** Tick marks */
  ticks: string;
  /** Big tick default (lighter) */
  bigTickDefault: string;
  /** Big tick highlighted */
  bigTickHighlighted: string;
}

const sliderColorMap: Record<ContextColorsType, SliderColorClasses> = {
  primary: {
    container: 'bg-rui-primary bg-opacity-40',
    track: 'bg-rui-primary',
    thumb: 'bg-rui-primary',
    thumbBefore: 'before:bg-rui-primary',
    ticks: 'bg-rui-primary',
    bigTickDefault: 'bg-rui-primary-lighter',
    bigTickHighlighted: 'bg-rui-primary',
  },
  secondary: {
    container: 'bg-rui-secondary bg-opacity-40',
    track: 'bg-rui-secondary',
    thumb: 'bg-rui-secondary',
    thumbBefore: 'before:bg-rui-secondary',
    ticks: 'bg-rui-secondary',
    bigTickDefault: 'bg-rui-secondary-lighter',
    bigTickHighlighted: 'bg-rui-secondary',
  },
  error: {
    container: 'bg-rui-error bg-opacity-40',
    track: 'bg-rui-error',
    thumb: 'bg-rui-error',
    thumbBefore: 'before:bg-rui-error',
    ticks: 'bg-rui-error',
    bigTickDefault: 'bg-rui-error-lighter',
    bigTickHighlighted: 'bg-rui-error',
  },
  warning: {
    container: 'bg-rui-warning bg-opacity-40',
    track: 'bg-rui-warning',
    thumb: 'bg-rui-warning',
    thumbBefore: 'before:bg-rui-warning',
    ticks: 'bg-rui-warning',
    bigTickDefault: 'bg-rui-warning-lighter',
    bigTickHighlighted: 'bg-rui-warning',
  },
  info: {
    container: 'bg-rui-info bg-opacity-40',
    track: 'bg-rui-info',
    thumb: 'bg-rui-info',
    thumbBefore: 'before:bg-rui-info',
    ticks: 'bg-rui-info',
    bigTickDefault: 'bg-rui-info-lighter',
    bigTickHighlighted: 'bg-rui-info',
  },
  success: {
    container: 'bg-rui-success bg-opacity-40',
    track: 'bg-rui-success',
    thumb: 'bg-rui-success',
    thumbBefore: 'before:bg-rui-success',
    ticks: 'bg-rui-success',
    bigTickDefault: 'bg-rui-success-lighter',
    bigTickHighlighted: 'bg-rui-success',
  },
};

/**
 * Validation state colors for slider labels (error/success only).
 */
const sliderValidationMap: Record<'error' | 'success', string> = {
  error: textColorMap.error,
  success: textColorMap.success,
};

export function getSliderColorClasses(color?: ContextColorsType): SliderColorClasses | undefined {
  if (!color)
    return undefined;

  return sliderColorMap[color];
}

export function getSliderValidationClass(color: 'error' | 'success'): string {
  return sliderValidationMap[color];
}

export type { SliderColorClasses };
