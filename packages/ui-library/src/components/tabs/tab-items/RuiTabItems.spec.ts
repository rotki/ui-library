import { afterEach, describe, expect, it } from 'vitest';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import RuiTabItems from '@/components/tabs/tab-items/RuiTabItems.vue';
import { syncAnimationFrames } from '~/tests/helpers/animation-frame';
import { createMounter, type MountedWrapper } from '~/tests/helpers/mount-component';

syncAnimationFrames();

const createWrapper = createMounter(RuiTabItems, {
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

describe('components/tabs/tab-items/RuiTabItems.vue', () => {
  let wrapper: MountedWrapper<typeof RuiTabItems>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', async () => {
    wrapper = createWrapper({
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
