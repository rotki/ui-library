import type { ContextColorsType } from '@/consts/colors';
import { textColorMap } from '@/composables/colors/common';

export function getIconColorClass(color?: ContextColorsType): string | undefined {
  if (!color)
    return undefined;

  return textColorMap[color];
}
