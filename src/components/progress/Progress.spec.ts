import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Progress from '@/components/progress/Progress.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Progress>) =>
  mount(Progress, options);

describe('Progress', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        value: 50,
      },
    });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_progress_/,
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_inherit_/);
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_determinate_/,
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        value: 50,
        variant: 'indeterminate',
        color: 'secondary',
      },
    });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_secondary_/,
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_indeterminate_/,
    );
    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_primary_/);
    await wrapper.setProps({ color: 'inherit' });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(/_inherit_/);
    await wrapper.setProps({ circular: true });
    expect(wrapper.get('div[role=progressbar]').classes()).toMatch(
      /_circular_/,
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[role=progressbar]').classes()).toMatch(
      /_inherit_/,
    );

    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.find('div[role=progressbar]').classes()).toMatch(
      /_primary_/,
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[role=progressbar]').classes()).toMatch(
      /_secondary_/,
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[role=progressbar]').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[role=progressbar]').classes()).toMatch(
      /_success_/,
    );
  });
});
