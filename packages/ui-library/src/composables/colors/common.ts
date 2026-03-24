import type { ContextColorsType } from '@/consts/colors';

/**
 * Base color class maps used by multiple components.
 * Each map provides static Tailwind class strings keyed by context color.
 */

/** `text-rui-{color}` — used by icon, checkbox (checked), form focus labels, etc. */
export const textColorMap: Record<ContextColorsType, string> = {
  primary: 'text-rui-primary',
  secondary: 'text-rui-secondary',
  error: 'text-rui-error',
  warning: 'text-rui-warning',
  info: 'text-rui-info',
  success: 'text-rui-success',
};

/** `bg-rui-{color}` — used by switch, slider track, chip filled, etc. */
export const bgColorMap: Record<ContextColorsType, string> = {
  primary: 'bg-rui-primary',
  secondary: 'bg-rui-secondary',
  error: 'bg-rui-error',
  warning: 'bg-rui-warning',
  info: 'bg-rui-info',
  success: 'bg-rui-success',
};

/** `before:bg-rui-{color}` — used by checkbox and radio ripple */
export const beforeBgColorMap: Record<ContextColorsType, string> = {
  primary: 'before:bg-rui-primary',
  secondary: 'before:bg-rui-secondary',
  error: 'before:bg-rui-error',
  warning: 'before:bg-rui-warning',
  info: 'before:bg-rui-info',
  success: 'before:bg-rui-success',
};

/** `border-rui-{color}` — used by text fields, alerts, etc. */
export const borderColorMap: Record<ContextColorsType, string> = {
  primary: 'border-rui-primary',
  secondary: 'border-rui-secondary',
  error: 'border-rui-error',
  warning: 'border-rui-warning',
  info: 'border-rui-info',
  success: 'border-rui-success',
};

/** `after:border-rui-{color}` — used by text field and text area labels */
export const afterBorderColorMap: Record<ContextColorsType, string> = {
  primary: 'after:border-rui-primary',
  secondary: 'after:border-rui-secondary',
  error: 'after:border-rui-error',
  warning: 'after:border-rui-warning',
  info: 'after:border-rui-info',
  success: 'after:border-rui-success',
};

/**
 * Colors that need `dark:text-rui-light-text` on filled/default variants.
 * warning, success, info need special dark mode text treatment.
 */
export const darkLightTextColorMap: Record<ContextColorsType, string> = {
  primary: '',
  secondary: '',
  error: '',
  warning: 'dark:text-rui-light-text',
  info: 'dark:text-rui-light-text',
  success: 'dark:text-rui-light-text',
};
