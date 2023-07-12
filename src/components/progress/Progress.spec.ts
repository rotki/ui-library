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
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_progress_/
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_primary_/);
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_determinate_/
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        value: 0.5,
        variant: 'indeterminate',
        color: 'secondary',
      },
    });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_secondary_/
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_indeterminate_/
    );
    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_primary_/);
    await wrapper.setProps({ color: 'inherit' });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_inherit_/);
    await wrapper.setProps({ circular: true });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_circular_/
    );
  });
});
