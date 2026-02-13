import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useTableExpansion } from '@/composables/tables/data-table/expansion';

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

describe('composables/tables/data-table/expansion', () => {
  let unmount: () => void;

  afterEach(() => {
    unmount?.();
  });

  it('should return expandable as false when expanded is undefined', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded: ref(undefined), hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;
    expect(get(result.expandable)).toBe(false);
  });

  it('should return expandable as false when no expanded-item slot', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded: ref([]), hasExpandedItemSlot: ref(false) },
      ),
    );
    unmount = u;
    expect(get(result.expandable)).toBe(false);
  });

  it('should return expandable as true when both expanded and slot exist', () => {
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded: ref([]), hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;
    expect(get(result.expandable)).toBe(true);
  });

  it('should toggle expansion for a row', () => {
    const expanded = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded, hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;

    const row: TestItem = { id: 1, name: 'Alice' };
    expect(result.isExpanded(1)).toBe(false);

    result.onToggleExpand(row);
    expect(result.isExpanded(1)).toBe(true);

    result.onToggleExpand(row);
    expect(result.isExpanded(1)).toBe(false);
  });

  it('should support single expand mode', () => {
    const expanded = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: true },
        { expanded, hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;

    const row1: TestItem = { id: 1, name: 'Alice' };
    const row2: TestItem = { id: 2, name: 'Bob' };

    result.onToggleExpand(row1);
    expect(result.isExpanded(1)).toBe(true);

    result.onToggleExpand(row2);
    expect(result.isExpanded(1)).toBe(false);
    expect(result.isExpanded(2)).toBe(true);
  });

  it('should not toggle expand when expanded is undefined', () => {
    const expanded = ref<TestItem[] | undefined>(undefined);
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded: expanded as any, hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;

    result.onToggleExpand({ id: 1, name: 'Alice' });
    expect(get(expanded)).toBeUndefined();
  });

  it('should collapse single-expand row when toggling the same row', () => {
    const expanded = ref<TestItem[]>([{ id: 1, name: 'Alice' }]);
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: true },
        { expanded, hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;

    expect(result.isExpanded(1)).toBe(true);
    result.onToggleExpand({ id: 1, name: 'Alice' });
    expect(result.isExpanded(1)).toBe(false);
    expect(get(expanded)).toEqual([]);
  });

  it('should support multiple expand mode', () => {
    const expanded = ref<TestItem[]>([]);
    const { result, unmount: u } = withSetup(() =>
      useTableExpansion<TestItem, 'id'>(
        { rowAttr: 'id', singleExpand: false },
        { expanded, hasExpandedItemSlot: ref(true) },
      ),
    );
    unmount = u;

    const row1: TestItem = { id: 1, name: 'Alice' };
    const row2: TestItem = { id: 2, name: 'Bob' };

    result.onToggleExpand(row1);
    result.onToggleExpand(row2);
    expect(result.isExpanded(1)).toBe(true);
    expect(result.isExpanded(2)).toBe(true);
  });
});
