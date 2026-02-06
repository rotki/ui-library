import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiDivider from '@/components/divider/RuiDivider.vue';
import { expectNotToHaveClass, expectToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiDivider>,
): VueWrapper<InstanceType<typeof RuiDivider>> {
  return mount(RuiDivider, { ...options, stubs: { RuiIcon: true } });
}

describe('components/divider/RuiDivider.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiDivider>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper();
    expect(wrapper.find('div')).toBeTruthy();
  });

  it('should pass vertical props', async () => {
    wrapper = createWrapper();
    expectNotToHaveClass(wrapper.element, /border-l/);
    expectToHaveClass(wrapper.element, /border-t/);

    await wrapper.setProps({ vertical: true });
    expectNotToHaveClass(wrapper.element, /border-t/);
    expectToHaveClass(wrapper.element, /border-l/);

    await wrapper.setProps({ vertical: false });
    expectNotToHaveClass(wrapper.element, /border-l/);
    expectToHaveClass(wrapper.element, /border-t/);
  });

  it('should have role="separator"', () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('role')).toBe('separator');
  });

  it('should have aria-orientation="horizontal" by default', () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal');
  });

  it('should have aria-orientation="vertical" when vertical', () => {
    wrapper = createWrapper({
      props: {
        vertical: true,
      },
    });
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
  });

  it('should pass attrs to root element', () => {
    wrapper = createWrapper({
      attrs: {
        'data-cy': 'test-divider',
      },
    });
    expect(wrapper.attributes('data-cy')).toBe('test-divider');
  });
});
