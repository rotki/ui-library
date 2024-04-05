import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Icon from '@/components/icons/Icon.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Icon>) {
  return mount(Icon, options);
}

describe('forms/Icon', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
        name: 'arrow-down-circle-fill',
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_remixicon_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        name: 'arrow-down-circle-fill',
        size: 32,
      },
    });
    expect(wrapper.attributes('width')).toMatch('32');
    expect(wrapper.attributes('height')).toMatch('32');
    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );
  });
});
