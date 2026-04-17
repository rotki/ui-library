import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, type Ref, ref } from 'vue';
import { type TablePaginationData, usePaginationNavigation } from '@/components/tables/use-pagination-navigation';
import { createTableDefaults, type TableOptions } from '@/composables/defaults/table';

function withSetup(
  initialData: TablePaginationData,
  tableOptions?: Partial<TableOptions>,
  rangesThreshold?: number,
) {
  const modelValue = ref<TablePaginationData>(initialData) as Ref<TablePaginationData>;
  const defaults = createTableDefaults(tableOptions);

  let result!: ReturnType<typeof usePaginationNavigation>;
  const TestComponent = defineComponent({
    setup() {
      result = usePaginationNavigation(modelValue, defaults, rangesThreshold);
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);

  return { result, modelValue, unmount: () => wrapper.unmount() };
}

describe('components/tables/use-pagination-navigation', () => {
  let unmount: () => void;

  afterEach(() => {
    unmount?.();
  });

  describe('limits', () => {
    it('should use default limits when none provided in model', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      expect(result.limits.value).toEqual([
        { limit: 10 },
        { limit: 25 },
        { limit: 50 },
        { limit: 100 },
      ]);
    });

    it('should use custom limits from model when provided', () => {
      const { result, unmount: u } = withSetup({
        page: 1,
        total: 100,
        limit: 5,
        limits: [5, 15, 30],
      });
      unmount = u;

      expect(result.limits.value).toEqual([
        { limit: 5 },
        { limit: 15 },
        { limit: 30 },
      ]);
    });

    it('should use custom table default limits', () => {
      const { result, unmount: u } = withSetup(
        { page: 1, total: 50, limit: 20 },
        { limits: [20, 40, 60] },
      );
      unmount = u;

      expect(result.limits.value).toEqual([
        { limit: 20 },
        { limit: 40 },
        { limit: 60 },
      ]);
    });
  });

  describe('currentLimit', () => {
    it('should reflect the model limit', () => {
      const { result, unmount: u } = withSetup({ page: 3, total: 100, limit: 25 });
      unmount = u;

      expect(result.currentLimit.value).toBe(25);
    });

    it('should reset page to 1 when limit changes', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 3, total: 100, limit: 10 });
      unmount = u;

      result.currentLimit.value = 25;

      expect(modelValue.value.limit).toBe(25);
      expect(modelValue.value.page).toBe(1);
    });
  });

  describe('pages', () => {
    it('should calculate total pages correctly', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(10);
    });

    it('should round up for partial pages', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 27, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(3);
    });

    it('should return 0 when total is 0', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 0, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(0);
    });
  });

  describe('ranges', () => {
    it('should generate correct range text for each page', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 25, limit: 10 });
      unmount = u;

      expect(result.ranges.value).toEqual([
        { page: 1, text: '1 - 10' },
        { page: 2, text: '11 - 20' },
        { page: 3, text: '21 - 25' },
      ]);
    });

    it('should be empty when total is 0', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 0, limit: 10 });
      unmount = u;

      expect(result.ranges.value).toEqual([]);
    });

    it('should format large numbers with separators', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 5000, limit: 2500 });
      unmount = u;

      expect(result.ranges.value).toEqual([
        { page: 1, text: '1 - 2,500' },
        { page: 2, text: '2,501 - 5,000' },
      ]);
    });
  });

  describe('useInputJump / rangesThreshold', () => {
    it('should stay on the dropdown when pages fit within the default threshold', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 5000, limit: 10 });
      unmount = u;

      expect(result.useInputJump.value).toBe(false);
      expect(result.ranges.value).toHaveLength(500);
    });

    it('should flip to input mode and skip range materialisation above the threshold', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 5010, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(501);
      expect(result.useInputJump.value).toBe(true);
      expect(result.ranges.value).toEqual([]);
    });

    it('should respect a custom threshold', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 120, limit: 10 }, undefined, 5);
      unmount = u;

      expect(result.useInputJump.value).toBe(true);
      expect(result.ranges.value).toEqual([]);
    });

    it('should disable the input-mode switch when threshold is 0', () => {
      const { result, unmount: u } = withSetup(
        { page: 1, total: 100_000, limit: 10 },
        undefined,
        0,
      );
      unmount = u;

      expect(result.useInputJump.value).toBe(false);
    });

    it('should avoid materialising millions of ranges when total is huge', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 4_015_386, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(401_539);
      expect(result.useInputJump.value).toBe(true);
      expect(result.ranges.value).toEqual([]);
    });
  });

  describe('indicatorText', () => {
    it('should show total count', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      expect(result.indicatorText.value).toBe('of 100');
    });

    it('should show "0 of 0" when total is 0', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 0, limit: 10 });
      unmount = u;

      expect(result.indicatorText.value).toBe('0 of 0');
    });

    it('should format large totals', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 10000, limit: 100 });
      unmount = u;

      expect(result.useInputJump.value).toBe(false);
      expect(result.indicatorText.value).toBe('of 10,000');
    });

    it('should switch to page count in input mode', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 100_000, limit: 10 });
      unmount = u;

      expect(result.useInputJump.value).toBe(true);
      expect(result.indicatorText.value).toBe('of 10,000');
    });
  });

  describe('currentRange', () => {
    it('should reflect the model page', () => {
      const { result, unmount: u } = withSetup({ page: 3, total: 100, limit: 10 });
      unmount = u;

      expect(result.currentRange.value).toBe(3);
    });

    it('should update model page when set', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      result.currentRange.value = 5;

      expect(modelValue.value.page).toBe(5);
      expect(modelValue.value.limit).toBe(10);
      expect(modelValue.value.total).toBe(100);
    });
  });

  describe('hasPrev / hasNext', () => {
    it('should not have prev on first page', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      expect(result.hasPrev.value).toBe(false);
      expect(result.hasNext.value).toBe(true);
    });

    it('should not have next on last page', () => {
      const { result, unmount: u } = withSetup({ page: 10, total: 100, limit: 10 });
      unmount = u;

      expect(result.hasPrev.value).toBe(true);
      expect(result.hasNext.value).toBe(false);
    });

    it('should have both on a middle page', () => {
      const { result, unmount: u } = withSetup({ page: 5, total: 100, limit: 10 });
      unmount = u;

      expect(result.hasPrev.value).toBe(true);
      expect(result.hasNext.value).toBe(true);
    });

    it('should have neither when total is 0', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 0, limit: 10 });
      unmount = u;

      expect(result.hasPrev.value).toBe(false);
      expect(result.hasNext.value).toBe(false);
    });
  });

  describe('navigation', () => {
    it('onNext should advance to next page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      result.onNext();

      expect(modelValue.value.page).toBe(2);
    });

    it('onPrev should go to previous page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 3, total: 100, limit: 10 });
      unmount = u;

      result.onPrev();

      expect(modelValue.value.page).toBe(2);
    });

    it('onFirst should go to page 1', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 5, total: 100, limit: 10 });
      unmount = u;

      result.onFirst();

      expect(modelValue.value.page).toBe(1);
    });

    it('onLast should go to last page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      result.onLast();

      expect(modelValue.value.page).toBe(10);
    });

    it('onPrev should be no-op on first page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      result.onPrev();

      expect(modelValue.value.page).toBe(1);
    });

    it('onNext should be no-op on last page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 10, total: 100, limit: 10 });
      unmount = u;

      result.onNext();

      expect(modelValue.value.page).toBe(10);
    });

    it('onFirst should be no-op on first page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      result.onFirst();

      expect(modelValue.value.page).toBe(1);
    });

    it('onLast should be no-op on last page', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 10, total: 100, limit: 10 });
      unmount = u;

      result.onLast();

      expect(modelValue.value.page).toBe(10);
    });
  });

  describe('reactivity', () => {
    it('should update derived state when model changes externally', () => {
      const { result, modelValue, unmount: u } = withSetup({ page: 1, total: 100, limit: 10 });
      unmount = u;

      expect(result.pages.value).toBe(10);
      expect(result.hasNext.value).toBe(true);

      modelValue.value = { page: 1, total: 5, limit: 10 };

      expect(result.pages.value).toBe(1);
      expect(result.hasNext.value).toBe(false);
      expect(result.indicatorText.value).toBe('of 5');
    });

    it('should update ranges when limit changes', () => {
      const { result, unmount: u } = withSetup({ page: 1, total: 30, limit: 10 });
      unmount = u;

      expect(result.ranges.value).toHaveLength(3);

      result.currentLimit.value = 30;

      expect(result.ranges.value).toHaveLength(1);
      expect(result.ranges.value[0]?.text).toBe('1 - 30');
    });
  });
});
