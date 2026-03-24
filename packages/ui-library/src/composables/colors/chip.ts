import type { ContextColorsType } from '@/consts/colors';

interface ChipColorClasses {
  filled: string;
  outlined: string;
  outlinedInteractive: string;
  darkFilledText: string;
}

const chipColorMap: Record<ContextColorsType, ChipColorClasses> = {
  primary: {
    filled: 'text-rui-dark-text bg-rui-primary',
    outlined: 'border text-rui-primary border-rui-primary/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-primary/[0.04] focus:bg-rui-primary/[0.12]',
    darkFilledText: '',
  },
  secondary: {
    filled: 'text-rui-dark-text bg-rui-secondary',
    outlined: 'border text-rui-secondary border-rui-secondary/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-secondary/[0.04] focus:bg-rui-secondary/[0.12]',
    darkFilledText: '',
  },
  error: {
    filled: 'text-rui-dark-text bg-rui-error',
    outlined: 'border text-rui-error border-rui-error/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-error/[0.04] focus:bg-rui-error/[0.12]',
    darkFilledText: '',
  },
  warning: {
    filled: 'text-rui-dark-text bg-rui-warning',
    outlined: 'border text-rui-warning border-rui-warning/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-warning/[0.04] focus:bg-rui-warning/[0.12]',
    darkFilledText: 'dark:text-rui-light-text',
  },
  success: {
    filled: 'text-rui-dark-text bg-rui-success',
    outlined: 'border text-rui-success border-rui-success/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-success/[0.04] focus:bg-rui-success/[0.12]',
    darkFilledText: 'dark:text-rui-light-text',
  },
  info: {
    filled: 'text-rui-dark-text bg-rui-info',
    outlined: 'border text-rui-info border-rui-info/50 bg-transparent',
    outlinedInteractive: 'hover:bg-rui-info/[0.04] focus:bg-rui-info/[0.12]',
    darkFilledText: 'dark:text-rui-light-text',
  },
};

export function getChipColorClasses(color?: ContextColorsType): ChipColorClasses | undefined {
  if (!color)
    return undefined;

  return chipColorMap[color];
}

export type { ChipColorClasses };
