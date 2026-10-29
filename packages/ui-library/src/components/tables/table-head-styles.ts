import { NESTED_BAR } from '@/components/tables/data-table-styles';
import { tv } from '@/utils/tv';

export const tableHeadStyles = tv({
  slots: {
    thead: 'between:border-t between:border-b-0 between:border-rui-divider',
    checkbox: `px-2 w-14.5 max-w-14.5 [&_label]:ml-0 bg-rui-surface-muted ${NESTED_BAR}`,
    // tinted like the pagination bar, framing the body; opaque, so rows scroll behind a stuck header
    th: `[:where(&)]:px-4 bg-rui-surface-muted ${NESTED_BAR}`,
    // labels read as secondary to the data; the sorted column's label steps up to primary
    columnText: 'text-rui-text-secondary font-medium text-[0.8125rem] leading-5',
    // the negative margin cancels the button's own padding so the label lines up with the cells below
    sortButton: 'inline-flex group/sort -mx-1.5',
    // a resting icon marks sortable columns for keyboard and touch users, at 3:1 on a nested table's darker header
    sortIcon: 'transition opacity-75 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100',
    // tucked against the arrow, closer than the button's gap
    sortPosition: 'text-[0.6875rem] leading-none font-semibold tabular-nums text-rui-text-secondary',
    /*
     * The row is always there and only its bar comes and goes: a collapsed-border table gives even a
     * zero-height row half a pixel, so adding the row on load pushed the body down.
     */
    loaderRow: 'border-none',
    progress: 'p-0 h-0',
    progressWrapper: 'h-0 -mt-1',
  },
  variants: {
    position: {
      default: {},
      sticky: { thead: 'top-0 z-rui-raised absolute' },
      fixed: {
        thead: 'top-0 z-rui-raised fixed',
        th: 'border-b border-b-rui-divider',
      },
    },
    // a fixed height evens out rows with and without sort buttons; `:where()` lets a column's `class` win
    dense: {
      true: { th: '[:where(&)]:py-0.5 [:where(&)]:h-8' },
      false: { th: '[:where(&)]:py-1 [:where(&)]:h-10' },
    },
  },
  defaultVariants: {
    position: 'default',
    dense: false,
  },
});
