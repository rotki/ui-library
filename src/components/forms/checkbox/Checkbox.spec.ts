import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Checkbox>) =>
  mount(Checkbox, { ...options, global: { stubs: ['icon'] } });

describe('Forms/Checkbox', () => {
  it('renders properly', () => {
    const label = 'Checkbox Label';
    const wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.get('label > span').classes()).toMatch(/_checkbox_/);
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
      'checkbox-blank-line',
    );
    await wrapper.setProps({ modelValue: true, indeterminate: false });
    expect(wrapper.find('icon-stub').attributes('name')).toBe('checkbox-fill');
    await wrapper.setProps({ modelValue: false, indeterminate: true });
    expect(wrapper.find('icon-stub').attributes('name')).toBe(
      'checkbox-indeterminate-fill',
    );
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({ props: { color: 'primary' } });
    expect(wrapper.find('label > span').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('label > span').classes()).toMatch(/_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('label > span').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('label > span').classes()).toMatch(/_success_/);
  });

  it('passes size props', async () => {
    const wrapper = createWrapper({ props: { size: 'sm' } });
    expect(wrapper.find('label > span').classes()).toMatch(/_sm_/);

    await wrapper.setProps({ sm: false, size: 'lg' });
    expect(wrapper.find('label > span').classes()).toMatch(/_lg_/);
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Checkbox Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details > div').classes()).toMatch(
      /text-rui-text-secondary/,
    );
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Checkbox Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details > div').classes()).toMatch(/text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('passes hideDetails', async () => {
    const wrapper = createWrapper({
      props: {
        hint: 'This hint should not be rendered',
        hideDetails: true,
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });
});
