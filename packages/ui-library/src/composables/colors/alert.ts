import type { ContextColorsType } from '@/consts/colors';
import { borderColorMap, textColorMap } from '@/composables/colors/common';

interface AlertColorClasses {
  light: {
    /** Default variant background with tint */
    default: string;
    /** Default variant background with color-mix-supported tint */
    defaultColorMix: string;
    /** Filled variant background */
    filled: string;
    /** Outlined variant border */
    outlined: string;
    /** Default + outlined content text with shade */
    contentText: string;
    /** Default + outlined content text with color-mix-supported shade */
    contentTextColorMix: string;
  };
  dark: {
    /** Default variant background with shade */
    default: string;
    /** Default variant background with color-mix-supported shade */
    defaultColorMix: string;
    /** Default + outlined content text with tint */
    contentText: string;
    /** Default + outlined content text with color-mix-supported tint */
    contentTextColorMix: string;
    /** Default + outlined icon color */
    icon: string;
    /** Filled variant dark text override (warning/success/info only) */
    filledDarkText: string;
  };
}

const alertColorMap: Record<ContextColorsType, AlertColorClasses> = {
  primary: {
    light: {
      default: 'bg-rui-primary bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-primary-tint/[.9]',
      filled: 'bg-rui-primary',
      outlined: borderColorMap.primary,
      contentText: 'text-rui-primary text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-primary-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-primary-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-primary-tint/[.6]',
      icon: textColorMap.primary,
      filledDarkText: '',
    },
  },
  secondary: {
    light: {
      default: 'bg-rui-secondary bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-secondary-tint/[.9]',
      filled: 'bg-rui-secondary',
      outlined: borderColorMap.secondary,
      contentText: 'text-rui-secondary text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-secondary-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-secondary-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-secondary-tint/[.6]',
      icon: textColorMap.secondary,
      filledDarkText: '',
    },
  },
  error: {
    light: {
      default: 'bg-rui-error bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-error-tint/[.9]',
      filled: 'bg-rui-error',
      outlined: borderColorMap.error,
      contentText: 'text-rui-error text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-error-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-error-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-error-tint/[.6]',
      icon: textColorMap.error,
      filledDarkText: '',
    },
  },
  warning: {
    light: {
      default: 'bg-rui-warning bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-warning-tint/[.9]',
      filled: 'bg-rui-warning',
      outlined: borderColorMap.warning,
      contentText: 'text-rui-warning text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-warning-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-warning-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-warning-tint/[.6]',
      icon: textColorMap.warning,
      filledDarkText: '!text-rui-light-text',
    },
  },
  info: {
    light: {
      default: 'bg-rui-info bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-info-tint/[.9]',
      filled: 'bg-rui-info',
      outlined: borderColorMap.info,
      contentText: 'text-rui-info text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-info-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-info-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-info-tint/[.6]',
      icon: textColorMap.info,
      filledDarkText: '!text-rui-light-text',
    },
  },
  success: {
    light: {
      default: 'bg-rui-success bg-tint-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-success-tint/[.9]',
      filled: 'bg-rui-success',
      outlined: borderColorMap.success,
      contentText: 'text-rui-success text-shade-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-success-shade/[.6] color-mix-supported:animate-none',
    },
    dark: {
      default: 'bg-shade-[.9]',
      defaultColorMix: 'color-mix-supported:bg-rui-success-shade/[.9]',
      contentText: 'text-tint-[.6]',
      contentTextColorMix: 'color-mix-supported:text-rui-success-tint/[.6]',
      icon: textColorMap.success,
      filledDarkText: '!text-rui-light-text',
    },
  },
};

export function getAlertColorClasses(color?: ContextColorsType): AlertColorClasses | undefined {
  if (!color)
    return undefined;

  return alertColorMap[color];
}

export type { AlertColorClasses };
