import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiRevealableTextField from '@/components/forms/revealable-text-field/RuiRevealableTextField.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiRevealableTextField>,
): VueWrapper<InstanceType<typeof RuiRevealableTextField>> {
  return mount(RuiRevealableTextField, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/forms/revealable-text-field/RuiRevealableTextField.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiRevealableTextField>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Password';
    wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('should toggle the input type', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.find('input').attributes().type).toBe('password');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe('lu-eye-off');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('text');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe('lu-eye');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('password');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe('lu-eye-off');
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Password';
    wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });

    // Required asterisk should not be present by default
    expect(wrapper.find('label').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('label').text()).toContain('﹡');
    expect(wrapper.find('label .text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('label').text()).not.toContain('﹡');
  });
});
