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
    expectWrapperToHaveClass(wrapper, 'label > div', /^text-rui-neutral-500$/);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /cursor-not-allowed/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expectWrapperToHaveClass(wrapper, 'label', /cursor-not-allowed/);
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /cursor-not-allowed/);
  });

  it('should draw an empty ring, and a dot once selected', async () => {
    wrapper = createWrapper({
      props: {
        value: 'value',
      },
    });
    const mark = (): ReturnType<typeof wrapper.find> => wrapper.find('[data-mark]');
    expect(mark().attributes('data-state')).toBe('unchecked');
    expect(mark().find('span').exists()).toBe(false);

    await wrapper.setProps({ modelValue: 'value' });
    expect(mark().attributes('data-state')).toBe('checked');
    expect(mark().find('span').exists()).toBe(true);
  });

  it('should color the radio with the color prop once selected', async () => {
    wrapper = createWrapper({
      props: { color: 'primary', modelValue: 'value', value: 'value' },
    });
    expectWrapperToHaveClass(wrapper, 'label > div', /^text-rui-primary$/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label > div', /^text-rui-secondary$/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label > div', /^text-rui-error$/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label > div', /^text-rui-success$/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper({ props: { size: 'sm', value: 'value' } });
    expectWrapperToHaveClass(wrapper, 'label > div', /^size-9\.5$/);
    expectWrapperToHaveClass(wrapper, '[data-mark]', /^size-3\.5$/);

    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'label > div', /^size-11\.5$/);
    expectWrapperToHaveClass(wrapper, '[data-mark]', /^size-5$/);
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
