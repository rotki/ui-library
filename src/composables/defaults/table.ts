import type { InjectionKey, Ref } from 'vue';
import type { MaybeRef } from '@vueuse/shared';

export interface TableOptions {
  itemsPerPage: Ref<number>;
  globalItemsPerPage: MaybeRef<boolean>;
  limits: MaybeRef<number[]>;
}

export const TableSymbol: InjectionKey<TableOptions> = Symbol.for('rui:table');

export function createTableDefaults(options?: Partial<TableOptions>): TableOptions {
  return {
    globalItemsPerPage: false,
    itemsPerPage: ref(10),
    limits: [10, 25, 50, 100],
    ...options,
  };
}

export function useTable() {
  const options = inject(TableSymbol);

  if (!options)
    throw new Error('Could not find rui table options injection');

  return options;
}
