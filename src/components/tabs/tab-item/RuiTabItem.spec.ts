import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

function createWrapper(options?: ComponentMountingOptions<typeof RuiTabItem>) {
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

describe('tabs/TabItem', () => {
  it('do not render if not active', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('div').find('div').exists()).toBeFalsy();
  });

  it('render if it\'s active', async () => {
    const wrapper = createWrapper({
      props: {
        active: true,
      },
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/hidden/)]),
    );

    await wrapper.setProps({
      eager: true,
    });
    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/hidden/)]),
    );

    await wrapper.setProps({
      active: false,
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/hidden/)]),
    );
  });
});
