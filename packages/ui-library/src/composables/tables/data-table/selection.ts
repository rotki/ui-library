import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { type GroupedTableRow, isRow } from '@/composables/tables/data-table/types';
import { assert } from '@/utils/assert';

export interface UseTableSelectionOptions<T extends object, IdType extends keyof T> {
  rowAttr: IdType;
  multiPageSelect: boolean;
  disabledRows: MaybeRefOrGetter<T[] | undefined>;
}

export interface UseTableSelectionDeps<T extends object, IdType extends keyof T> {
  selectedData: Ref<T[IdType][] | undefined>;
  filtered: ComputedRef<GroupedTableRow<T>[]>;
}

export interface UseTableSelectionReturn<T extends object, IdType extends keyof T> {
  visibleIdentifiers: ComputedRef<T[IdType][]>;
  isAllSelected: ComputedRef<boolean>;
  indeterminate: ComputedRef<boolean>;
  isSelected: (identifier: T[IdType]) => boolean;
  isDisabledRow: (rowKey: T[IdType]) => boolean;
  isSelectable: (rowKey: T[IdType]) => boolean;
  mustSelect: (rowKey: T[IdType]) => boolean;
  onToggleAll: (checked: boolean) => void;
  onSelect: (checked: boolean, value: T[IdType], userAction?: boolean) => void;
  onCheckboxClick: (event: MouseEvent, value: T[IdType], index: number) => void;
  deselectRemovedRows: () => void;
  resetCheckboxShiftState: () => void;
}

export function useTableSelection<T extends object, IdType extends keyof T>(
  options: UseTableSelectionOptions<T, IdType>,
  deps: UseTableSelectionDeps<T, IdType>,
): UseTableSelectionReturn<T, IdType> {
  const { rowAttr, multiPageSelect } = options;
  const { selectedData, filtered } = deps;

  const shiftClicked: Ref<boolean> = ref(false);
  const lastSelectedIndex: Ref<number> = ref(-1);
  const internalSelectedData: Ref<T[IdType][]> = ref([]);

  // Sync external selection model to internal state
  watch(selectedData, val => set(internalSelectedData, val), { immediate: true });

  const visibleIdentifiers = computed<T[IdType][]>(() =>
    get(filtered)
      .filter(isRow)
      .map(row => row[rowAttr]),
  );

  const selectedSet = computed<Set<T[IdType]>>(() => new Set(get(selectedData) ?? []));

  const disabledRowKeySet = computed<Set<T[IdType]>>(() => {
    const currentDisabledRows = toValue(options.disabledRows);
    if (!currentDisabledRows || !rowAttr)
      return new Set<T[IdType]>();
    return new Set<T[IdType]>(currentDisabledRows.map((row: T) => row[rowAttr]));
  });

  const isAllSelected = computed<boolean>(() => {
    const selectedRows = get(selectedData);
    if (!selectedRows || selectedRows.length === 0)
      return false;

    const selected = get(selectedSet);
    return get(visibleIdentifiers).every(id => selected.has(id));
  });

  const indeterminate = computed<boolean>(() => {
    const selectedRows = get(selectedData);
    if (!selectedRows)
      return false;

    return selectedRows.length > 0 && !get(isAllSelected);
  });

  function isSelected(identifier: T[IdType]): boolean {
    return get(selectedSet).has(identifier);
  }

  function isDisabledRow(rowKey: T[IdType]): boolean {
    return get(disabledRowKeySet).has(rowKey);
  }

  function isSelectable(rowKey: T[IdType]): boolean {
    return isSelected(rowKey) || !isDisabledRow(rowKey);
  }

  function mustSelect(rowKey: T[IdType]): boolean {
    return isSelected(rowKey) && isDisabledRow(rowKey);
  }

  function resetCheckboxShiftState(): void {
    set(shiftClicked, false);
    set(lastSelectedIndex, -1);
  }

  function onToggleAll(checked: boolean): void {
    const selectedRows = get(selectedData);

    if (!isDefined(selectedRows))
      return;

    if (!multiPageSelect) {
      if (checked)
        set(selectedData, get(visibleIdentifiers).filter(isSelectable));
      else set(selectedData, get(visibleIdentifiers).filter(mustSelect));
    }
    else {
      if (checked) {
        set(
          selectedData,
          Array.from(new Set([...selectedRows, ...get(visibleIdentifiers).filter(isSelectable)])),
        );
      }
      else {
        const visibleSet = new Set(get(visibleIdentifiers));
        const mustSelectSet = new Set(get(visibleIdentifiers).filter(mustSelect));
        set(
          selectedData,
          selectedRows.filter(rowKey => !visibleSet.has(rowKey) || mustSelectSet.has(rowKey)),
        );
      }
    }
  }

  function onSelect(checked: boolean, value: T[IdType], userAction: boolean = false): void {
    if (get(shiftClicked) && userAction)
      return;

    const selectedRows = get(internalSelectedData);
    if (!selectedRows)
      return;

    const selected = isSelected(value);

    if (checked && !selected) {
      set(internalSelectedData, [...selectedRows, value]);
    }
    else if (!checked && selected) {
      set(
        internalSelectedData,
        [...selectedRows].filter(r => r !== value),
      );
    }

    if (userAction)
      set(selectedData, get(internalSelectedData));
  }

  function onCheckboxClick(event: MouseEvent, value: T[IdType], index: number): void {
    const currentTarget = event.currentTarget;
    if (!(currentTarget instanceof HTMLElement))
      return;

    const input = currentTarget.querySelector('input');
    const target = event.target;
    const nodeName = target instanceof HTMLElement ? target.nodeName : undefined;

    const shiftKey = event.shiftKey;
    set(shiftClicked, shiftKey);

    if (input && nodeName !== 'INPUT') {
      if (shiftKey) {
        setTimeout(() => {
          let lastIndex = get(lastSelectedIndex);
          if (lastIndex === -1)
            lastIndex = index;
          const tableData = get(filtered);
          const lastSelectedData = tableData[lastIndex];
          assert(lastSelectedData);

          if (isRow(lastSelectedData)) {
            const valueToApply = isSelected(lastSelectedData[rowAttr]);

            if (lastIndex === index) {
              onSelect(!valueToApply, value);
            }
            else {
              const from = Math.min(lastIndex, index);
              const to = Math.max(lastIndex, index);

              for (let i = from; i <= to; i++) {
                const currSelectedData = tableData[i];
                assert(currSelectedData);
                if (isRow(currSelectedData) && !isDisabledRow(currSelectedData[rowAttr]))
                  onSelect(valueToApply, currSelectedData[rowAttr]);
              }
            }

            set(lastSelectedIndex, index);
            set(selectedData, get(internalSelectedData));
          }
        }, 1);
      }
      else {
        set(lastSelectedIndex, index);
      }
    }
  }

  function deselectRemovedRows(): void {
    const currentSelected = get(selectedData);
    if (!currentSelected)
      return;

    const visibleSet = new Set(get(visibleIdentifiers));
    const remaining = currentSelected.filter(key => visibleSet.has(key));

    if (remaining.length !== currentSelected.length)
      set(selectedData, remaining);
  }

  return {
    visibleIdentifiers,
    isAllSelected,
    indeterminate,
    isSelected,
    isDisabledRow,
    isSelectable,
    mustSelect,
    onToggleAll,
    onSelect,
    onCheckboxClick,
    deselectRemovedRows,
    resetCheckboxShiftState,
  };
}
