import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTabItem>,
) {
  return mount(RuiTabItem, {
    ...options,
    global: {
      stubs: {
        Transition: false,
      },
    },
    props: {
      value: 'value',
      ...options?.props,
    },
  });
}

describe('components/tabs/tab-item/RuiTabItem.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should not render if not active', () => {
    wrapper = createWrapper();

    expect(wrapper.find('div').find('div').exists()).toBeFalsy();
  });

  it('should render if it\'s active', async () => {
    wrapper = createWrapper({
      props: {
        active: true,
      },
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperNotToHaveClass(wrapper, ':scope > div', /hidden/);

    await wrapper.setProps({
      eager: true,
    });
    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperNotToHaveClass(wrapper, ':scope > div', /hidden/);

    await wrapper.setProps({
      active: false,
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperToHaveClass(wrapper, ':scope > div', /hidden/);
  });
});
