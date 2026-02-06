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

  it('should have aria-label on toggle button', () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('aria-label')).toBe('Show password');
  });

  it('should update aria-label when toggled', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('aria-label')).toBe('Show password');

    await button.trigger('click');
    expect(button.attributes('aria-label')).toBe('Hide password');

    await button.trigger('click');
    expect(button.attributes('aria-label')).toBe('Show password');
  });

  it('should have data-id on toggle button', () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.find('[data-id=toggle-visibility]').exists()).toBeTruthy();
  });

  it('should disable toggle button when disabled', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        modelValue: '',
      },
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should render input with password type by default', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'secret',
      },
    });

    expect(wrapper.find('input').attributes('type')).toBe('password');
  });

  it('should pass variant prop to text field', () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
        variant: 'outlined',
      },
    });

    expect(wrapper.find('fieldset').exists()).toBeTruthy();
  });
});
