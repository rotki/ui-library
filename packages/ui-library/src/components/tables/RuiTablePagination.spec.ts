import type { TablePaginationData } from '@/components/tables/use-pagination-navigation';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTablePagination from '@/components/tables/RuiTablePagination.vue';
import { createTableDefaults, TableSymbol } from '@/composables/defaults/table';

function createWrapper(
  modelValue: TablePaginationData,
  options?: Partial<ComponentMountingOptions<typeof RuiTablePagination>>,
) {
  return mount(RuiTablePagination, {
    props: {
      modelValue,
      ...options?.props,
    },
    global: {
      provide: {
        [TableSymbol.valueOf()]: createTableDefaults({ limits: [5, 10, 25] }),
      },
      ...options?.global,
    },
  });
}

describe('components/tables/RuiTablePagination.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the pagination limit section', () => {
    wrapper = createWrapper({ page: 1, total: 50, limit: 10 });

    expect(wrapper.find('[data-id="table-pagination-limit-section"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="table-pagination-limit-section"]').text()).toContain('Rows per page:');
  });

  it('renders the pagination ranges section', () => {
    wrapper = createWrapper({ page: 1, total: 50, limit: 10 });

    expect(wrapper.find('[data-id="table-pagination-ranges-section"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="table-pagination-ranges-section"]').text()).toContain('Items #');
  });

  it('renders all navigation buttons', () => {
    wrapper = createWrapper({ page: 2, total: 50, limit: 10 });

    expect(wrapper.find('[data-id="table-pagination-first"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="table-pagination-prev"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="table-pagination-next"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="table-pagination-last"]').exists()).toBeTruthy();
  });

  it('disables prev and first buttons on the first page', () => {
    wrapper = createWrapper({ page: 1, total: 50, limit: 10 });

    const firstBtn = wrapper.find('[data-id="table-pagination-first"]');
    const prevBtn = wrapper.find('[data-id="table-pagination-prev"]');

    expect(firstBtn.attributes('disabled')).toBeDefined();
    expect(prevBtn.attributes('disabled')).toBeDefined();
  });

  it('disables next and last buttons on the last page', () => {
    wrapper = createWrapper({ page: 5, total: 50, limit: 10 });

    const nextBtn = wrapper.find('[data-id="table-pagination-next"]');
    const lastBtn = wrapper.find('[data-id="table-pagination-last"]');

    expect(nextBtn.attributes('disabled')).toBeDefined();
    expect(lastBtn.attributes('disabled')).toBeDefined();
  });

  it('enables all navigation buttons on a middle page', () => {
    wrapper = createWrapper({ page: 3, total: 50, limit: 10 });

    const firstBtn = wrapper.find('[data-id="table-pagination-first"]');
    const prevBtn = wrapper.find('[data-id="table-pagination-prev"]');
    const nextBtn = wrapper.find('[data-id="table-pagination-next"]');
    const lastBtn = wrapper.find('[data-id="table-pagination-last"]');

    expect(firstBtn.attributes('disabled')).toBeUndefined();
    expect(prevBtn.attributes('disabled')).toBeUndefined();
    expect(nextBtn.attributes('disabled')).toBeUndefined();
    expect(lastBtn.attributes('disabled')).toBeUndefined();
  });

  it('shows correct indicator text', () => {
    wrapper = createWrapper({ page: 1, total: 50, limit: 10 });

    const rangesSection = wrapper.find('[data-id="table-pagination-ranges-section"]');
    expect(rangesSection.text()).toContain('of 50');
  });

  it('shows "0 of 0" when total is zero', () => {
    wrapper = createWrapper({ page: 1, total: 0, limit: 10 });

    const rangesSection = wrapper.find('[data-id="table-pagination-ranges-section"]');
    expect(rangesSection.text()).toContain('0 of 0');
  });

  it('applies dense mode styles to the wrapper', () => {
    wrapper = createWrapper(
      { page: 1, total: 50, limit: 10 },
      { props: { modelValue: { page: 1, total: 50, limit: 10 }, dense: true } },
    );

    const wrapperEl = wrapper.find('[data-id="table-pagination-navigation"]').element.parentElement;
    expect(wrapperEl?.className).toContain('gap-x-2');
  });

  it('does not apply dense gap class by default', () => {
    wrapper = createWrapper({ page: 1, total: 50, limit: 10 });

    const wrapperEl = wrapper.find('[data-id="table-pagination-navigation"]').element.parentElement;
    expect(wrapperEl?.className).toContain('gap-x-4');
  });

  it('disables all navigation buttons when loading', () => {
    wrapper = createWrapper(
      { page: 3, total: 50, limit: 10 },
      { props: { modelValue: { page: 3, total: 50, limit: 10 }, loading: true } },
    );

    expect(wrapper.find('[data-id="table-pagination-first"]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-id="table-pagination-prev"]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-id="table-pagination-next"]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-id="table-pagination-last"]').attributes('disabled')).toBeDefined();
  });
});
