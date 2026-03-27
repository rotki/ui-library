import { tv } from '@/utils/tv';

export const timePickerStyles = tv({
  slots: {
    root: 'bg-white overflow-hidden text-rui-text p-3 dark:bg-rui-grey-900',
    digitalDisplay: 'mb-2 text-center',
    digit: 'text-2xl font-semibold cursor-pointer',
    clockFace: 'relative rounded-full w-64 h-64 mx-auto border border-rui-grey-200 dark:border-rui-grey-800',
    centerDot: 'absolute rounded-full bg-rui-primary w-3 h-3',
    clockHand: 'absolute w-[1.5px] bg-rui-primary rounded-full',
    clockHandCircle: 'absolute border-2 border-rui-primary',
    clockNumber: [
      'absolute text-center text-sm font-medium w-8 h-8',
      'flex items-center justify-center',
      'hover:bg-rui-primary-lighter cursor-pointer rounded-full',
    ].join(' '),
  },
  variants: {
    bordered: {
      true: {
        root: 'rounded-md shadow-sm border border-rui-grey-200 dark:border-rui-grey-800',
      },
    },
    active: {
      true: {
        digit: 'text-rui-primary',
      },
    },
    selected: {
      true: {
        clockNumber: 'bg-rui-primary text-rui-dark-text dark:text-rui-light-text z-10 font-bold',
      },
    },
  },
});
