import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTextField>,
): VueWrapper<InstanceType<typeof RuiTextField>> {
  return mount(RuiTextField, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/forms/text-field/RuiTextField.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiTextField>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Text Field Label';
    wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
  });

  it('should pass readonly props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('input').attributes('readonly')).toBeUndefined();
    await wrapper.setProps({ readonly: true });
    expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    await wrapper.setProps({ readonly: false });
    expect(wrapper.find('input').attributes('readonly')).toBeUndefined();
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    // Default color is primary (from defaultVariants)
    expectWrapperToHaveClass(wrapper, 'label', /after:border-rui-primary/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'label', /after:border-rui-secondary/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'label', /after:border-rui-error/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'label', /after:border-rui-success/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    // Default variant has pt-3 on wrapper
    expectWrapperToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);

    await wrapper.setProps({ variant: 'filled' });
    expectWrapperNotToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);
    expectWrapperToHaveClass(wrapper, 'label', /rounded-t/);

    await wrapper.setProps({ variant: 'outlined' });
    expectWrapperNotToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);
    expect(wrapper.find('fieldset').exists()).toBeTruthy();
  });

  it('should pass dense props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expectWrapperNotToHaveClass(wrapper, 'input', /py-1(?!\.)/);

    await wrapper.setProps({ dense: true });
    expectWrapperToHaveClass(wrapper, 'input', /py-1(?!\.)/);

    await wrapper.setProps({ dense: false });
    expectWrapperNotToHaveClass(wrapper, 'input', /py-1(?!\.)/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Text Fields Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-text-secondary/);
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Text Fields Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-error/);
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('should pass hint successMessages', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Text Fields Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-success/);
    expect(wrapper.find('.details div').text()).toBe(successMessage);
  });

  it('should pass hideDetails', () => {
    wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();
  });

  it('should pass prependIcon', () => {
    const icon = 'heart-fill';
    wrapper = createWrapper({
      props: {
        modelValue: '',
        prependIcon: icon,
      },
    });

    expect(wrapper.find('[data-id=prepend] rui-icon-stub').attributes('name')).toBe(icon);
  });

  it('should pass appendIcon', () => {
    const icon = 'heart-fill';
    wrapper = createWrapper({
      props: {
        appendIcon: icon,
        modelValue: '',
      },
    });

    expect(wrapper.find('[data-id=append] rui-icon-stub').attributes('name')).toBe(icon);
  });

  it('should pass prepend slot', () => {
    const prepend = 'Prepend text';

    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
      slots: {
        prepend: () => prepend,
      },
    });

    expect(wrapper.find('[data-id=prepend]').text()).toBe(prepend);
  });

  it('should pass append slot', () => {
    const append = 'Append text';

    wrapper = createWrapper({
      props: {
        modelValue: '',
      },
      slots: {
        append: () => append,
      },
    });

    expect(wrapper.find('[data-id=append]').text()).toBe(append);
  });

  it('should clearable', async () => {
    const text = 'test text';
    wrapper = createWrapper({
      props: {
        clearable: true,
        modelValue: text,
      },
    });

    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeTruthy();

    expect(wrapper.find('input').element.value).toBe(text);
    await wrapper.find('[data-id=clear-btn]').trigger('click');
    expect(wrapper.find('input').element.value).toBe('');
    await nextTick();

    // Clear button not rendered if value is empty
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();

    // Clear button not rendered if the text field is disabled
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();

    // Clear button not rendered if the text field is readonly
    await wrapper.setProps({ disabled: false, readonly: true });
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Text Field Label';
    wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });

    // Required asterisk should not be present by default
    expect(wrapper.find('label').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('label').text()).toContain('﹡');

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('label').text()).not.toContain('﹡');
  });
});
