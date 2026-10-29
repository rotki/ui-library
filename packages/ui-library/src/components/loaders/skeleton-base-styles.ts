import { tv } from '@/utils/tv';

export const skeletonBaseStyles = tv({
  // zinc steps rather than translucent black and white, which in dark came out lighter than any surface
  base: 'animate-pulse bg-rui-neutral-200 dark:bg-rui-neutral-800',
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-xs',
      md: 'rounded-rui-control',
      lg: 'rounded-rui-card',
      full: 'rounded-full',
    },
  },
});
