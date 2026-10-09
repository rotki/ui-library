/**
 * Tailwind Variants wrapper.
 *
 * Re-exports `tv` from `tailwind-variants` with project-level configuration.
 * `createTV()` teaches the conflict resolver about the theme's own class
 * groups, so `text-rui-primary` reads as a colour rather than a font size.
 *
 * The resolver ships inside tailwind-variants as of 3.3, which is why there is
 * no `tailwind-merge` dependency: the peer is optional and nothing imports it.
 *
 * @see https://www.tailwind-variants.org/docs/introduction
 */

import type { VueClassValue } from '@/types/class-value';
import { createTV } from 'tailwind-variants';
import { type ClassValue, normalizeClass } from 'vue';
import { dialogSizes, radiusRoles, shadowRoles, zLayers } from '@/consts/tokens';

const isAny: (v: string) => boolean = () => true;

/** The library's tailwind-variants instance, with its own tw-merge groups. */
export const tv = /* #__PURE__ */ createTV({
  twMergeConfig: {
    // `extend` appends to the built-in groups, which is what the flat form these sat in folded into
    extend: {
      // the role tokens, so `rounded-rui-control` replaces `rounded-full` and `shadow-rui-menu` replaces `shadow-2`
      theme: {
        radius: [...radiusRoles.map(role => `rui-${role}`)],
        shadow: [...shadowRoles.map(role => `rui-${role}`), ...Array.from({ length: 24 }, (_, i) => `${i + 1}`)],
        // `max-w-rui-tooltip` replaces a consumer's `max-w-40` on a tooltip, and the reverse
        container: [...dialogSizes.map(size => `rui-dialog-${size}`), 'rui-tooltip'],
      },
      classGroups: {
        // `text-rui-*` is a text colour, so the merger stops classifying it as a font size like the typography utilities below
        'text-color': [{ 'text-rui': [isAny] }],
        'z': [{ z: zLayers.map(layer => `rui-${layer}`) }],
        'font-size': [
          { 'text-body': [isAny] },
          'text-caption',
          'text-caption-2',
          'text-overline',
          { 'text-h': [isAny] },
          { 'text-subtitle': [isAny] },
        ],
      },
    },
  },
});

/**
 * Normalizes any Vue `:class` binding value (string, object, array, nullish
 * or `false`) to a plain string compatible with tailwind-variants' `class`
 * parameter. Accepts Vue's runtime `ClassValue` so call sites can pass
 * `$attrs.class` directly without casting.
 */
export function cn(value: ClassValue | VueClassValue | undefined): string | undefined {
  if (value == null || value === false)
    return undefined;
  if (typeof value === 'string')
    return value || undefined;
  const result = normalizeClass(value);
  return result || undefined;
}
