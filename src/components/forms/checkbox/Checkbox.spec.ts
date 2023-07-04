import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';

const createWrapper = (props: Record<string, any> = {}) =>
  mount(Checkbox, {
    props,
    slots: {
      default: () => props.label,
    },
    global: {
      stubs: ['icon'],
    },
  });

describe('Forms/Checkbox', () => {
  it('renders properly', () => {
    const label = 'Checkbox Label';
    const wrapper = createWrapper({ label });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.get('label > div').classes()).toMatch(/_checkbox_/);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('label').classes()).not.toMatch(/_disabled_/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.get('label').classes()).toMatch(/_disabled_/);
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('label').classes()).not.toMatch(/_disabled_/);
  });

  it('render icon correctly', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('icon-stub').attributes('name')).toBe(
      'checkbox-blank-line'
    );
    await wrapper.setProps({ modelValue: true, indeterminate: false });
    expect(wrapper.find('icon-stub').attributes('name')).toBe('checkbox-fill');
    await wrapper.setProps({ modelValue: false, indeterminate: true });
    expect(wrapper.find('icon-stub').attributes('name')).toBe(
      'checkbox-indeterminate-fill'
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('label > div').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('label > div').classes()).toMatch(/_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('label > div').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('label > div').classes()).toMatch(/_success_/);
  });

  it('passes size props', async () => {
    const wrapper = createWrapper({ size: 'sm' });
    expect(wrapper.find('label > div').classes()).toMatch(/_sm_/);

    await wrapper.setProps({ sm: false, size: 'lg' });
    expect(wrapper.find('label > div').classes()).toMatch(/_lg_/);
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper({ sm: true });
    expect(wrapper.find('label + div > div').text()).toBe('');

    const hint = 'Checkbox Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('label + div > div').classes()).toMatch(/text-black/);
    expect(wrapper.find('label + div > div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper({ sm: true });
    expect(wrapper.find('label + div > div').text()).toBe('');

    const errorMessage = 'Checkbox Hints';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('label + div > div').classes()).toMatch(
      /text-rui-error/
    );
    expect(wrapper.find('label + div > div').text()).toBe(errorMessage);
  });

  it('passes hideDetails', async () => {
    const wrapper = createWrapper({
      hint: 'This hint should not be rendered',
      hideDetails: true,
    });
    expect(wrapper.find('label + div > div').exists()).toBeFalsy();
  });
});
