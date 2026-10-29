import { tv } from '@/utils/tv';

export const cardHeaderStyles = tv({
  slots: {
    root: 'flex',
    prepend: 'rounded-full flex items-center justify-center bg-rui-neutral-200 text-rui-neutral-700 dark:bg-rui-neutral-700 dark:text-rui-neutral-200 overflow-hidden',
    // one title style whether or not there is a prepend: a card title is a section heading, not a page title
    header: 'text-base font-semibold text-rui-text',
  },
  variants: {
    dense: {
      true: {
        root: 'p-3 between:ml-2 between:mr-0',
        prepend: 'text-base p-[0.08rem] w-9 h-9',
      },
      false: {
        root: 'p-4 between:ml-4 between:mr-0',
        prepend: 'text-[1.25rem] w-10 h-10',
      },
    },
  },
  defaultVariants: { dense: false },
});
