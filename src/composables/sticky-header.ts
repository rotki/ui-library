import { type Ref } from 'vue';

/**
 * Setup sticky table header
 */
export const useStickyTableHeader = (offsetTop: Ref<number> = ref(0)) => {
  const table: Ref<HTMLTableElement | null> = ref(null);
  const tableScroller: Ref<HTMLElement | null> = ref(null);
  const stick: Ref<boolean> = ref(false);
  const borderPrecision = -0.5;
  const selectors = {
    headClone: ':scope > thead[data-id=head-clone]',
    head: ':scope > thead[data-id=head-main]',
    th: ':scope > tr > th',
    row: ':scope > tbody > tr:not([hidden])',
  };

  const updateHeaderCellWidth = () => {
    const root = get(table);

    if (!root) {
      return;
    }

    const theadClone: HTMLHeadElement | null = root.querySelector(
      selectors.headClone,
    );

    const head: HTMLHeadElement | null =
      root.querySelector(selectors.head) ?? null;
    const columns: NodeListOf<HTMLElement> | undefined = head?.querySelectorAll(
      selectors.th,
    );
    const clonedColumns: NodeListOf<HTMLElement> | undefined =
      theadClone?.querySelectorAll(selectors.th);

    columns?.forEach((column: HTMLElement, i: number) => {
      const cellRect = clonedColumns?.item(i)?.getBoundingClientRect();
      column.style.width = `${cellRect?.width ?? 0}px`;
    });
  };

  const addStickyClass = () => {
    const root = get(table);

    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    const theadClone: HTMLHeadElement | null = root.querySelector(
      selectors.headClone,
    );

    const clonedRect: DOMRect | undefined = theadClone?.getBoundingClientRect();

    const head: HTMLHeadElement | null =
      root.querySelector(selectors.head) ?? null;

    const headRect: DOMRect | undefined = head?.getBoundingClientRect();

    if (!rect || !clonedRect || !head || !theadClone || !headRect) {
      return;
    }

    const {
      height: theadHeight,
      width: theadWidth,
      left: theadLeft,
    } = clonedRect;

    const { top: tableTop, bottom: tableBottom } = rect;
    const top = get(offsetTop) ?? 0;

    head.style.width = `${theadWidth}px`;
    theadClone.style.height = `${headRect.height}px`;

    const rows = root.querySelectorAll(selectors.row);

    const lastRowRect: DOMRect | undefined = rows
      .item(rows.length - 1)
      ?.getBoundingClientRect();

    if (tableTop <= top && tableBottom > top && rows.length > 1) {
      set(stick, true);
      head.style.left = `${theadLeft + borderPrecision}px`;

      const lastRowHeight = lastRowRect?.height ?? 0;
      if (tableBottom <= lastRowHeight + theadHeight + top) {
        head.style.top = `${tableBottom - lastRowHeight - theadHeight}px`;
      } else {
        head.style.top = `${top}px`;
      }
    } else {
      set(stick, false);
      head.style.left = `${borderPrecision}px`;
      head.style.top = '0';
    }
  };

  const updateHeader = () => {
    addStickyClass();
    updateHeaderCellWidth();
  };

  watchEffect(() => {
    if (!get(table)?.querySelector(selectors.head)) {
      return;
    }

    updateHeader();

    const scroller = get(tableScroller);

    if (scroller) {
      useResizeObserver(get(tableScroller), updateHeader);
    }
  });

  onMounted(() => {
    useEventListener(window, 'scroll', addStickyClass);
    useEventListener(window, 'resize', updateHeader);
    useEventListener(tableScroller, 'scroll', updateHeader);
  });

  return {
    stick,
    table,
    tableScroller,
  };
};
