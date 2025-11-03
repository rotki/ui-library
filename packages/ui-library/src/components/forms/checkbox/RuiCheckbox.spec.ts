import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiCheckbox>,
): VueWrapper<InstanceType<typeof RuiCheckbox>> {
  return mount(RuiCheckbox, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/forms/checkbox/RuiCheckbox.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiCheckbox>>;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render properly', () => {
    const label = 'Checkbox Label';
    wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expectWrapperToHaveClass(wrapper, 'label > span', /_checkbox_/);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /_disabled_/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expectWrapperToHaveClass(wrapper, 'label', /_disabled_/);
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /_disabled_/);
  });

  it('should render icon correctly', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-checkbox-blank',
    );
    await wrapper.setProps({ indeterminate: false, modelValue: true });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe('lu-checkbox-fill');
    await wrapper.setProps({ indeterminate: true, modelValue: false });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-checkbox-indeterminate-fill',
    );
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({ props: { color: 'primary' } });
    expectWrapperToHaveClass(wrapper, 'label > span', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label > span', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label > span', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label > span', /_success_/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper({ props: { size: 'sm' } });
    expectWrapperToHaveClass(wrapper, 'label > span', /_sm_/);

    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'label > span', /_lg_/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Checkbox Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-text-secondary/);
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Checkbox Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('should pass hideDetails', () => {
    wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });
});
