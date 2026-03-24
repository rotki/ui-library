import type { ContextColorsType } from '@/consts/colors';
import { beforeBgColorMap, textColorMap } from '@/composables/colors/common';

interface CheckControlColorClasses {
  ripple: string;
  checked: string;
}

/**
 * Shared by RuiCheckbox and RuiRadio — identical color patterns.
 */
export function getCheckControlColorClasses(color?: ContextColorsType): CheckControlColorClasses | undefined {
  if (!color)
    return undefined;

  return {
    ripple: beforeBgColorMap[color],
    checked: textColorMap[color],
  };
}

export type { CheckControlColorClasses };
