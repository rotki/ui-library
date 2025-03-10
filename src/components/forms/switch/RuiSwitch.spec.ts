import RuiSwitch from '@/components/forms/switch/RuiSwitch.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

function createWrapper(options?: ComponentMountingOptions<typeof RuiSwitch>) {
  return mount(RuiSwitch, { ...options });
}

describe('forms/Switch', () => {
  it('renders properly', () => {
    const label = 'Switch Label';
    const wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.get('label > div > div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_toggle_/)]),
    );
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('label').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_disabled_/)]),
    );
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.get('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_disabled_/)]),
    );
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('label').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_disabled_/)]),
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({ props: { color: 'primary' } });
    expect(wrapper.find('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });

  it('passes size props', () => {
    const wrapper = createWrapper({ props: { size: 'sm' } });
    expect(wrapper.find('label').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_sm_/)]),
    );
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Switch Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details > div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/text-rui-text-secondary/)]),
    );
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Switch Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details > div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/text-rui-error/)]),
    );
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('passes hideDetails', () => {
    const wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });
});
