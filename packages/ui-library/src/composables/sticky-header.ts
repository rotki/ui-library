import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

export interface UseStickyTableHeaderRefs {
  table: Readonly<ShallowRef<HTMLTableElement | null>>;
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
  origin: Point;
}

function positionHeadStuck(head: HTMLElement, { clonedRect, lastRowHeight, origin, tableRect, top }: StuckPosition): void {
  head.style.left = `${clonedRect.left - origin.left + BORDER_PRECISION}px`;

  const isNearBottom = tableRect.bottom <= lastRowHeight + clonedRect.height + top;
  const viewportTop = isNearBottom ? tableRect.bottom - lastRowHeight - clonedRect.height : top;
  head.style.top = `${viewportTop - origin.top}px`;
}

function isInStickyRange(tableRect: DOMRect, top: number): boolean {
  return tableRect.top <= top && tableRect.bottom > top;
}

interface Point {
  left: number;
  top: number;
}

/**
 * The nearest ancestor that currently scrolls vertically, e.g. a dialog or drawer body, or
 * `undefined` when only the page does. One that could scroll but has nothing to (a card body on a
 * page) is skipped, as is the table's own scroller, which only scrolls sideways.
 */
function findScrollParent(element: HTMLElement): HTMLElement | undefined {
  let parent = element.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const { overflowY } = getComputedStyle(parent);
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight)
      return parent;
    parent = parent.parentElement;
  }
  return undefined;
}

function createsFixedContainingBlock(style: CSSStyleDeclaration): boolean {
  return style.transform !== 'none'
    || style.perspective !== 'none'
    || style.filter !== 'none'
    || (style.backdropFilter !== undefined && style.backdropFilter !== 'none')
    || /transform|perspective|filter/.test(style.willChange)
    || /paint|layout|strict|content/.test(style.contain);
}

/**
 * Where a `position: fixed` descendant's `top: 0; left: 0` lands in the viewport. That is the
 * viewport origin, unless an ancestor (a centred dialog is translated) becomes its containing block.
 */
function getFixedOrigin(element: HTMLElement): Point {
  let parent = element.parentElement;
  while (parent) {
    if (createsFixedContainingBlock(getComputedStyle(parent))) {
      const rect = parent.getBoundingClientRect();
      return { left: rect.left + parent.clientLeft, top: rect.top + parent.clientTop };
    }
    parent = parent.parentElement;
  }
  return { left: 0, top: 0 };
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
  const { table } = tableRefs;
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

    // One frame is enough: the main thead is positioned, so its widths never feed back into the clone's
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
    const pageTop = toValue(offsetTop) ?? 0;
    const scrollParent = findScrollParent(root);
    const top = scrollParent
      ? Math.max(scrollParent.getBoundingClientRect().top + scrollParent.clientTop, pageTop)
      : pageTop;

    head.style.width = `${clonedRect.width}px`;

    const lastRowHeight = getLastRowHeight(root);
    if (lastRowHeight === undefined) {
      set(stick, false);
      positionHeadAtRest(head);
      return;
    }

    if (isInStickyRange(tableRect, top)) {
      set(stick, true);
      positionHeadStuck(head, { clonedRect, lastRowHeight, origin: getFixedOrigin(head), tableRect, top });
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

  function onScroll(event: Event): void {
    const root = get(table);
    const target = event.target;
    // scroll does not bubble, so this runs in capture for every scroll: only an ancestor's matters
    if (!root || !(target instanceof Node) || !target.contains(root))
      return;
    throttledToggleStickyClass();
  }

  onMounted(() => {
    toggleStickyClass();
    useEventListener(document, 'scroll', onScroll, { capture: true, passive: true });
    useEventListener(window, 'resize', throttledToggleStickyClass);
    watchCellWidth();
  });

  return {
    stick: readonly(stick),
  };
}
