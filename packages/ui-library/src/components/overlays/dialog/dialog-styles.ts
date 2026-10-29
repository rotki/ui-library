import { tv } from '@/utils/tv';

export const dialogStyles = tv({
  slots: {
    root: 'fixed inset-0',
    overlay: 'absolute inset-0 backdrop-blur-sm bg-rui-neutral-950/40 dark:bg-black/60',
    content: 'absolute left-1/2 bottom-0 -translate-x-1/2 outline-hidden overflow-y-auto max-h-(--rui-dialog-max-height)',
  },
  variants: {
    /*
     * The corners match a RuiCard's, the usual content, which the box clips while it scrolls.
     * A sheet sits on the screen's bottom edge, so its content's bottom corners are squared.
     */
    bottomSheet: {
      true: { content: 'rounded-t-rui-card shadow-rui-drawer *:rounded-b-none' },
      false: { content: 'top-1/2 -translate-y-1/2 bottom-auto rounded-rui-card shadow-rui-menu' },
    },
  },
  defaultVariants: { bottomSheet: false },
});
