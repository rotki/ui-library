import type { ContextColorsType } from '@/consts/colors';

interface ButtonColorClasses {
  /** Default variant: bg, text, hover, active, ring */
  default: string;
  /** Default variant active state */
  defaultActive: string;
  /** Dark mode text override for default variant (warning/success/info only) */
  defaultDarkText: string;
  /** Outlined + text variants: bg, hover, active, text */
  outlinedText: string;
  /** Outlined + text active state */
  outlinedTextActive: string;
  /** Outlined + text active dark override (primary/secondary only) */
  outlinedTextActiveDark: string;
  /** Outlined border */
  outlined: string;
}

const buttonColorMap: Record<ContextColorsType, ButtonColorClasses> = {
  primary: {
    default: 'bg-rui-primary hover:bg-rui-primary-darker active:bg-rui-primary-darker/90 text-rui-dark-text ring-rui-primary/40 dark:text-rui-text dark:ring-rui-primary/60',
    defaultActive: 'bg-rui-primary-darker',
    defaultDarkText: '',
    outlinedText: 'bg-transparent hover:bg-rui-primary-lighter/[.04] active:bg-rui-primary-lighter/10 text-rui-primary',
    outlinedTextActive: 'bg-rui-primary-lighter/30',
    outlinedTextActiveDark: 'dark:bg-rui-primary-darker/60 dark:text-rui-primary-lighter',
    outlined: 'outline-rui-primary/[0.5]',
  },
  secondary: {
    default: 'bg-rui-secondary hover:bg-rui-secondary-darker active:bg-rui-secondary-darker/90 text-rui-dark-text ring-rui-secondary/40 dark:text-rui-text dark:ring-rui-secondary/60',
    defaultActive: 'bg-rui-secondary-darker',
    defaultDarkText: '',
    outlinedText: 'bg-transparent hover:bg-rui-secondary-lighter/[.04] active:bg-rui-secondary-lighter/10 text-rui-secondary',
    outlinedTextActive: 'bg-rui-secondary-lighter/30',
    outlinedTextActiveDark: 'dark:bg-rui-secondary-darker/60 dark:text-rui-secondary-lighter',
    outlined: 'outline-rui-secondary/[0.5]',
  },
  error: {
    default: 'bg-rui-error hover:bg-rui-error-darker active:bg-rui-error-darker/90 text-rui-dark-text ring-rui-error/40 dark:text-rui-text dark:ring-rui-error/60',
    defaultActive: 'bg-rui-error-darker',
    defaultDarkText: '',
    outlinedText: 'bg-transparent hover:bg-rui-error-lighter/[.04] active:bg-rui-error-lighter/10 text-rui-error',
    outlinedTextActive: 'bg-rui-error-lighter/30',
    outlinedTextActiveDark: '',
    outlined: 'outline-rui-error/[0.5]',
  },
  warning: {
    default: 'bg-rui-warning hover:bg-rui-warning-darker active:bg-rui-warning-darker/90 text-rui-dark-text ring-rui-warning/40 dark:text-rui-text dark:ring-rui-warning/60',
    defaultActive: 'bg-rui-warning-darker',
    defaultDarkText: 'dark:text-rui-light-text',
    outlinedText: 'bg-transparent hover:bg-rui-warning-lighter/[.04] active:bg-rui-warning-lighter/10 text-rui-warning',
    outlinedTextActive: 'bg-rui-warning-lighter/30',
    outlinedTextActiveDark: '',
    outlined: 'outline-rui-warning/[0.5]',
  },
  info: {
    default: 'bg-rui-info hover:bg-rui-info-darker active:bg-rui-info-darker/90 text-rui-dark-text ring-rui-info/40 dark:text-rui-text dark:ring-rui-info/60',
    defaultActive: 'bg-rui-info-darker',
    defaultDarkText: 'dark:text-rui-light-text',
    outlinedText: 'bg-transparent hover:bg-rui-info-lighter/[.04] active:bg-rui-info-lighter/10 text-rui-info',
    outlinedTextActive: 'bg-rui-info-lighter/30',
    outlinedTextActiveDark: '',
    outlined: 'outline-rui-info/[0.5]',
  },
  success: {
    default: 'bg-rui-success hover:bg-rui-success-darker active:bg-rui-success-darker/90 text-rui-dark-text ring-rui-success/40 dark:text-rui-text dark:ring-rui-success/60',
    defaultActive: 'bg-rui-success-darker',
    defaultDarkText: 'dark:text-rui-light-text',
    outlinedText: 'bg-transparent hover:bg-rui-success-lighter/[.04] active:bg-rui-success-lighter/10 text-rui-success',
    outlinedTextActive: 'bg-rui-success-lighter/30',
    outlinedTextActiveDark: '',
    outlined: 'outline-rui-success/[0.5]',
  },
};

export function getButtonColorClasses(color?: ContextColorsType): ButtonColorClasses | undefined {
  if (!color)
    return undefined;

  return buttonColorMap[color];
}

export type { ButtonColorClasses };
