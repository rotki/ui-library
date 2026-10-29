import { tv } from '@/utils/tv';

export const paginationStyles = tv({
  slots: {
    wrapper: 'relative flex flex-wrap items-center justify-end gap-x-4 gap-y-0',
    limit: 'flex items-center between:ml-2 between:mr-0 text-caption',
    ranges: 'flex items-center between:ml-2 between:mr-0 text-caption pr-2',
    pageInput: 'w-14 [&_input]:text-center [&_input]:px-1! [&_input]:text-xs! [&_input]:leading-5!',
    sectionLabel: 'text-rui-text-secondary whitespace-nowrap py-3',
    select: 'text-xs! pl-3!',
    indicator: 'text-rui-text text-caption whitespace-nowrap',
    navigation: 'flex items-center',
  },
  variants: {
    // the selects match the icon buttons, 28px with `size="sm"` and 32px without
    dense: {
      true: {
        select: 'min-h-7!',
        pageInput: '[&_input]:py-1!',
      },
      false: {
        select: 'min-h-8!',
        pageInput: '[&_input]:py-1.5!',
      },
    },
    mobile: {
      true: {
        wrapper: 'flex-nowrap justify-between gap-x-2 gap-y-0',
        ranges: 'pr-0',
        // sr-only rather than hidden: a display:none label names nothing
        sectionLabel: 'sr-only',
      },
    },
  },
});
