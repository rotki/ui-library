import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Slider from '@/components/forms/slider/Slider.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Slider>) {
  return mount(Slider, { ...options });
}

describe('forms/Slider', () => {
  it('renders properly', () => {
    const label = 'Slider label';
    const wrapper = createWrapper({
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

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('label').classes()).not.toMatch(/_disabled_/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('label').classes()).toMatch(/_disabled_/);
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('label').classes()).not.toMatch(/_disabled_/);
  });

  it('passes vertical props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('label').classes()).not.toMatch(/_vertical_/);
    await wrapper.setProps({ vertical: true });
    expect(wrapper.find('label').classes()).toMatch(/_vertical_/);
    await wrapper.setProps({ vertical: false });
    expect(wrapper.find('label').classes()).not.toMatch(/_vertical_/);
  });

  it('passes hideTrack props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('label').classes()).not.toMatch(/_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeTruthy();
    await wrapper.setProps({ hideTrack: true });
    expect(wrapper.find('label').classes()).toMatch(/_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeFalsy();
    await wrapper.setProps({ hideTrack: false });
    expect(wrapper.find('label').classes()).not.toMatch(/_hide-track_/);
    expect(wrapper.find('div[class*=slider__container__track]').exists()).toBeTruthy();
  });

  it('passes showThumbLabel props', async () => {
    const modelValue = 50;
    const wrapper = createWrapper({
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

  it('passes showTicks props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeFalsy();
    await wrapper.setProps({ showTicks: true });
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeTruthy();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('div[class*=slider__ticks]').exists()).toBeFalsy();
  });

  it('passes tickSize props', async () => {
    const wrapper = createWrapper({
      propsData: {
        showTicks: true,
      },
    });
    expect(wrapper.find('label').classes()).not.toMatch(/_big-tick/);
    await wrapper.setProps({ tickSize: 12 });
    expect(wrapper.find('label').classes()).toMatch(/_big-tick/);
    await wrapper.setProps({ tickSize: 1 });
    expect(wrapper.find('label').classes()).not.toMatch(/_big-tick/);
  });

  it('passes color props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('label').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.find('label').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('label').classes()).toMatch(
      /_secondary_/,
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('label').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('label').classes()).toMatch(/_success_/);
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Slider Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details div').classes()).toMatch(
      /text-rui-text-secondary/,
    );
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Slider Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details div').classes()).toMatch(/text-rui-error/);
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('passes hint successMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Slider Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expect(wrapper.find('.details div').classes()).toMatch(/text-rui-success/);
    expect(wrapper.find('.details div').text()).toBe(successMessage);
  });

  it('passes hideDetails', () => {
    const wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();
  });
});
