import type { ContextColorsType } from '@/consts/colors';
import { darkLightTextColorMap } from '@/composables/colors/common';

interface BadgeColorClasses {
  base: string;
  dark: string;
}

const badgeColorMap: Record<ContextColorsType, BadgeColorClasses> = {
  primary: {
    base: 'text-white bg-rui-primary',
    dark: 'dark:text-rui-text',
  },
  secondary: {
    base: 'text-white bg-rui-secondary',
    dark: 'dark:text-rui-text',
  },
  error: {
    base: 'text-white bg-rui-error',
    dark: 'dark:text-rui-text',
  },
  warning: {
    base: 'text-white bg-rui-warning',
    dark: darkLightTextColorMap.warning,
  },
  success: {
    base: 'text-white bg-rui-success',
    dark: darkLightTextColorMap.success,
  },
  info: {
    base: 'text-white bg-rui-info',
    dark: darkLightTextColorMap.info,
  },
};

export function getBadgeColorClasses(color?: ContextColorsType): BadgeColorClasses | undefined {
  if (!color)
    return undefined;

  return badgeColorMap[color];
}

export type { BadgeColorClasses };
