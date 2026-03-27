import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiTextArea from '@/components/forms/text-area/RuiTextArea.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTextArea>,
): VueWrapper<InstanceType<typeof RuiTextArea>> {
  const opts: ComponentMountingOptions<typeof RuiTextArea> = {
    props: {
      modelValue: '',
    },
    ...options,
  };
  return mount(RuiTextArea, {
    ...opts,
    global: {
      stubs: { RuiIcon: true },
    },
  });
}

describe('components/forms/text-area/RuiTextArea.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiTextArea>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Text Area Label';
    wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled')).toBeUndefined();
  });

  it('should pass readonly props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly')).toBeUndefined();

    await wrapper.setProps({ readonly: true });
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly')).toBeDefined();

    await wrapper.setProps({ readonly: false });
    expect(wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly')).toBeUndefined();
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
    wrapper = createWrapper();
    // Default variant has pt-4 on inputWrapper
    expectWrapperToHaveClass(wrapper, 'label', /border-b/);

    await wrapper.setProps({ variant: 'filled' });
    expectWrapperToHaveClass(wrapper, 'label', /rounded-t/);

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('fieldset').exists()).toBeTruthy();
  });

  it('should pass dense props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'textarea:not([aria-hidden="true"])', /py-1(?!\.)/);

    await wrapper.setProps({ dense: true });
    expectWrapperToHaveClass(wrapper, 'textarea:not([aria-hidden="true"])', /py-1(?!\.)/);

    await wrapper.setProps({ dense: false });
    expectWrapperNotToHaveClass(wrapper, 'textarea:not([aria-hidden="true"])', /py-1(?!\.)/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Text Areas Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-text-secondary/);
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Text Areas Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details div', /text-rui-error/);
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('should pass hint successMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Text Areas Success Message';
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
      slots: {
        prepend,
      },
    });

    expect(wrapper.find('[data-id=prepend]').text()).toBe(prepend);
  });

  it('should pass append slot', () => {
    const append = 'Append text';

    wrapper = createWrapper({
      slots: {
        append,
      },
    });

    expect(wrapper.find('[data-id=append]').text()).toBe(append);
  });

  it('should pass value', () => {
    const text = 'test text';

    wrapper = createWrapper({
      props: {
        modelValue: text,
      },
    });

    expect(wrapper.find<HTMLTextAreaElement>('textarea:not([aria-hidden="true"])').element.value).toBe(text);
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

    expect(wrapper.find('textarea').element.value).toBe(text);
    await wrapper.find('[data-id=clear-btn]').trigger('click');
    expect(wrapper.find('textarea').element.value).toBe('');
    await nextTick();

    // Clear button not rendered if value is empty
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();

    // Clear button not rendered if the textarea is disabled
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();

    // Clear button not rendered if the textarea is readonly
    await wrapper.setProps({ disabled: false, readonly: true });
    expect(wrapper.find('[data-id=clear-btn]').exists()).toBeFalsy();
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'Text Area Label';
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
