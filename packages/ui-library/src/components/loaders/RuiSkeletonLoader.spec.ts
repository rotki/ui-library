import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSkeletonLoader from '@/components/loaders/RuiSkeletonLoader.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiSkeletonLoader>,
): VueWrapper<InstanceType<typeof RuiSkeletonLoader>> {
  return mount(RuiSkeletonLoader, options);
}

describe('components/loaders/RuiSkeletonLoader.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiSkeletonLoader>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper();
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=alert]', /_rounded_/);
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        rounded: 'full',
        type: 'text',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_text_/);
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');

    await wrapper.setProps({ type: 'paragraph' });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_text_/);

    await wrapper.setProps({ type: 'heading' });
    expectWrapperToHaveClass(wrapper, 'div[role=alert]', /_skeleton_heading_/);

    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });
});
