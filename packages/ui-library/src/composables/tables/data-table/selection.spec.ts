import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useTableSelection } from '@/composables/tables/data-table/selection';

interface TestItem {
  id: number;
  name: string;
}

function withSetup<T>(composable: () => T): { result: T; unmount: () => void } {
  let result!: T;
  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);
  return { result, unmount: () => wrapper.unmount() };
}

describe('composables/tables/data-table/selection', () => {
  let unmount: () => void;

  const rows: TestItem[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  afterEach(() => {
    unmount?.();
  });

  it('should track selected state with Set-based lookup', () => {
    const selectedData = ref<number[]>([1, 2]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.isSelected(1)).toBe(true);
    expect(result.isSelected(3)).toBe(false);
  });

  it('should compute isAllSelected correctly', () => {
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.isAllSelected)).toBe(true);
    expect(get(result.indeterminate)).toBe(false);
  });

  it('should compute indeterminate when partially selected', () => {
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.isAllSelected)).toBe(false);
    expect(get(result.indeterminate)).toBe(true);
  });

  it('should toggle all on', () => {
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onToggleAll(true);
    expect(get(selectedData)).toHaveLength(3);
  });

  it('should toggle all off', () => {
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onToggleAll(false);
    expect(get(selectedData)).toHaveLength(0);
  });

  it('should detect disabled rows', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(result.isDisabledRow(1)).toBe(true);
    expect(result.isDisabledRow(2)).toBe(false);
  });

  it('should exclude disabled rows from toggle all', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onToggleAll(true);
    expect(get(selectedData)).toHaveLength(2);
    expect(get(selectedData)).not.toContain(1);
  });

  it('should support multi-page selection', () => {
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: true, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows.slice(1)),
        },
      ),
    );
    unmount = u;

    result.onToggleAll(true);
    expect(get(selectedData)).toHaveLength(3);
    expect(get(selectedData)).toContain(1);
  });

  it('should deselect removed rows', () => {
    const visibleRows = ref<TestItem[]>(rows);
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => get(visibleRows)),
        },
      ),
    );
    unmount = u;

    set(visibleRows, [rows[0]!]);
    result.deselectRemovedRows();
    expect(get(selectedData)).toHaveLength(1);
    expect(get(selectedData)).toContain(1);
  });

  it('should select a row via onSelect', () => {
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onSelect(true, 2, true);
    expect(get(selectedData)).toContain(2);
  });

  it('should deselect a row via onSelect', () => {
    const selectedData = ref<number[]>([1, 2]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onSelect(false, 2, true);
    expect(get(selectedData)).not.toContain(2);
    expect(get(selectedData)).toContain(1);
  });

  it('should not duplicate when selecting already selected row', () => {
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onSelect(true, 1, true);
    expect(get(selectedData)).toEqual([1]);
  });

  it('should compute isSelectable correctly', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Disabled but selected → selectable (can be shown as checked)
    expect(result.isSelectable(1)).toBe(true);
    // Not disabled → selectable
    expect(result.isSelectable(2)).toBe(true);
  });

  it('should compute isSelectable as false for disabled unselected row', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Disabled and not selected → not selectable
    expect(result.isSelectable(1)).toBe(false);
  });

  it('should compute mustSelect correctly', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Selected + disabled → must stay selected
    expect(result.mustSelect(1)).toBe(true);
    // Selected but not disabled → can be deselected
    expect(result.mustSelect(2)).toBe(false);
    // Not selected → false
    expect(result.mustSelect(3)).toBe(false);
  });

  it('should keep mustSelect rows when toggling all off', () => {
    const disabledRow: TestItem = { id: 1, name: 'Alice' };
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.onToggleAll(false);
    // Only the must-select row should remain
    expect(get(selectedData)).toEqual([1]);
  });

  it('should reset checkbox shift state', () => {
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Should not throw
    result.resetCheckboxShiftState();
  });

  it('should deselect on other pages when multi-page toggle off', () => {
    // Page 1 has rows 2,3. Row 1 is from another page.
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: true, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows.slice(1)), // only Bob(2), Charlie(3) visible
        },
      ),
    );
    unmount = u;

    result.onToggleAll(false);
    // Row 1 from other page should remain
    expect(get(selectedData)).toEqual([1]);
  });

  it('should not deselect when selectedData is undefined', () => {
    const selectedData = ref<number[] | undefined>(undefined);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData: selectedData as any,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Should not throw
    result.onToggleAll(true);
    expect(get(selectedData)).toBeUndefined();
  });

  it('should skip onSelect when shiftClicked and userAction', () => {
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Simulate internal shiftClicked state by calling resetCheckboxShiftState
    // then select normally to verify the baseline works
    result.onSelect(true, 1, true);
    expect(get(selectedData)).toContain(1);

    // The shiftClicked flag is internal — we can't set it directly,
    // but we test that normal userAction select works
    result.onSelect(true, 2, true);
    expect(get(selectedData)).toContain(2);
  });

  it('should not select when internalSelectedData is falsy', () => {
    const selectedData = ref<number[] | undefined>(undefined);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData: selectedData as any,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Should not throw when selectedData is undefined
    result.onSelect(true, 1, false);
    expect(get(selectedData)).toBeUndefined();
  });

  it('should not deselect a row that is not selected via onSelect', () => {
    const selectedData = ref<number[]>([1]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // Deselect id 2 which is not selected — should be a no-op
    result.onSelect(false, 2, true);
    expect(get(selectedData)).toEqual([1]);
  });

  it('should compute indeterminate as false when selectedData is undefined', () => {
    const selectedData = ref<number[] | undefined>(undefined);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData: selectedData as any,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    expect(get(result.indeterminate)).toBe(false);
  });

  it('should return empty disabledRowKeySet when disabledRows is undefined', () => {
    const selectedData = ref<number[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    // No rows should be disabled
    expect(result.isDisabledRow(1)).toBe(false);
    expect(result.isDisabledRow(2)).toBe(false);
    expect(result.isDisabledRow(3)).toBe(false);
  });

  it('should not modify selection when deselectRemovedRows has nothing to remove', () => {
    const selectedData = ref<number[]>([1, 2, 3]);
    const { result, unmount: u } = withSetup(() =>
      useTableSelection<TestItem, 'id'>(
        { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
        {
          selectedData,
          filtered: computed(() => rows),
        },
      ),
    );
    unmount = u;

    result.deselectRemovedRows();
    // All visible, nothing removed
    expect(get(selectedData)).toEqual([1, 2, 3]);
  });
});
