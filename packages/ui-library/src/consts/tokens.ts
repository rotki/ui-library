/**
 * The theme's role tokens, named here so the generated theme and the class
 * merger agree on them: `rounded-rui-control` and `shadow-rui-menu` only
 * dedupe against `rounded-full` or `shadow-lg` when the merger knows the names.
 */
export const radiusRoles = ['control', 'panel', 'card', 'sm', 'lg'] as const;

export type RadiusRole = (typeof radiusRoles)[number];

export const shadowRoles = ['menu', 'drawer', 'tooltip', 'control'] as const;

export type ShadowRole = (typeof shadowRoles)[number];

/**
 * Surfaces by height: the page, a card, a menu, a drawer or notification. Held
 * as bare channels in `--rui-*`, like the palette.
 */
export const surfaceColors = ['background', 'surface', 'menu', 'overlay'] as const;

/** Lines: dividers between rows, and the edge of an outlined control. Held as full colors. */
export const lineColors = ['divider', 'outline'] as const;

/**
 * State layers: translucent fills for a hovered or pressed row, item or chip. Held as full
 * colors. The `state-layer` utility lays one over a fill as a background image, which tints
 * the fill without touching the text, as a `brightness` filter would.
 */
export const stateColors = ['hover', 'pressed'] as const;

/**
 * The neutral ramp, `rui-neutral-50` to `rui-neutral-950`, for the greys that
 * are not Material's `rui-grey`. Its hue is the one place the restyle picks
 * between zinc and slate.
 */
export const neutralShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
