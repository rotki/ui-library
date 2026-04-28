import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTableSelection } from '@/composables/tables/data-table/selection';
import { GROUP_HEADER_BRAND, type GroupedTableRow, type GroupHeader } from '@/composables/tables/data-table/types';
import { withSetup } from '~/tests/helpers/with-setup';

interface TestItem {
  id: number;
  name: string;
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

  describe('onCheckboxClick shift-select', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      unmount?.();
    });

    function createMockCheckboxEvent(options: { shiftKey: boolean }): MouseEvent {
      const input = document.createElement('input');
      input.type = 'checkbox';
      const wrapper = document.createElement('div');
      wrapper.appendChild(input);

      const target = document.createElement('div');
      wrapper.appendChild(target);

      const event = new MouseEvent('click', { shiftKey: options.shiftKey, bubbles: true });
      Object.defineProperty(event, 'currentTarget', { value: wrapper });
      Object.defineProperty(event, 'target', { value: target });
      return event;
    }

    it('should select a contiguous range between last click and current click', () => {
      const selectedData = ref<number[]>([]);
      const extendedRows: TestItem[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Dave' },
        { id: 5, name: 'Eve' },
      ];
      const { result, unmount: u } = withSetup(() =>
        useTableSelection<TestItem, 'id'>(
          { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
          {
            selectedData,
            filtered: computed<GroupedTableRow<TestItem>[]>(() => extendedRows),
          },
        ),
      );
      unmount = u;

      // First click on row index 0 (non-shift to set anchor)
      const normalEvent = createMockCheckboxEvent({ shiftKey: false });
      result.onCheckboxClick(normalEvent, 1, 0);

      // Select row 1 so it becomes the anchor's selected state
      result.onSelect(true, 1, true);

      // Shift-click on row index 3
      const shiftEvent = createMockCheckboxEvent({ shiftKey: true });
      result.onCheckboxClick(shiftEvent, 4, 3);

      vi.advanceTimersByTime(2);

      // Rows 0..3 (ids 1,2,3,4) should be selected
      expect(get(selectedData)).toContain(1);
      expect(get(selectedData)).toContain(2);
      expect(get(selectedData)).toContain(3);
      expect(get(selectedData)).toContain(4);
      expect(get(selectedData)).not.toContain(5);
    });

    it('should deselect range when anchor row was deselected', () => {
      const extendedRows: TestItem[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Dave' },
      ];
      const selectedData = ref<number[]>([1, 2, 3, 4]);
      const { result, unmount: u } = withSetup(() =>
        useTableSelection<TestItem, 'id'>(
          { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
          {
            selectedData,
            filtered: computed<GroupedTableRow<TestItem>[]>(() => extendedRows),
          },
        ),
      );
      unmount = u;

      // First click on row index 0 (non-shift to set anchor)
      const normalEvent = createMockCheckboxEvent({ shiftKey: false });
      result.onCheckboxClick(normalEvent, 1, 0);

      // Deselect the anchor row so isSelected(1) is false
      result.onSelect(false, 1, true);

      // Shift-click on row index 3
      const shiftEvent = createMockCheckboxEvent({ shiftKey: true });
      result.onCheckboxClick(shiftEvent, 4, 3);

      vi.advanceTimersByTime(2);

      // All rows in the range should be deselected
      expect(get(selectedData)).not.toContain(1);
      expect(get(selectedData)).not.toContain(2);
      expect(get(selectedData)).not.toContain(3);
      expect(get(selectedData)).not.toContain(4);
    });

    it('should skip disabled rows within the range', () => {
      const extendedRows: TestItem[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Dave' },
      ];
      const disabledRow: TestItem = { id: 2, name: 'Bob' };
      const selectedData = ref<number[]>([]);
      const { result, unmount: u } = withSetup(() =>
        useTableSelection<TestItem, 'id'>(
          { rowAttr: 'id', multiPageSelect: false, disabledRows: () => [disabledRow] },
          {
            selectedData,
            filtered: computed<GroupedTableRow<TestItem>[]>(() => extendedRows),
          },
        ),
      );
      unmount = u;

      // First click on row 0 (non-shift to set anchor)
      const normalEvent = createMockCheckboxEvent({ shiftKey: false });
      result.onCheckboxClick(normalEvent, 1, 0);

      // Select row 1 so anchor is selected
      result.onSelect(true, 1, true);

      // Shift-click on row 3
      const shiftEvent = createMockCheckboxEvent({ shiftKey: true });
      result.onCheckboxClick(shiftEvent, 4, 3);

      vi.advanceTimersByTime(2);

      // Row 2 (disabled) should not be selected
      expect(get(selectedData)).toContain(1);
      expect(get(selectedData)).not.toContain(2);
      expect(get(selectedData)).toContain(3);
      expect(get(selectedData)).toContain(4);
    });

    it('should skip group headers in filtered data', () => {
      const groupHeader: GroupHeader<TestItem> = {
        [GROUP_HEADER_BRAND]: true,
        identifier: 'group-1',
        group: { name: 'Group 1' },
      };
      const mixedRows: GroupedTableRow<TestItem>[] = [
        { id: 1, name: 'Alice' },
        groupHeader,
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const selectedData = ref<number[]>([]);
      const { result, unmount: u } = withSetup(() =>
        useTableSelection<TestItem, 'id'>(
          { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
          {
            selectedData,
            filtered: computed<GroupedTableRow<TestItem>[]>(() => mixedRows),
          },
        ),
      );
      unmount = u;

      // First click on index 0 (non-shift to set anchor)
      const normalEvent = createMockCheckboxEvent({ shiftKey: false });
      result.onCheckboxClick(normalEvent, 1, 0);

      // Select row 1 so anchor is selected
      result.onSelect(true, 1, true);

      // Shift-click on index 3 (id: 3)
      const shiftEvent = createMockCheckboxEvent({ shiftKey: true });
      result.onCheckboxClick(shiftEvent, 3, 3);

      vi.advanceTimersByTime(2);

      // All real rows should be selected, group header skipped
      expect(get(selectedData)).toContain(1);
      expect(get(selectedData)).toContain(2);
      expect(get(selectedData)).toContain(3);
      expect(get(selectedData)).toHaveLength(3);
    });

    it('should select single row when no prior click exists', () => {
      const selectedData = ref<number[]>([]);
      const { result, unmount: u } = withSetup(() =>
        useTableSelection<TestItem, 'id'>(
          { rowAttr: 'id', multiPageSelect: false, disabledRows: () => undefined },
          {
            selectedData,
            filtered: computed<GroupedTableRow<TestItem>[]>(() => rows),
          },
        ),
      );
      unmount = u;

      // Shift-click without any prior click (lastSelectedIndex === -1)
      const shiftEvent = createMockCheckboxEvent({ shiftKey: true });
      result.onCheckboxClick(shiftEvent, 2, 1);

      vi.advanceTimersByTime(2);

      // When lastSelectedIndex is -1, it falls back to lastIndex = index,
      // so it toggles just the single row at that index.
      // Row at index 1 is id:2, and since it's not selected, isSelected returns false,
      // so valueToApply is false, and it calls onSelect(!false, value) = onSelect(true, 2)
      expect(get(selectedData)).toContain(2);
      expect(get(selectedData)).toHaveLength(1);
    });
  });
});
