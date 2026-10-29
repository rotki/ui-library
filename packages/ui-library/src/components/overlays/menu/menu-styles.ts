import { tv } from '@/utils/tv';

export const menuStyles = tv({
  slots: {
    wrapper: 'relative inline-flex max-w-full',
    popover: 'w-max z-rui-menu',
    // a hairline edge keeps the popup apart from a surface of nearly the same shade in dark mode
    content: 'rounded-rui-panel overflow-hidden shadow-rui-menu bg-rui-menu border border-rui-divider text-rui-text focus:outline-hidden p-1',
    details: '',
  },
  variants: {
    fullWidth: {
      true: { wrapper: 'w-full' },
    },
    dense: {
      true: { details: 'px-2' },
      false: { details: 'px-4' },
    },
  },
  defaultVariants: { fullWidth: false, dense: false },
});
