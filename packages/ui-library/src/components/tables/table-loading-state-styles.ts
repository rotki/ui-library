import { tv } from '@/utils/tv';

export const loadingStyles = tv({
  slots: {
    root: 'flex items-center justify-center',
  },
  variants: {
    compact: {
      true: { root: 'py-6' },
      false: { root: 'min-h-56 py-8' },
    },
  },
});
