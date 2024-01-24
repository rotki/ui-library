import type { Ref } from 'vue';

/**
 * Setup sticky table header
 */
export function useStickyTableHeader(offsetTop: Ref<number> = ref(0), sticky: Ref<boolean> = ref(false)) {
  const table: Ref<HTMLTableElement | null> = ref(null);
  const tableScroller: Ref<HTMLElement | null> = ref(null);
  const stick: Ref<boolean> = ref(false);
  const borderPrecision = -0.5;
  const selectors = {
    head: ':scope > thead[data-id=head-main]',
    headClone: ':scope > thead[data-id=head-clone]',
    row: ':scope > tbody > tr:not([hidden])',
    th: ':scope > tr > th',
  };

  const watchCellWidth = () => {
    const root = get(table);

    if (!get(sticky) || !root)
      return;

    const theadClone: HTMLHeadElement | null = root.querySelector(
      selectors.headClone,
    );

    const head: HTMLHeadElement | null
      = root.querySelector(selectors.head) ?? null;

    const columns: NodeListOf<HTMLElement> | undefined = head?.querySelectorAll(
      selectors.th,
    );

    const clonedColumns: NodeListOf<HTMLElement> | undefined
      = theadClone?.querySelectorAll(selectors.th);

    clonedColumns?.forEach((th: HTMLElement, i: number) => {
      useResizeObserver(th, (entries) => {
        const cellRect = entries[0].target.getBoundingClientRect();
        const column = columns?.item(i);
        if (column)
          column.style.width = `${cellRect.width}px`;
      });
    });
  };

  const toggleStickyClass = () => {
    const root = get(table);

    if (!get(sticky) || !root)
      return;

    const rect = root.getBoundingClientRect();
    const theadClone: HTMLHeadElement | null = root.querySelector(
      selectors.headClone,
    );

    const clonedRect: DOMRect | undefined = theadClone?.getBoundingClientRect();

    const head: HTMLHeadElement | null
      = root.querySelector(selectors.head) ?? null;

    const headRect: DOMRect | undefined = head?.getBoundingClientRect();

    if (!rect || !clonedRect || !head || !theadClone || !headRect)
      return;

    const {
      height: theadHeight,
      left: theadLeft,
      width: theadWidth,
    } = clonedRect;

    const { bottom: tableBottom, top: tableTop } = rect;
    const top = get(offsetTop) ?? 0;

    head.style.width = `${theadWidth}px`;

    const rows = root.querySelectorAll(selectors.row);

    const lastRowRect: DOMRect | undefined = rows
      .item(rows.length - 1)
      ?.getBoundingClientRect();

    if (tableTop <= top && tableBottom > top && rows.length > 1) {
      set(stick, true);
      head.style.left = `${theadLeft + borderPrecision}px`;

      const lastRowHeight = lastRowRect?.height ?? 0;
      if (tableBottom <= lastRowHeight + theadHeight + top)
        head.style.top = `${tableBottom - lastRowHeight - theadHeight}px`;
      else
        head.style.top = `${top}px`;
    }
    else {
      set(stick, false);
      head.style.left = `${borderPrecision}px`;
      head.style.top = '0';
    }
  };

  onMounted(() => {
    toggleStickyClass();
    useEventListener(tableScroller, 'scroll', toggleStickyClass);
    useEventListener(document.body, 'scroll', toggleStickyClass);
    useEventListener(window, 'resize', toggleStickyClass);
    watchCellWidth();
  });

  return {
    stick,
    table,
    tableScroller,
  };
}
