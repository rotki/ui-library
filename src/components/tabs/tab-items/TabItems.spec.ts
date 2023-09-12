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
    slots: {
      default: [
        h(TabItem, [h('div', 'Tab Content 1')]),
        h(TabItem, [h('div', 'Tab Content 2')]),
        h(TabItem, [h('div', 'Tab Content 3')]),
        h(TabItem, [h('div', 'Tab Content 4')]),
      ],
    },
  });

describe('Tabs/TabItems', () => {
  it('renders properly', async () => {
    const modelValue = ref(0);
    const wrapper = createWrapper({
      props: {
        modelValue,
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('Tab Content 1');

    set(modelValue, 1);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('Tab Content 2');
  });
});
