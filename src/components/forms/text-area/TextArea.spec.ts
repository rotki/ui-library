import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TextArea from '@/components/forms/text-area/TextArea.vue';

function createWrapper(options?: any) {
  return mount(TextArea, {
    ...options,
    global: {
      stubs: { RuiIcon: true },
    },
  });
}

describe('forms/TextArea', () => {
  it('renders properly', () => {
    const label = 'Text Area Label';
    const wrapper = createWrapper({
      propsData: {
        label,
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled'),
    ).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled'),
    ).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('disabled'),
    ).toBeUndefined();
  });

  it('passes readonly props', async () => {
    const wrapper = createWrapper();
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly'),
    ).toBeUndefined();

    await wrapper.setProps({ readonly: true });
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly'),
    ).toBeDefined();

    await wrapper.setProps({ readonly: false });
    expect(
      wrapper.find('textarea:not([aria-hidden="true"])').attributes('readonly'),
    ).toBeUndefined();
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      propsData: {
        color: 'primary',
      },
    });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(
      /_secondary_/,
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_success_/);
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_default_/);

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_filled_/);

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_outlined_/);
  });

  it('passes dense props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toMatch(
      /_dense_/,
    );

    await wrapper.setProps({ dense: true });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_dense_/);

    await wrapper.setProps({ dense: false });
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toMatch(
      /_dense_/,
    );
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'Text Areas Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details > div').classes()).toMatch(
      /text-rui-text-secondary/,
    );
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'Text Areas Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details > div').classes()).toMatch(/text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('passes hint successMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const successMessage = 'Text Areas Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expect(wrapper.find('.details > div').classes()).toMatch(
      /text-rui-success/,
    );
    expect(wrapper.find('.details > div').text()).toBe(successMessage);
  });

  it('passes hideDetails', () => {
    const wrapper = createWrapper({
      propsData: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });

  it('passes prependIcon', () => {
    const icon = 'heart-fill';
    const wrapper = createWrapper({
      propsData: {
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
      propsData: {
        appendIcon: icon,
      },
    });

    expect(
      wrapper.find('div[class*=append] rui-icon-stub').attributes('name'),
    ).toBe(icon);
  });

  it('passes prepend slot', () => {
    const prepend = 'Prepend text';

    const wrapper = createWrapper({
      slots: {
        prepend,
      },
    });

    expect(wrapper.find('div[class*=prepend]').text()).toBe(prepend);
  });

  it('passes append slot', () => {
    const append = 'Append text';

    const wrapper = createWrapper({
      slots: {
        append,
      },
    });

    expect(wrapper.find('div[class*=append]').text()).toBe(append);
  });
});
