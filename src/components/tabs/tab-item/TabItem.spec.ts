import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import TabItem from '@/components/tabs/tab-item/TabItem.vue';

vi.mock('@headlessui/vue', () => ({
  TransitionRoot: {
    props: {
      show: { type: Boolean },
    },
    template: `
      <div v-if='show'><slot /></div>
    `,
  },
}));

function createWrapper(options?: ComponentMountingOptions<typeof TabItem>) {
  return mount(TabItem, {
    ...options,
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
