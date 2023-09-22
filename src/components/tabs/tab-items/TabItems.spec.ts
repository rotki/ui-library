import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import TabItems from '@/components/tabs/tab-items/TabItems.vue';
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
const createWrapper = (options?: ComponentMountingOptions<typeof TabItems>) =>
  mount(TabItems, {
    ...options,
    global: { stubs: { TabItem } },
    slots: {
      default: [
        { template: '<TabItem><div>Tab Content 1</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 2</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 3</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 4</div></TabItem>' },
      ],
    },
  });

describe('Tabs/TabItems', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 0,
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('Tab Content 1');

    await wrapper.setProps({ modelValue: 1 });
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toBe('Tab Content 2');
  });
});
