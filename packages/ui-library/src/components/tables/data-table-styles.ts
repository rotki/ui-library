import { tv } from '@/utils/tv';

/** A 2px primary rail down the left edge of an open row and its panel; out of flow, so the cell keeps its padding. */
const OPEN_ROW_RAIL = '[&>td:first-child]:relative [&>td:first-child]:before:absolute [&>td:first-child]:before:inset-y-0 [&>td:first-child]:before:left-0 [&>td:first-child]:before:w-0.5 [&>td:first-child]:before:bg-rui-primary';

/**
 * The band of an open row inside another table's panel: a step darker than the outer band, so the two
 * levels never share a grey while the rows between them keep the plain surface.
 */
const NESTED_BAND = '[[data-id=row-expanded]_&]:bg-rui-neutral-950/[0.11] dark:[[data-id=row-expanded]_&]:bg-white/[0.14]';

/**
 * Header and pagination of a nested table, stepped by depth to stand off the band around them (about
 * 1.12:1 or more) as well as their own rows: past the lighter band one panel deep, short of the darker
 * band two deep. Nested bars never stick, so the tint can be translucent over the table's own surface.
 */
export const NESTED_BAR = '[[data-id=row-expanded]_&]:bg-rui-neutral-950/[0.13] dark:[[data-id=row-expanded]_&]:bg-white/[0.16] [[data-id=row-expanded]_[data-id=row-expanded]_&]:bg-rui-neutral-950/[0.06] dark:[[data-id=row-expanded]_[data-id=row-expanded]_&]:bg-white/[0.07]';

export const dataTableStyles = tv({
  slots: {
    // `clip`, not `hidden`, which may shrink the item below its rows; its own surface reads the same anywhere
    wrapper: 'relative between:border-t between:border-b-0 between:border-rui-divider overflow-clip bg-rui-surface',
    // focusable only while it scrolls with nothing to tab to (useKeyboardScroll), ring drawn inside
    scroller: 'overflow-x-auto overflow-y-hidden [clip-path:inset(0_0_0_0)] outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    table: 'min-w-full table-fixed between:border-t between:border-b-0 between:border-rui-divider whitespace-nowrap mx-auto my-0 max-w-fit relative border-rui-divider',
    tbody: 'between:border-t between:border-b-0 between:border-rui-divider',
    tr: 'hover:bg-rui-hover',
    // numbers line up in columns; no slashed zero, which in Inter reads as a second, monospace font beside zero-free values
    td: '[:where(&)]:px-4 text-rui-text text-body-2 tabular-nums [text-wrap:initial]',
    checkbox: 'px-2 w-[3.625rem] max-w-[3.625rem] [&_label]:ml-0',
    tbodyLoader: 'text-center',
    // tinted like the column header, the pair framing the body; opaque, so rows scroll behind a stuck bar
    pagination: `bg-rui-surface-muted ${NESTED_BAR}`,
  },
  variants: {
    sticky: {
      true: { pagination: 'sticky bottom-0 z-rui-raised' },
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
    // a translucent tint under the hover one; `:where()` keeps it below every row state (selected, hover, expanded, group)
    striped: {
      true: { tbody: '[:where(&>tr:nth-child(even))]:bg-rui-neutral-950/[0.03] dark:[:where(&>tr:nth-child(even))]:bg-white/[0.04]' },
    },
    rowVariant: {
      selected: { tr: 'bg-rui-primary-soft' },
      empty: { tr: 'hover:bg-transparent' },
      // a grey band darker than the header so the two never match, a step darker again inside another panel
      expandable: { tr: `bg-rui-neutral-950/[0.07] hover:bg-rui-neutral-950/[0.07] dark:bg-white/[0.09] dark:hover:bg-white/[0.09] ${NESTED_BAND} [[data-id=row-expanded]_&]:hover:bg-rui-neutral-950/[0.11] dark:[[data-id=row-expanded]_&]:hover:bg-white/[0.14] ${OPEN_ROW_RAIL} !border-t-0` },
      expandedParent: { tr: `bg-rui-neutral-950/[0.07] dark:bg-white/[0.09] ${NESTED_BAND} ${OPEN_ROW_RAIL}` },
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
