import { tv } from '@/utils/tv';

/**
 * The arrow is a solid square turned 45°, centred on the bubble's edge so half of it tucks under the
 * bubble in the same color. A triangle drawn from two borders showed a hairline where the borders
 * met, and a square has no such join. Being symmetric, it needs no rotation per side.
 */
export const tooltipStyles = tv({
  slots: {
    arrow: 'absolute block size-2 transition-opacity',
    // eslint-disable-next-line better-tailwindcss/no-restricted-classes -- the tip of the arrow is geometry, not a surface's corner
    diamond: 'block size-2 rotate-45 rounded-[0.0625rem] bg-rui-neutral-900 dark:bg-rui-neutral-700',
  },
  variants: {
    open: {
      true: { arrow: 'opacity-100' },
      false: { arrow: 'opacity-0' },
    },
    side: {
      top: { arrow: '-bottom-1' },
      bottom: { arrow: '-top-1' },
      left: { arrow: '-right-1' },
      right: { arrow: '-left-1' },
    },
  },
  defaultVariants: { open: false, side: 'bottom' },
});
