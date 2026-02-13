import type { MaybeRef, ShallowRef } from 'vue';
import { assert } from '@/utils/assert';

export interface UseStickyTableHeaderRefs {
  table: Readonly<ShallowRef<HTMLTableElement | null>>;
  tableScroller: Readonly<ShallowRef<HTMLElement | null>>;
}

/**
 * Setup sticky table header
 */
export function useStickyTableHeader(
  sticky: MaybeRef<boolean> = ref(false),
  offsetTop: MaybeRef<number | undefined>,
  refs: UseStickyTableHeaderRefs,
) {
  const { table, tableScroller } = refs;
  const stick = ref<boolean>(false);
  const borderPrecision = -0.5;
  const selectors = {
    head: ':scope > thead[data-id=head-main]',
    headClone: ':scope > thead[data-id=head-clone]',
    row: ':scope > tbody > tr:not([hidden])',
    th: ':scope > th',
  };

  const watchCellWidth = (): void => {
    const root = get(table);

    if (!get(sticky) || !root)
      return;

    const theadClone: HTMLHeadElement | null = root.querySelector(`${selectors.headClone} > tr`);

    const head: HTMLHeadElement | null = root.querySelector(`${selectors.head} > tr`);

    let resizeCleanups: (() => void)[] = [];

    const observeChildTh = (): void => {
      resizeCleanups.forEach(cleanup => cleanup());
      resizeCleanups = [];

      const columns: NodeListOf<HTMLElement> | undefined = head?.querySelectorAll(selectors.th);

      const clonedColumns: NodeListOf<HTMLElement> | undefined = theadClone?.querySelectorAll(
        selectors.th,
      );

      clonedColumns?.forEach((th: HTMLElement, i: number) => {
        const { stop } = useResizeObserver(th, (entries) => {
          const entry = entries[0];
          assert(entry);
          const cellRect = entry.target.getBoundingClientRect();
          const column = columns?.item(i);
          if (column)
            column.style.width = `${cellRect.width}px`;
        });
        resizeCleanups.push(stop);
      });
    };

    useMutationObserver(
      theadClone,
      (mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes')
            observeChildTh();
        }
      },
      {
        attributes: true,
        childList: true,
        subtree: true,
      },
    );

    observeChildTh();
  };

  const toggleStickyClass = (): void => {
    const root = get(table);

    if (!get(sticky) || !root)
      return;

    const rect = root.getBoundingClientRect();
    const theadClone: HTMLHeadElement | null = root.querySelector(selectors.headClone);

    const clonedRect: DOMRect | undefined = theadClone?.getBoundingClientRect();

    const head: HTMLHeadElement | null = root.querySelector(selectors.head);

    if (!clonedRect || !head || !theadClone)
      return;

    const { height: theadHeight, left: theadLeft, width: theadWidth } = clonedRect;

    const { bottom: tableBottom, top: tableTop } = rect;
    const top = get(offsetTop) ?? 0;

    head.style.width = `${theadWidth}px`;

    const rows = root.querySelectorAll(selectors.row);
    if (rows.length <= 1) {
      set(stick, false);
      head.style.left = `${borderPrecision}px`;
      head.style.top = '0';
      return;
    }

    const lastRowRect: DOMRect | undefined = rows.item(rows.length - 1)?.getBoundingClientRect();

    if (tableTop <= top && tableBottom > top) {
      set(stick, true);
      head.style.left = `${theadLeft + borderPrecision}px`;

      const lastRowHeight = lastRowRect?.height ?? 0;
      if (tableBottom <= lastRowHeight + theadHeight + top)
        head.style.top = `${tableBottom - lastRowHeight - theadHeight}px`;
      else head.style.top = `${top}px`;
    }
    else {
      set(stick, false);
      head.style.left = `${borderPrecision}px`;
      head.style.top = '0';
    }
  };

  let rafId: number | null = null;

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
    stick,
  };
}
