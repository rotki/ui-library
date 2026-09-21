import { tv } from '@/utils/tv';

export const dataTableStyles = tv({
  slots: {
    wrapper: 'relative divide-y divide-black/[0.12] dark:divide-white/[0.12] overflow-hidden',
    scroller: 'overflow-x-auto overflow-y-hidden [clip-path:inset(0_0_0_0)]',
    table: 'min-w-full table-fixed divide-y divide-black/[0.12] dark:divide-white/[0.12] whitespace-nowrap mx-auto my-0 max-w-fit relative border-black/[0.12] dark:border-white/[0.12]',
    tbody: 'divide-y divide-black/[0.12] dark:divide-white/[0.12]',
    tr: 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]',
    td: '[:where(&)]:px-4 text-rui-text text-body-2 tabular-nums [text-wrap:initial]',
    checkbox: 'px-2 w-[3.625rem] max-w-[3.625rem] [&_label]:ml-0',
    tbodyLoader: 'text-center',
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
      true: {},
      false: {},
    },
    // `:where()` keeps the stripe below every row state (selected, hover, expanded, group)
    striped: {
      true: { tbody: '[:where(&>tr:nth-child(even))]:bg-rui-grey-50 dark:[:where(&>tr:nth-child(even))]:bg-rui-grey-900' },
    },
    rowVariant: {
      selected: { tr: 'bg-rui-primary/[0.08] dark:bg-rui-dark-primary/[0.08]' },
      empty: { tr: 'hover:bg-transparent' },
      // `!border-t-0` drops the divider so the panel joins the row that opened it
      expandable: { tr: 'bg-rui-grey-50 hover:bg-rui-grey-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.03] !border-t-0' },
      expandedParent: { tr: 'bg-rui-grey-50 dark:bg-white/[0.03]' },
      group: { tr: 'bg-rui-grey-100 dark:bg-white/[0.05]' },
    },
    mobile: {
      true: {
        wrapper: 'divide-y-0 border-0 rounded-none overflow-visible',
        scroller: 'overflow-visible [clip-path:none]',
        table: 'block min-w-0 max-w-none w-full whitespace-normal divide-y-0 border-0',
        tbody: 'block divide-y-0',
        tr: 'block',
        td: 'block px-4 py-2',
      },
    },
  },
  /**
   * A fixed row height keeps a row of plain text as tall as one holding an
   * icon button. Padding and floor sit in `:where()` so a consumer's `cellClass`
   * (`py-0` is common) still wins at any stylesheet order, and each density
   * sets its own because the class merger cannot dedupe these.
   */
  compoundVariants: [
    { dense: false, mobile: false, class: { td: '[:where(&)]:py-3 [:where(&)]:h-[3.25rem]' } },
    { dense: true, mobile: false, class: { td: '[:where(&)]:py-1 [:where(&)]:h-9' } },
  ],
  defaultVariants: {
    dense: false,
    mobile: false,
  },
});
