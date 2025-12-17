import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiRadio from '@/components/forms/radio-button/radio/RuiRadio.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(options?: ComponentMountingOptions<typeof RuiRadio>) {
  return mount(RuiRadio, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/forms/radio-button/radio/RuiRadio.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Radio Label';
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expectWrapperToHaveClass(wrapper, 'label > div', /_radio_/);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
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
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-checkbox-blank-circle',
    );

    await wrapper.setProps({ modelValue: 'value' });
    expect(wrapper.find('rui-icon-stub').attributes('name')).toBe(
      'lu-radio-button-fill',
    );
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: { color: 'primary', value: 'value' },
    });
    expectWrapperToHaveClass(wrapper, 'label > div', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label > div', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label > div', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label > div', /_success_/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper({ props: { size: 'sm', value: 'value' } });
    expectWrapperToHaveClass(wrapper, 'label > div', /_sm_/);

    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'label > div', /_lg_/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Radio Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-text-secondary/);
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Radio Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('should pass hideDetails', () => {
    wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
        value: 'value',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Radio Label';
    wrapper = createWrapper({
      props: {
        label,
        value: 'value',
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
