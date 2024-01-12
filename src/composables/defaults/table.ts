import { type InjectionKey, type Ref } from 'vue';
import { type MaybeRef } from '@vueuse/shared';

export interface TableOptions {
  itemsPerPage: Ref<number>;
  globalItemsPerPage: MaybeRef<boolean>;
  limits: MaybeRef<number[]>;
}

export const TableSymbol: InjectionKey<TableOptions> = Symbol.for('rui:table');

export const createTableDefaults = (
  options?: Partial<TableOptions>,
): TableOptions => ({
  itemsPerPage: ref(10),
  globalItemsPerPage: false,
  limits: [10, 25, 50, 100],
  ...options,
});

export const useTable = () => {
  const options = inject(TableSymbol);

  if (!options) {
    throw new Error('Could not find rui table options injection');
  }

  return options;
};
