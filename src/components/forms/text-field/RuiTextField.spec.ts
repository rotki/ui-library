import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiTextField>) {
  return mount(RuiTextField, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('forms/TextField', () => {
  it('renders properly', () => {
    const label = 'Text Field Label';
    const wrapper = createWrapper({
      props: {
        label,
        modelValue: '',
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper({
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

  it('passes readonly props', async () => {
    const wrapper = createWrapper({
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

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );

    await wrapper.setProps({ variant: undefined });
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );
  });

  it('passes dense props', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_dense_/)]),
    );

    await wrapper.setProps({ dense: true });
    expect(wrapper.find('div[class*=wrapper]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_dense_/)]),
    );

    await wrapper.setProps({ dense: false });
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_dense_/)]),
    );
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Text Fields Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/text-rui-text-secondary/)]),
    );
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Text Fields Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/text-rui-error/)]),
    );
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('passes hint successMessages', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Text Fields Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expect(wrapper.find('.details div').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/text-rui-success/)]),
    );
    expect(wrapper.find('.details div').text()).toBe(successMessage);
  });

  it('passes hideDetails', () => {
    const wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
        modelValue: '',
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();
  });

  it('passes prependIcon', () => {
    const icon = 'heart-fill';
    const wrapper = createWrapper({
      props: {
        modelValue: '',
        prependIcon: icon,
      },
    });

    expect(
      wrapper.find('div[class*=prepend] rui-icon-stub').attributes('name'),
    ).toBe(icon);
  });

  it('passes appendIcon', () => {
    const icon = 'heart-fill';
    const wrapper = createWrapper({
      props: {
        appendIcon: icon,
        modelValue: '',
      },
    });

    expect(
      wrapper.find('div[class*=append] rui-icon-stub').attributes('name'),
    ).toBe(icon);
  });

  it('passes prepend slot', () => {
    const prepend = 'Prepend text';

    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
      slots: {
        prepend: () => prepend,
      },
    });

    expect(wrapper.find('div[class*=prepend]').text()).toBe(prepend);
  });

  it('passes append slot', () => {
    const append = 'Append text';

    const wrapper = createWrapper({
      props: {
        modelValue: '',
      },
      slots: {
        append: () => append,
      },
    });

    expect(wrapper.find('div[class*=append]').text()).toBe(append);
  });

  it('clearable', async () => {
    const text = 'test text';
    const wrapper = createWrapper({
      props: {
        clearable: true,
        modelValue: text,
      },
    });

    expect(wrapper.find('.clear-btn').exists()).toBeTruthy();

    expect(wrapper.find('input').element.value).toBe(text);
    await wrapper.find('.clear-btn').trigger('click');
    expect(wrapper.find('input').element.value).toBe('');
    await nextTick();

    // Clear button not rendered if value is empty
    expect(wrapper.find('.clear-btn').exists()).toBeFalsy();

    // Clear button not rendered if the text field is disabled
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('.clear-btn').exists()).toBeFalsy();

    // Clear button not rendered if the text field is readonly
    await wrapper.setProps({ disabled: false, readonly: true });
    expect(wrapper.find('.clear-btn').exists()).toBeFalsy();
  });
});
