/**
 * Tailwind Variants wrapper.
 *
 * Re-exports `tv` from `tailwind-variants` with project-level configuration.
 * Uses `createTV()` so we can extend twMerge config for custom theme classes
 * (e.g., `text-rui-primary`) in the future.
 *
 * @see https://www.tailwind-variants.org/docs/introduction
 */

import type { VueClassValue } from '@/types/class-value';
import { createTV } from 'tailwind-variants';
import { normalizeClass } from 'vue';

const isAny: (v: string) => boolean = () => true;

export const tv = /* @__PURE__ */ createTV({
  twMergeConfig: {
    classGroups: {
      'bg-tint': [{ 'bg-tint': [isAny] }],
      'bg-shade': [{ 'bg-shade': [isAny] }],
      'text-tint': [{ 'text-tint': [isAny] }],
      'text-shade': [{ 'text-shade': [isAny] }],
      // Custom theme colors (text-rui-*) belong to the text-color group so
      // they don't conflict with the custom typography utilities below, which
      // tw-merge would otherwise both classify as font-size.
      'text-color': [{ 'text-rui': [isAny] }],
      'font-size': [
        { 'text-body': [isAny] },
        'text-caption',
        'text-overline',
        { 'text-h': [isAny] },
        { 'text-subtitle': [isAny] },
      ],
    },
  },
});

/**
 * Normalizes a VueClassValue (string | object | array) to a plain string
 * compatible with tailwind-variants' class parameter.
 */
export function cn(value: VueClassValue | undefined): string | undefined {
  if (value == null)
    return undefined;
  if (typeof value === 'string')
    return value || undefined;
  const result = normalizeClass(value);
  return result || undefined;
}
