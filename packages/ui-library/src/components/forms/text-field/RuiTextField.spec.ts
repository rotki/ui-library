import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';
import RuiFieldDefaults from '@/components/forms/field-defaults/RuiFieldDefaults.vue';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import { FieldSymbol } from '@/composables/defaults/field';
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

  it('should put the label above a bordered field and link it to the input', () => {
    wrapper = createWrapper({
      props: {
        label: 'Amount',
        modelValue: '',
      },
    });
    const label = wrapper.find('[data-id=field-label]');
    const input = wrapper.find('input');
    expect(label.text()).toBe('Amount');
    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(label.classes()).not.toContain('sr-only');
    expect(wrapper.find('fieldset').exists()).toBe(true);
    expect(wrapper.findAll('label')).toHaveLength(1);
    expectWrapperToHaveClass(wrapper, 'input', /^py-1\.5$/);
  });

  it('should keep a consumer id on the input for the label to point at', () => {
    wrapper = createWrapper({
      attrs: { id: 'amount' },
      props: {
        label: 'Amount',
        modelValue: '',
      },
    });
    expect(wrapper.find('input').attributes('id')).toBe('amount');
    expect(wrapper.find('[data-id=field-label]').attributes('for')).toBe('amount');
  });

  it('should keep a hidden label for screen readers only, and show the placeholder', () => {
    wrapper = createWrapper({
      props: {
        label: 'Search',
        labelPlacement: 'hidden',
        modelValue: '',
        placeholder: 'Search assets',
      },
    });
    expect(wrapper.find('[data-id=field-label]').classes()).toContain('sr-only');
    expectWrapperToHaveClass(wrapper, 'input', /^placeholder:opacity-100$/);
  });

  it('should draw the bordered field whatever the variant unless the label floats', async () => {
    wrapper = createWrapper({
      props: {
        label: 'Field',
        modelValue: '',
        variant: 'filled',
      },
    });
    expect(wrapper.find('fieldset').exists()).toBe(true);

    await wrapper.setProps({ labelPlacement: 'floating' });
    expect(wrapper.find('fieldset').exists()).toBe(false);
    expect(wrapper.find('[data-id=field-label]').exists()).toBe(false);
  });

  it('should take the placement from the nearest RuiFieldDefaults, then the app default', () => {
    const app = { labelPlacement: 'floating' as const };
    wrapper = mount(RuiTextField, {
      props: { label: 'Field', modelValue: '' },
      global: { stubs: ['rui-icon'], provide: { [FieldSymbol]: app } },
    });
    expect(wrapper.find('[data-id=field-label]').exists()).toBe(false);
    wrapper.unmount();

    const scoped = mount(RuiFieldDefaults, {
      props: { labelPlacement: 'hidden' },
      slots: { default: () => h(RuiTextField, { label: 'Field', modelValue: '' }) },
      global: { stubs: ['rui-icon'], provide: { [FieldSymbol]: app } },
    });
    expect(scoped.find('[data-id=field-label]').classes()).toContain('sr-only');
    scoped.unmount();

    wrapper = mount(RuiTextField, {
      props: { label: 'Field', labelPlacement: 'top', modelValue: '' },
      global: { stubs: ['rui-icon'], provide: { [FieldSymbol]: app } },
    });
    expect(wrapper.find('[data-id=field-label]').classes()).not.toContain('sr-only');
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
        labelPlacement: 'floating',
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
        label: 'Field',
        labelPlacement: 'floating',
        modelValue: '',
      },
    });
    // Default variant reserves pt-3 on the wrapper for the floating label.
    expectWrapperToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);

    await wrapper.setProps({ variant: 'filled' });
    expectWrapperNotToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);
    expectWrapperToHaveClass(wrapper, 'label', /rounded-t/);

    await wrapper.setProps({ variant: 'outlined' });
    expectWrapperNotToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);
    expect(wrapper.find('fieldset').exists()).toBeTruthy();
  });

  it('should drop the floating-label reserve when used without a label, matching a RuiMenuSelect activator', async () => {
    wrapper = createWrapper({
      props: {
        labelPlacement: 'floating',
        modelValue: '',
      },
    });
    expectWrapperToHaveClass(wrapper, '[data-id=wrapper]', /!pt-0/);

    // 40px, the height of a non-dense activator
    expectWrapperToHaveClass(wrapper, 'input', /py-2/);

    // 32px, the height of a dense one
    await wrapper.setProps({ dense: true });
    expectWrapperToHaveClass(wrapper, 'input', /py-1(?!\.)/);
    expectWrapperToHaveClass(wrapper, '[data-id=wrapper]', /!pt-0/);

    // A label brings the reserve back, since the override only applies without one
    await wrapper.setProps({ label: 'Labelled', dense: false });
    expectWrapperNotToHaveClass(wrapper, '[data-id=wrapper]', /!pt-0/);
    expectWrapperToHaveClass(wrapper, '[data-id=wrapper]', /pt-3/);
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
