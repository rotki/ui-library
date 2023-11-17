import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Skeleton from '@/components/loaders/Skeleton.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Skeleton>) =>
  mount(Skeleton, options);

describe('Skeleton', () => {
  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.get('div[role=alert]').classes()).toMatch(/_skeleton_/);
    expect(wrapper.get('div[role=alert]').classes()).not.toMatch(/_rounded_/);
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        type: 'text',
        rounded: 'full',
      },
    });
    expect(wrapper.get('div[role=alert]').classes()).toMatch(/_skeleton_text_/);
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-full');
    await wrapper.setProps({ type: 'paragraph' });
    expect(wrapper.get('div[role=alert]').classes()).toMatch(/_skeleton_text_/);
    await wrapper.setProps({ type: 'heading' });
    expect(wrapper.get('div[role=alert]').classes()).toMatch(
      /_skeleton_heading_/,
    );
    await wrapper.setProps({ rounded: 'none' });
    expect(wrapper.get('div[role=alert]').classes()).toContain('rounded-none');
  });
});
