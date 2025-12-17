import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSwitch from '@/components/forms/switch/RuiSwitch.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiSwitch>,
): VueWrapper<InstanceType<typeof RuiSwitch>> {
  return mount(RuiSwitch, { ...options });
}

describe('components/forms/switch/RuiSwitch.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiSwitch>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Switch Label';
    wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expectWrapperToHaveClass(wrapper, 'label > div > div', /_toggle_/);
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

  it('should pass color props', async () => {
    wrapper = createWrapper({ props: { color: 'primary' } });
    expectWrapperToHaveClass(wrapper, 'label', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label', /_success_/);
  });

  it('should pass size props', () => {
    wrapper = createWrapper({ props: { size: 'sm' } });
    expectWrapperToHaveClass(wrapper, 'label', /_sm_/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Switch Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-text-secondary/);
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Switch Error Message';
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

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Switch Label';
    wrapper = createWrapper({
      props: {
        label,
      },
    });

    // Required asterisk should not be present by default
    expect(wrapper.text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.text()).toContain('﹡');
    expect(wrapper.find('.text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.text()).not.toContain('﹡');
  });
});
