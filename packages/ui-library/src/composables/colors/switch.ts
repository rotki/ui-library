import type { ContextColorsType } from '@/consts/colors';
import { bgColorMap } from '@/composables/colors/common';

interface SwitchColorClasses {
  lightInput: string;
  darkInput: string;
  darkToggle: string;
}

const switchColorMap: Record<ContextColorsType, SwitchColorClasses> = {
  primary: {
    lightInput: bgColorMap.primary,
    darkInput: 'bg-rui-primary/[0.5]',
    darkToggle: bgColorMap.primary,
  },
  secondary: {
    lightInput: bgColorMap.secondary,
    darkInput: 'bg-rui-secondary/[0.5]',
    darkToggle: bgColorMap.secondary,
  },
  error: {
    lightInput: bgColorMap.error,
    darkInput: 'bg-rui-error/[0.5]',
    darkToggle: bgColorMap.error,
  },
  warning: {
    lightInput: bgColorMap.warning,
    darkInput: 'bg-rui-warning/[0.5]',
    darkToggle: bgColorMap.warning,
  },
  info: {
    lightInput: bgColorMap.info,
    darkInput: 'bg-rui-info/[0.5]',
    darkToggle: bgColorMap.info,
  },
  success: {
    lightInput: bgColorMap.success,
    darkInput: 'bg-rui-success/[0.5]',
    darkToggle: bgColorMap.success,
  },
};

export function getSwitchColorClasses(color?: ContextColorsType): SwitchColorClasses | undefined {
  if (!color)
    return undefined;

  return switchColorMap[color];
}

export type { SwitchColorClasses };
