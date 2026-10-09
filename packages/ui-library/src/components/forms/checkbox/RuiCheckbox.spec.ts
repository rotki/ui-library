import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(options?: ComponentMountingOptions<typeof RuiCheckbox>) {
  return mount(RuiCheckbox, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/forms/checkbox/RuiCheckbox.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

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
    expectWrapperToHaveClass(wrapper, 'label > span', /^text-rui-neutral-500$/);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /cursor-not-allowed/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expectWrapperToHaveClass(wrapper, 'label', /cursor-not-allowed/);
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    expectWrapperNotToHaveClass(wrapper, 'label', /cursor-not-allowed/);
  });

  it('should draw an empty box, a check, or a dash for indeterminate', async () => {
    wrapper = createWrapper();
    const mark = (): ReturnType<typeof wrapper.find> => wrapper.find('[data-mark]');
    expect(mark().attributes('data-state')).toBe('unchecked');
    expect(mark().find('svg').exists()).toBe(false);

    await wrapper.setProps({ indeterminate: false, modelValue: true });
    expect(mark().attributes('data-state')).toBe('checked');
    expect(mark().find('path').attributes('d')).toBe('M2.5 6.2 5 8.6l4.5-5');

    await wrapper.setProps({ indeterminate: true, modelValue: false });
    expect(mark().attributes('data-state')).toBe('indeterminate');
    expect(mark().find('path').attributes('d')).toBe('M3 6h6');
  });

  it('should color the box with the color prop once checked', async () => {
    wrapper = createWrapper({ props: { color: 'primary', modelValue: true } });
    expectWrapperToHaveClass(wrapper, 'label > span', /^text-rui-primary$/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label > span', /^text-rui-secondary$/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label > span', /^text-rui-error$/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label > span', /^text-rui-success$/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper({ props: { size: 'sm' } });
    expectWrapperToHaveClass(wrapper, 'label > span', /^size-9\.5$/);
    expectWrapperToHaveClass(wrapper, '[data-mark]', /^size-3\.5$/);

    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'label > span', /^size-11\.5$/);
    expectWrapperToHaveClass(wrapper, '[data-mark]', /^size-5$/);
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

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Checkbox Label';
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
