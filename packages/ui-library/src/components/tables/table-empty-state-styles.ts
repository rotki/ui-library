import { tv } from '@/utils/tv';

export const emptyStyles = tv({
  slots: {
    root: 'flex flex-col items-center justify-center flex-1',
    title: 'text-body-1 font-semibold text-center text-current pb-0 mb-0',
    subtitle: 'text-body-2 text-center text-rui-text-secondary pb-0 mb-0',
  },
  variants: {
    compact: {
      true: {
        root: 'gap-1 py-6',
        title: 'font-normal text-rui-text-secondary',
      },
      false: {
        root: 'gap-3 min-h-56 my-4',
      },
    },
  },
});
