import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSlider from '@/components/forms/slider/RuiSlider.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiSlider>,
): VueWrapper<InstanceType<typeof RuiSlider>> {
  return mount(RuiSlider, { ...options });
}

describe('components/forms/slider/RuiSlider.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiSlider>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Slider label';
    wrapper = createWrapper({
      props: {
        label,
        max: 100,
        min: 20,
        modelValue: 40,
        showTicks: true,
        step: 10,
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
    expect(wrapper.find('input').attributes('min')).toBe('20');
    expect(wrapper.find('input').attributes('max')).toBe('100');
    expect(wrapper.find('input').attributes('step')).toBe('10');
    expect(wrapper.find('input').element.value).toBe('40');
    expect(wrapper.findAll('div[class*=slider__ticks] span')).toHaveLength(9);
    expect(wrapper.findAll('div[class*=slider__ticks] span[class*=highlighted]')).toHaveLength(3);
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

  it('should pass vertical props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'label', /_vertical_/);
    await wrapper.setProps({ vertical: true });
    expectWrapperToHaveClass(wrapper, 'label', /_vertical_/);
    await wrapper.setProps({ vertical: false });
    expectWrapperNotToHaveClass(wrapper, 'label', /_vertical_/);
  });

  it('should pass hideTrack props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'label', /_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeTruthy();
    await wrapper.setProps({ hideTrack: true });
    expectWrapperToHaveClass(wrapper, 'label', /_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeFalsy();
    await wrapper.setProps({ hideTrack: false });
    expectWrapperNotToHaveClass(wrapper, 'label', /_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeTruthy();
  });

  it('should pass showThumbLabel props', async () => {
    const modelValue = 50;
    wrapper = createWrapper({
      props: {
        modelValue,
      },
    });
    expect(wrapper.find('div[class*=slider__thumb_label]').exists()).toBeFalsy();
    await wrapper.setProps({ showThumbLabel: true });
    expect(wrapper.find('div[class*=slider__thumb_label]').exists()).toBeTruthy();
    expect(wrapper.find('div[class*=slider__thumb_label]').text()).toContain(modelValue);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('div[class*=slider__thumb_label]').exists()).toBeFalsy();
  });

  it('should pass showTicks props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeFalsy();
    await wrapper.setProps({ showTicks: true });
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeTruthy();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeFalsy();
  });

  it('should pass tickSize props', async () => {
    wrapper = createWrapper({
      props: {
        showTicks: true,
      },
    });
    expectWrapperNotToHaveClass(wrapper, 'label', /_big-tick/);
    await wrapper.setProps({ tickSize: 12 });
    expectWrapperToHaveClass(wrapper, 'label', /_big-tick/);
    await wrapper.setProps({ tickSize: 1 });
    expectWrapperNotToHaveClass(wrapper, 'label', /_big-tick/);
  });

  it('should pass color props', async () => {
    wrapper = createWrapper();
    expectWrapperToHaveClass(wrapper, 'label', /_primary_/);

    await wrapper.setProps({ color: 'primary' });
    expectWrapperToHaveClass(wrapper, 'label', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label', /_success_/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Slider Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-text-secondary/);
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Slider Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-error/);
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('should pass hint successMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Slider Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-success/);
    expect(wrapper.find('.details div').text()).toBe(successMessage);
  });

  it('should pass hideDetails', () => {
    wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();
  });

  it('should have aria-label on input when label is provided', () => {
    wrapper = createWrapper({
      props: {
        label: 'Volume',
        modelValue: 50,
      },
    });

    expect(wrapper.find('input').attributes('aria-label')).toBe('Volume');
  });

  it('should not have aria-label on input when label is empty', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 50,
      },
    });

    expect(wrapper.find('input').attributes('aria-label')).toBeUndefined();
  });

  it('should have aria-valuetext on input reflecting current value', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 30,
      },
    });

    expect(wrapper.find('input').attributes('aria-valuetext')).toBe('30');

    await wrapper.setProps({ modelValue: 75 });
    expect(wrapper.find('input').attributes('aria-valuetext')).toBe('75');
  });

  it('should emit update:model-value when input value changes', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 50,
      },
    });

    await wrapper.find('input').setValue(75);
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0]).toEqual(['75']);
  });

  it('should have aria-invalid when errorMessages are provided', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 50,
      },
    });

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');

    await wrapper.setProps({ errorMessages: ['Error'] });
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');

    await wrapper.setProps({ errorMessages: [] });
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');
  });

  it('should not render required asterisk when required is true but no label', () => {
    wrapper = createWrapper({
      props: {
        required: true,
      },
    });

    expect(wrapper.text()).not.toContain('﹡');
  });

  it('should have data-error attribute when errorMessages present', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 50,
      },
    });

    expect(wrapper.find('label').attributes('data-error')).toBeUndefined();

    await wrapper.setProps({ errorMessages: ['Error'] });
    expect(wrapper.find('label').attributes('data-error')).toBe('');

    await wrapper.setProps({ errorMessages: [] });
    expect(wrapper.find('label').attributes('data-error')).toBeUndefined();
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Slider Label';
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
