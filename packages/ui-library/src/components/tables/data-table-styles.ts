import { tv } from '@/utils/tv';

export { getAlignClass } from '@/components/tables/table-props';

export const dataTableStyles = tv({
  slots: {
    wrapper: 'relative divide-y divide-black/[0.12] dark:divide-white/[0.12] overflow-hidden',
    scroller: 'overflow-x-auto overflow-y-hidden [clip-path:inset(0_0_0_0)]',
    table: 'min-w-full table-fixed divide-y divide-black/[0.12] dark:divide-white/[0.12] whitespace-nowrap mx-auto my-0 max-w-fit relative border-black/[0.12] dark:border-white/[0.12]',
    tbody: 'divide-y divide-black/[0.12] dark:divide-white/[0.12]',
    tr: 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]',
    td: 'p-4 text-rui-text text-body-2 [text-wrap:initial]',
    checkbox: 'px-2 w-[3.625rem] max-w-[3.625rem] [&_label]:ml-0',
    tbodyLoader: 'text-center',
    tbodyLoaderContent: 'flex items-center justify-center min-h-56 py-8',
  },
  variants: {
    outlined: {
      true: { wrapper: 'border border-black/[0.12] dark:border-white/[0.12]' },
    },
    rounded: {
      sm: { wrapper: 'rounded-[.25rem]' },
      md: { wrapper: 'rounded-[.75rem]' },
      lg: { wrapper: 'rounded-[1rem]' },
    },
    dense: {
      true: { td: 'py-[0.38rem]' },
    },
    striped: {
      true: { tbody: 'even:[&>tr]:bg-rui-grey-50 dark:even:[&>tr]:bg-rui-grey-900' },
    },
    rowVariant: {
      selected: { tr: 'bg-rui-primary/[0.08] dark:bg-rui-dark-primary/[0.08]' },
      empty: { tr: 'hover:bg-transparent' },
      expandable: { tr: 'bg-[#f9fafb] hover:bg-[#f9fafb] dark:bg-[#121212] dark:hover:bg-[#121212]' },
      group: { tr: 'bg-black/[0.02] dark:bg-white/[0.02]' },
    },
  },
});
