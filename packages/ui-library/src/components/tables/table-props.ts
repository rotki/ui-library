export const TableAlign = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

export type TableAlign = (typeof TableAlign)[keyof typeof TableAlign];

export const GroupExpandButtonPosition = {
  start: 'start',
  end: 'end',
} as const;

export type GroupExpandButtonPosition = (typeof GroupExpandButtonPosition)[keyof typeof GroupExpandButtonPosition];

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

/**
 * Returns alignment Tailwind classes for a table cell.
 */
export function getAlignClass(align: TableAlign = TableAlign.start): string {
  return ALIGN_CLASSES[align];
}

/**
 * Returns extra class for sort button when column is center-aligned.
 */
export function getSortButtonAlignClass(align: TableAlign = TableAlign.start): string | undefined {
  return align === TableAlign.center ? 'ml-6' : undefined;
}
