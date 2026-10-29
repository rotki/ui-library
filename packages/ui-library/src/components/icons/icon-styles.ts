import { tv } from '@/utils/tv';

/**
 * The icon's box is always driven by `--rui-icon-size`, so flex shrinking is
 * never wanted: `shrink-0` keeps the size beside a long grow sibling,
 * such as a `w-full` button label in `variant="list"`. Without it the svg is
 * compressed along the main axis while its height stays put, drawing a sliver
 * of a glyph.
 *
 * The stroke is set on the svg as CSS, so `--rui-icon-stroke` can retune it.
 * Lucide's 2 reads heavy beside Inter; 1.5 would draw a 16px glyph at a
 * single, blurry pixel.
 *
 * The svg also carries the default paint, outlined in `currentColor`, and
 * every primitive inherits it unless it sets its own `fill` or `stroke`. That
 * is how lucide draws, so its solid dots (tag, palette) stay solid, and how an
 * icon mixes a stroked outline with a solid mark.
 */
export const iconStyles = tv({
  base: 'shrink-0 w-(--rui-icon-size,1.5rem) h-(--rui-icon-size,1.5rem) [stroke-width:var(--rui-icon-stroke,1.75)]',
  variants: {
    color: {
      primary: 'text-rui-primary',
      secondary: 'text-rui-secondary',
      error: 'text-rui-error',
      warning: 'text-rui-warning',
      info: 'text-rui-info',
      success: 'text-rui-success',
    },
  },
});
