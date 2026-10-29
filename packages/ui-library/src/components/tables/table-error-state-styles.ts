import { tv } from '@/utils/tv';

/**
 * Centred and capped, like the loading and empty states beside it. Left to
 * span the table, a wide one puts the reason hard left and the retry hard
 * right, with the whole width between them.
 */
export const errorStyles = tv({
  slots: {
    root: 'flex justify-center p-4',
    alert: 'w-full max-w-2xl',
  },
});
