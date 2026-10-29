import { tv } from '@/utils/tv';

/**
 * Every rule that lands on a `th` or a `td` wraps the `&` in `:where()`, which
 * compiles to `:where(.generated-class) th` and so carries the specificity of
 * the element alone. A consumer writing `class="p-0"` on one cell is a single
 * class, which outranks that, so a one-off override needs no `!important` the
 * way a plain `[&_th]:` rule would.
 */
export const tableStyles = tv({
  slots: {
    root: 'w-full overflow-y-auto',
    // matches RuiDataTable: text color, 13px header labels, body text, cell padding and row dividers
    table: [
      'w-full text-rui-text',
      '[:where(&)_thead]:border-b [:where(&)_thead]:border-rui-divider',
      '[:where(&)_thead_th]:font-medium [:where(&)_thead_th]:text-rui-text-secondary [:where(&)_thead_th]:text-start',
      '[:where(&)_thead_th]:text-[0.8125rem] [:where(&)_thead_th]:leading-5',
      '[:where(&)_th]:px-4 [:where(&)_td]:px-4 [:where(&)_td]:text-body-2',
      '[:where(&)_tbody>tr+tr]:border-t [:where(&)_tbody>tr+tr]:border-rui-divider',
      '[:where(&)_tbody_td]:border-b-0',
    ],
  },
  variants: {
    variant: {
      default: {},
      outlined: {
        root: 'border rounded-rui-panel border-rui-divider',
      },
    },
    // the data table's heights: a 40px header over 44px rows, or 32px over 36px when dense
    dense: {
      true: {
        table: '[:where(&)_th]:py-0.5 [:where(&)_th]:h-8 [:where(&)_td]:py-1 [:where(&)_td]:h-9',
      },
      false: {
        table: '[:where(&)_th]:py-1 [:where(&)_th]:h-10 [:where(&)_td]:py-1 [:where(&)_td]:h-11',
      },
    },
  },
});
