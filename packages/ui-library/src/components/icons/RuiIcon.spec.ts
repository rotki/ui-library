import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiIcon from '@/components/icons/RuiIcon.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiIcon>): VueWrapper<InstanceType<typeof RuiIcon>> {
  return mount(RuiIcon, options);
}

describe('components/icons/RuiIcon.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiIcon>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
        name: 'lu-circle-arrow-down',
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_rui-icon_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
  });

  it('should have aria-hidden="true" on svg', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
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
