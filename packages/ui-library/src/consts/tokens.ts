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
 * Surfaces between the others: `surface-muted` for tracks, wells and quiet chips (a step darker
 * than the card), `surface-sunken` for an inset panel inside a card. Bare channels, per theme.
 */
export const insetSurfaceColors = ['surface-muted', 'surface-sunken'] as const;

/**
 * The tints of each context color: `subtle` (5%) for a large area like a banner, `soft` (10%) for
 * a selected row or a badge, `border` (30%) for its edge.
 */
export const contextTints = { subtle: 5, soft: 10, border: 30 } as const;

/**
 * A categorical palette for charts and legends, eight hues that stay apart from each other and
 * from the status colors, plus a neutral `chart-other` for the rest.
 */
export const chartColors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-6', 'chart-7', 'chart-8', 'chart-other'] as const;

/**
 * The stacking layers, lowest first, as `--rui-z-*` and `z-rui-*`. Everything the library floats
 * sits on one of them, so an app's own fixed parts can slot between instead of guessing a number.
 */
export const zLayers = ['raised', 'floating', 'app-bar', 'drawer', 'dialog', 'menu', 'tooltip', 'toast', 'blocking'] as const;

export type ZLayer = (typeof zLayers)[number];

/** RuiDialog's width presets, as `--rui-dialog-*` and `max-w-rui-dialog-*`. */
export const dialogSizes = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export type DialogSize = (typeof dialogSizes)[number];

/**
 * The neutral ramp, `rui-neutral-50` to `rui-neutral-950`, for the greys that
 * are not Material's `rui-grey`. Its hue is the one place the restyle picks
 * between zinc and slate.
 */
export const neutralShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
