import { tv } from '@/utils/tv';

export const footerStepperStyles = {
  // the current bullet stretches into a short bar, so position reads without relying on color
  bullet: tv({
    base: [
      'h-2 w-2 rounded-full bg-rui-neutral-300 transition-[width,background-color] duration-200 ease-out dark:bg-rui-neutral-600',
      'hover:bg-rui-neutral-400 dark:hover:bg-rui-neutral-500 focus-visible:focus-ring outline-hidden',
    ].join(' '),
    variants: {
      active: {
        true: 'w-5 bg-rui-primary hover:bg-rui-primary dark:bg-rui-primary dark:hover:bg-rui-primary',
      },
    },
  }),
  pill: tv({
    base: 'rounded-full h-1.5 w-full bg-rui-neutral-200 dark:bg-rui-neutral-700 transition-colors',
    variants: {
      active: {
        true: 'bg-rui-primary dark:bg-rui-primary',
      },
    },
  }),
};
