import { tv } from '@/utils/tv';

export const tooltipStyles = tv({
  slots: {
    arrow: 'absolute block w-2.5 h-2.5 transition-opacity',
    diamond: 'block border-[0.3125rem] origin-center border-l-transparent border-b-transparent border-t-rui-grey-700/90 border-r-rui-grey-700/90 rounded-[0_0.125rem_0_0]',
  },
  variants: {
    open: {
      true: { arrow: 'opacity-100' },
      false: { arrow: 'opacity-0' },
    },
    side: {
      top: {
        arrow: 'bottom-[calc(0.5px-0.3125rem)]',
        diamond: 'rotate-[135deg]',
      },
      bottom: {
        arrow: 'top-[calc(0.5px-0.3125rem)]',
        diamond: '-rotate-45',
      },
      left: {
        arrow: 'right-[calc(0.5px-0.3125rem)]',
        diamond: 'rotate-45',
      },
      right: {
        arrow: 'left-[calc(0.5px-0.3125rem)]',
        diamond: '-rotate-[135deg]',
      },
    },
  },
  defaultVariants: { open: false, side: 'bottom' },
});
