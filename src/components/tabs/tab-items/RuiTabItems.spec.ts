import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RuiTabItems from '@/components/tabs/tab-items/RuiTabItems.vue';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

function createWrapper(options?: ComponentMountingOptions<typeof RuiTabItems>) {
  return mount(RuiTabItems, {
    ...options,
    global: {
      stubs: {
        TabItem: RuiTabItem,
        Transition: false,
      },
    },
    slots: {
      default: [
        { template: '<TabItem><div>Tab Content 1</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 2</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 3</div></TabItem>' },
        { template: '<TabItem><div>Tab Content 4</div></TabItem>' },
      ],
    },
  });
}

describe('tabs/TabItems', () => {
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
