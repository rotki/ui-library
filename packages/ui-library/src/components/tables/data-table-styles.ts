import { tv } from '@/utils/tv';

export const dataTableStyles = tv({
  slots: {
    // `clip`, not `hidden`: a hidden-overflow flex item may shrink below its rows and hide them
    wrapper: 'relative between:border-t between:border-b-0 between:border-rui-divider overflow-clip',
    scroller: 'overflow-x-auto overflow-y-hidden [clip-path:inset(0_0_0_0)]',
    table: 'min-w-full table-fixed between:border-t between:border-b-0 between:border-rui-divider whitespace-nowrap mx-auto my-0 max-w-fit relative border-rui-divider',
    tbody: 'between:border-t between:border-b-0 between:border-rui-divider',
    tr: 'hover:bg-rui-hover',
    // numbers line up in columns, and a slashed zero tells 0 from O in amounts and addresses
    td: '[:where(&)]:px-4 text-rui-text text-body-2 tabular-nums slashed-zero [text-wrap:initial]',
    checkbox: 'px-2 w-[3.625rem] max-w-[3.625rem] [&_label]:ml-0',
    tbodyLoader: 'text-center',
    pagination: '',
  },
  variants: {
    // opaque like the stuck column header, so rows scroll behind it rather than through it
    sticky: {
      true: { pagination: 'sticky bottom-0 z-rui-raised bg-rui-background' },
    },
    outlined: {
      true: { wrapper: 'border border-rui-divider' },
    },
    rounded: {
      sm: { wrapper: 'rounded-rui-sm' },
      md: { wrapper: 'rounded-rui-card' },
      lg: { wrapper: 'rounded-rui-lg' },
    },
    dense: {
      true: {},
      false: {},
    },
    // `:where()` keeps the stripe below every row state (selected, hover, expanded, group)
    striped: {
      true: { tbody: '[:where(&>tr:nth-child(even))]:bg-rui-neutral-50 dark:[:where(&>tr:nth-child(even))]:bg-white/[0.02]' },
    },
    rowVariant: {
      selected: { tr: 'bg-rui-primary-soft' },
      empty: { tr: 'hover:bg-transparent' },
      // `!border-t-0` drops the divider so the panel joins the row that opened it
      expandable: { tr: 'bg-rui-neutral-50 hover:bg-rui-neutral-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.03] !border-t-0' },
      expandedParent: { tr: 'bg-rui-neutral-50 dark:bg-white/[0.03]' },
      group: { tr: 'bg-rui-neutral-100 dark:bg-white/[0.05]' },
    },
    mobile: {
      true: {
        wrapper: 'between:border-t-0 border-0 rounded-none overflow-visible',
        scroller: 'overflow-visible [clip-path:none]',
        table: 'block min-w-0 max-w-none w-full whitespace-normal between:border-t-0 border-0',
        tbody: 'block between:border-t-0',
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
    // a 4px inset under the height floor fits a 36px button in a 44px row (a 28px one in a dense 36px row)
    { dense: false, mobile: false, class: { td: '[:where(&)]:py-1 [:where(&)]:h-11' } },
    { dense: true, mobile: false, class: { td: '[:where(&)]:py-1 [:where(&)]:h-9' } },
  ],
  defaultVariants: {
    dense: false,
    mobile: false,
  },
});
