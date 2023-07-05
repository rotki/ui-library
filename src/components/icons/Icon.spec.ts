import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Icon from '@/components/icons/Icon.vue';

const createWrapper = (options: ComponentMountingOptions<typeof Icon>) =>
  mount(Icon, options);

describe('Forms/Icon', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        name: 'arrow-down-circle-fill',
        color: 'primary',
      },
    });
    expect(wrapper.classes()).toMatch(/_remixicon_/);
    expect(wrapper.classes()).toMatch(/_primary_/);
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
    expect(wrapper.classes()).toMatch(/_primary_/);
    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.classes()).toMatch(/_secondary_/);
  });
});
