import type { InjectionKey, MaybeRef, Ref } from 'vue';

export interface TableOptions {
  itemsPerPage: Ref<number>;
  globalItemsPerPage: MaybeRef<boolean>;
  limits: MaybeRef<number[]>;
  stickyOffset: MaybeRef<number>;
  /**
   * Global default width (px) below which every table switches to its stacked
   * mobile card layout. A table's own `mobileBreakpoint` prop overrides this.
   * Leave unset to keep the mobile layout opt-in per table.
   */
  mobileBreakpoint?: MaybeRef<number>;
  /**
   * Whether the mobile breakpoint is measured against the browser viewport
   * (`viewport`, default) or each table's own container width (`container`).
   * A table's own `mobileBreakpointBasis` prop overrides this.
   */
  mobileBreakpointBasis?: MaybeRef<'viewport' | 'container'>;
}

export const TableSymbol: InjectionKey<TableOptions> = Symbol.for('rui:table');

export function createTableDefaults(options?: Partial<TableOptions>): TableOptions {
  return {
    globalItemsPerPage: false,
    itemsPerPage: ref(10),
    limits: [10, 25, 50, 100],
    stickyOffset: ref(0),
    ...options,
  };
}

export function useTable() {
  const options = inject(TableSymbol);

  if (!options)
    throw new Error('Could not find rui table options injection');

  return options;
}
