import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Progress from '@/components/progress/Progress.vue';

const createWrapper = (options: ComponentMountingOptions<typeof Progress>) =>
  mount(Progress, options);

describe('Progress', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        value: 0.5,
      },
    });
    expect(wrapper.classes()).toMatch(/_progress_/);
    expect(wrapper.classes()).toMatch(/_primary_/);
    expect(wrapper.classes()).toMatch(/_determinate_/);
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        value: 0.5,
        type: 'indeterminate',
        color: 'secondary',
      },
    });
    expect(wrapper.classes()).toMatch(/_secondary_/);
    expect(wrapper.classes()).toMatch(/_indeterminate_/);
    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.classes()).toMatch(/_primary_/);
    await wrapper.setProps({ color: 'inherit' });
    expect(wrapper.classes()).toMatch(/_inherit_/);
    await wrapper.setProps({ circular: true });
    expect(wrapper.classes()).toMatch(/_circular_/);
  });
});
