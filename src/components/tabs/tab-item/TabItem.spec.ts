import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import TabItem from '@/components/tabs/tab-item/TabItem.vue';

vi.mock('@headlessui/vue', () => ({
  TransitionRoot: {
    template: `
      <div v-if='show'><slot /></div>
    `,
    props: {
      show: { type: Boolean },
    },
  },
}));

const createWrapper = (options?: ComponentMountingOptions<typeof TabItem>) =>
  mount(TabItem, {
    ...options,
    props: {
      value: 'value',
      ...options?.props,
    },
  });

describe('Tabs/TabItem', () => {
  it('do not render if not active', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('div').find('div').exists()).toBeFalsy();
  });

  it("render if it's active", async () => {
    const wrapper = createWrapper({
      props: {
        active: true,
      },
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).not.toMatch(/hidden/);

    await wrapper.setProps({
      eager: true,
    });
    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).not.toMatch(/hidden/);

    await wrapper.setProps({
      active: false,
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expect(wrapper.find('div').find('div').classes()).toMatch(/hidden/);
  });
});
