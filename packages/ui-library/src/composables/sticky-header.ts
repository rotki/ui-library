import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

export interface UseStickyTableHeaderRefs {
  table: Readonly<ShallowRef<HTMLTableElement | null>>;
  tableScroller: Readonly<ShallowRef<HTMLElement | null>>;
}

interface StickyElements {
  head: HTMLElement;
  theadClone: HTMLElement;
  root: HTMLTableElement;
}

interface UseStickyTableHeaderReturn {
  stick: Readonly<Ref<boolean>>;
}

const SELECTORS = {
  head: ':scope > thead[data-id=head-main]',
  headClone: ':scope > thead[data-id=head-clone]',
  row: ':scope > tbody > tr:not([hidden])',
  th: ':scope > th',
} as const;

const BORDER_PRECISION = -0.5;

function queryHeadRow(root: HTMLTableElement, selector: string): HTMLTableRowElement | null {
  return root.querySelector(`${selector} > tr`);
}

function queryColumns(row: HTMLTableRowElement | null): HTMLElement[] {
  if (!row)
    return [];
  return Array.from(row.querySelectorAll<HTMLElement>(SELECTORS.th));
}

function readColumnWidths(columns: HTMLElement[]): number[] {
  return columns.map(col => col.getBoundingClientRect().width);
}

function applyColumnWidths(columns: HTMLElement[], widths: number[]): void {
  for (const [i, column] of columns.entries()) {
    const width = widths[i];
    if (width !== undefined)
      column.style.width = `${width}px`;
  }
}

function positionHeadAtRest(head: HTMLElement): void {
  head.style.left = `${BORDER_PRECISION}px`;
  head.style.top = '0';
}

interface StuckPosition {
  clonedRect: DOMRect;
  tableRect: DOMRect;
  lastRowHeight: number;
  top: number;
}

function positionHeadStuck(head: HTMLElement, { clonedRect, lastRowHeight, tableRect, top }: StuckPosition): void {
  head.style.left = `${clonedRect.left + BORDER_PRECISION}px`;

  const isNearBottom = tableRect.bottom <= lastRowHeight + clonedRect.height + top;
  head.style.top = isNearBottom
    ? `${tableRect.bottom - lastRowHeight - clonedRect.height}px`
    : `${top}px`;
}

function isInStickyRange(tableRect: DOMRect, top: number): boolean {
  return tableRect.top <= top && tableRect.bottom > top;
}

function getLastRowHeight(root: HTMLTableElement): number | undefined {
  const rows = root.querySelectorAll(SELECTORS.row);
  if (rows.length <= 1)
    return undefined;
  return rows.item(rows.length - 1)?.getBoundingClientRect().height ?? 0;
}

/**
 * Setup sticky table header
 */
export function useStickyTableHeader(
  sticky: MaybeRefOrGetter<boolean> = shallowRef(false),
  offsetTop: MaybeRefOrGetter<number | undefined>,
  tableRefs: UseStickyTableHeaderRefs,
): UseStickyTableHeaderReturn {
  const { table, tableScroller } = tableRefs;
  const stick = shallowRef<boolean>(false);

  let resizeCleanups: (() => void)[] = [];
  let syncRafId: number | null = null;
  let rafId: number | null = null;

  function cleanupResizeObservers(): void {
    for (const cleanup of resizeCleanups)
      cleanup();
    resizeCleanups = [];
  }

  function cancelPendingSync(): void {
    if (syncRafId !== null)
      cancelAnimationFrame(syncRafId);
    syncRafId = null;
  }

  function scheduleSyncWidths(cloneColumns: HTMLElement[], mainColumns: HTMLElement[]): void {
    cancelPendingSync();

    // Single-frame sync: the main thead is position absolute/fixed so clearing
    // its widths is unnecessary — clone widths are independent of main widths.
    syncRafId = requestAnimationFrame(() => {
      syncRafId = null;
      applyColumnWidths(mainColumns, readColumnWidths(cloneColumns));
    });
  }

  function observeColumnResizes(cloneColumns: HTMLElement[], mainColumns: HTMLElement[]): void {
    cleanupResizeObservers();

    for (const th of cloneColumns) {
      const { stop } = useResizeObserver(th, () => {
        scheduleSyncWidths(cloneColumns, mainColumns);
      });
      resizeCleanups.push(stop);
    }
  }

  function watchCellWidth(): void {
    const root = get(table);
    if (!toValue(sticky) || !root)
      return;

    const cloneRow = queryHeadRow(root, SELECTORS.headClone);
    const mainRow = queryHeadRow(root, SELECTORS.head);
    const cloneColumns = queryColumns(cloneRow);
    const mainColumns = queryColumns(mainRow);

    useMutationObserver(cloneRow, (mutations) => {
      const hasRelevantMutation = mutations.some(
        m => m.type === 'childList' || m.type === 'attributes',
      );
      if (hasRelevantMutation)
        observeColumnResizes(queryColumns(cloneRow), queryColumns(mainRow));
    }, { attributes: true, childList: true, subtree: true });

    observeColumnResizes(cloneColumns, mainColumns);
  }

  function queryStickyElements(): StickyElements | undefined {
    const root = get(table);
    if (!toValue(sticky) || !root)
      return undefined;

    const theadClone = root.querySelector<HTMLElement>(SELECTORS.headClone);
    const head = root.querySelector<HTMLElement>(SELECTORS.head);
    if (!theadClone || !head)
      return undefined;

    return { head, root, theadClone };
  }

  function toggleStickyClass(): void {
    const elements = queryStickyElements();
    if (!elements)
      return;

    const { head, root, theadClone } = elements;
    const clonedRect = theadClone.getBoundingClientRect();
    const tableRect = root.getBoundingClientRect();
    const top = toValue(offsetTop) ?? 0;

    head.style.width = `${clonedRect.width}px`;

    const lastRowHeight = getLastRowHeight(root);
    if (lastRowHeight === undefined) {
      set(stick, false);
      positionHeadAtRest(head);
      return;
    }

    if (isInStickyRange(tableRect, top)) {
      set(stick, true);
      positionHeadStuck(head, { clonedRect, lastRowHeight, tableRect, top });
    }
    else {
      set(stick, false);
      positionHeadAtRest(head);
    }
  }

  function throttledToggleStickyClass(): void {
    if (rafId !== null)
      return;
    rafId = requestAnimationFrame(() => {
      toggleStickyClass();
      rafId = null;
    });
  }

  onMounted(() => {
    toggleStickyClass();
    useEventListener(tableScroller, 'scroll', throttledToggleStickyClass);
    useEventListener(document.body, 'scroll', throttledToggleStickyClass);
    useEventListener(window, 'resize', throttledToggleStickyClass);
    watchCellWidth();
  });

  return {
    stick: readonly(stick),
  };
}
