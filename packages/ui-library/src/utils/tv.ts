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

const isAny: (v: string) => boolean = () => true;

/** An outline width: a scale number, an arbitrary `[2px]`, or an arbitrary variable `(--w)`. */
function isWidth(value: string): boolean {
  return /^\d+$/.test(value) || /^\[.+\]$/.test(value) || /^\(.+\)$/.test(value);
}

/** The library's tailwind-variants instance, with its own tw-merge groups. */
export const tv = /* #__PURE__ */ createTV({
  twMergeConfig: {
    // `extend` appends to the built-in groups, which is what the flat form these sat in folded into
    extend: {
      classGroups: {
        'bg-tint': [{ 'bg-tint': [isAny] }],
        'bg-shade': [{ 'bg-shade': [isAny] }],
        'text-tint': [{ 'text-tint': [isAny] }],
        'text-shade': [{ 'text-shade': [isAny] }],
        // `text-rui-*` is a text colour, so the merger stops classifying it as a font size like the typography utilities below
        'text-color': [{ 'text-rui': [isAny] }],
        /*
         * Tailwind 3's `*-opacity-*` utilities, which the merger has no group for: it ships the
         * Tailwind 4 groups, where they no longer exist. `bg-opacity-40` then parses as a
         * background *colour*, lands in the same group as `bg-rui-primary`, and wins as the later
         * class, leaving the element with an opacity and no colour. Giving them groups of their
         * own keeps both. They can go when the project moves to Tailwind 4 and slash opacity.
         */
        'bg-opacity': [{ 'bg-opacity': [isAny] }],
        'text-opacity': [{ 'text-opacity': [isAny] }],
        'border-opacity': [{ 'border-opacity': [isAny] }],
        'ring-opacity': [{ 'ring-opacity': [isAny] }],
        'ring-offset-opacity': [{ 'ring-offset-opacity': [isAny] }],
        'divide-opacity': [{ 'divide-opacity': [isAny] }],
        'placeholder-opacity': [{ 'placeholder-opacity': [isAny] }],
        /*
         * A bare `outline` is `outline-style: solid` in Tailwind 3 and a *width* in Tailwind 4,
         * so the merger reads it as a width and `outline outline-1` loses the style, leaving an
         * outlined button with a colour, a width and nothing drawn. It belongs with the other
         * style keywords here, and comes back out of the width group in `override` below.
         */
        'outline-style': ['outline'],
        'font-size': [
          { 'text-body': [isAny] },
          'text-caption',
          'text-overline',
          { 'text-h': [isAny] },
          { 'text-subtitle': [isAny] },
        ],
      },
    },
    override: {
      classGroups: {
        /*
         * Without the empty string the built-in group carries, a bare `outline` stops counting as
         * a width and stays a style keyword, the way Tailwind 3 means it. Widths still replace one
         * another.
         */
        'outline-w': [{ outline: [isWidth] }],
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
