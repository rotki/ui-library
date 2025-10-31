import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiRevealableTextField from '@/components/forms/revealable-text-field/RuiRevealableTextField.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiRevealableTextField>) {
  return mount(RuiRevealableTextField, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('forms/RevealableTextField', () => {
  it('renders properly', () => {
    const label = 'Password';
    const wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('toggle the type', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.find('input').attributes().type).toBe('password');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe(
      'lu-eye-off',
    );

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('text');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe('lu-eye');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('password');
    expect(wrapper.find('rui-icon-stub').attributes().name).toBe(
      'lu-eye-off',
    );
  });
});
