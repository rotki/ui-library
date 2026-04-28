import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTableEmptyState>,
) {
  return mount(RuiTableEmptyState, options);
}

describe('components/tables/RuiTableEmptyState.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render placeholder image', () => {
    wrapper = createWrapper();

    const img = wrapper.find('img');
    expect(img.exists()).toBeTruthy();
    expect(img.attributes('src')).toBeTruthy();
    expect(img.classes()).toContain('h-32');
  });

  it('should render label text when label prop is provided', () => {
    wrapper = createWrapper({
      props: {
        label: 'No data available',
      },
    });

    const label = wrapper.find('[data-id="empty-label"]');
    expect(label.exists()).toBeTruthy();
    expect(label.text()).toBe('No data available');
  });

  it('should not render label when no label prop is provided', () => {
    wrapper = createWrapper();

    expect(wrapper.find('[data-id="empty-label"]').exists()).toBeFalsy();
  });

  it('should render description text when description prop is provided', () => {
    wrapper = createWrapper({
      props: {
        description: 'Try adjusting your filters',
      },
    });

    const description = wrapper.find('[data-id="empty-description"]');
    expect(description.exists()).toBeTruthy();
    expect(description.text()).toBe('Try adjusting your filters');
  });

  it('should not render description when no description prop is provided', () => {
    wrapper = createWrapper();

    expect(wrapper.find('[data-id="empty-description"]').exists()).toBeFalsy();
  });

  it('should render description slot content when slot is provided', () => {
    wrapper = createWrapper({
      slots: {
        description: '<span data-id="custom-description">Custom description content</span>',
      },
    });

    const customDescription = wrapper.find('[data-id="custom-description"]');
    expect(customDescription.exists()).toBeTruthy();
    expect(customDescription.text()).toBe('Custom description content');
  });

  it('should prefer description slot over description prop', () => {
    wrapper = createWrapper({
      props: {
        description: 'Prop description',
      },
      slots: {
        description: '<span data-id="slot-description">Slot description</span>',
      },
    });

    expect(wrapper.find('[data-id="empty-description"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-id="slot-description"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id="slot-description"]').text()).toBe('Slot description');
  });

  it('should use label as image alt text', () => {
    wrapper = createWrapper({
      props: {
        label: 'No results',
      },
    });

    expect(wrapper.find('img').attributes('alt')).toBe('No results');
  });
});
