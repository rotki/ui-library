import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Skeleton from '@/components/loaders/Skeleton.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Skeleton>) {
  return mount(Skeleton, options);
}

describe('skeleton', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.get('div[role=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_skeleton_/)]),
    );
    expect(wrapper.get('div[role=alert]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded_/)]),
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        rounded: 'full',
        type: 'text',
      },
    });
    expect(wrapper.get('div[role=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_skeleton_text_/)]),
    );
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');
    await wrapper.setProps({ type: 'paragraph' });
    expect(wrapper.get('div[role=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_skeleton_text_/)]),
    );
    await wrapper.setProps({ type: 'heading' });
    expect(wrapper.get('div[role=alert]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_skeleton_heading_/)]),
    );
    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });
});
