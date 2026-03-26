export const TableAlign = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

export type TableAlign = (typeof TableAlign)[keyof typeof TableAlign];

export const SortDirection = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

const ALIGN_CLASSES: Record<TableAlign, string> = {
  [TableAlign.start]: 'text-left rtl:text-right',
  [TableAlign.center]: 'text-center',
  [TableAlign.end]: 'text-right rtl:text-left',
};

const SORTABLE_ALIGN_CLASSES: Record<TableAlign, string> = {
  [TableAlign.start]: 'pl-3',
  [TableAlign.center]: 'px-3',
  [TableAlign.end]: 'pr-3',
};

/**
 * Returns alignment Tailwind classes for a table cell.
 * When sortable, adds reduced padding for the sort button.
 */
export function getAlignClass(align: TableAlign = TableAlign.start, sortable?: boolean): string {
  const classes = ALIGN_CLASSES[align];
  if (sortable)
    return `${classes} ${SORTABLE_ALIGN_CLASSES[align]}`;
  return classes;
}

/**
 * Returns extra class for sort button when column is center-aligned.
 */
export function getSortButtonAlignClass(align: TableAlign = TableAlign.start): string | undefined {
  return align === TableAlign.center ? 'ml-6' : undefined;
}
