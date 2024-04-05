import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Progress from '@/components/progress/Progress.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Progress>) {
  return mount(Progress, options);
}

describe('progress', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        value: 50,
      },
    });
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_progress_/)]),
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_inherit_/)]),
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_determinate_/)]),
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'secondary',
        value: 50,
        variant: 'indeterminate',
      },
    });
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_indeterminate_/)]),
    );
    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
    await wrapper.setProps({ color: 'inherit' });
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_inherit_/)]),
    );
    await wrapper.setProps({ circular: true });
    expect(wrapper.get('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_circular_/)]),
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({});
    expect(wrapper.find('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_inherit_/)]),
    );

    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.find('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[role=progressbar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });
});
