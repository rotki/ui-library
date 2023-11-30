import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import TextField from '@/components/forms/text-field/TextField.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof TextField>) =>
  mount(TextField, { ...options, global: { stubs: ['icon'] } });

describe('Forms/TextField', () => {
  it('renders properly', () => {
    const label = 'Text Field Label';
    const wrapper = createWrapper({
      props: {
        label,
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
  });

  it('passes readonly props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input').attributes('readonly')).toBeUndefined();
    await wrapper.setProps({ readonly: true });
    expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    await wrapper.setProps({ readonly: false });
    expect(wrapper.find('input').attributes('readonly')).toBeUndefined();
  });

  it('passes color props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_default_/);

    await wrapper.setProps({ color: 'primary' });
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
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const hint = 'Text Fields Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details div').classes()).toMatch(
      /text-rui-text-secondary/,
    );
    expect(wrapper.find('.details div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const errorMessage = 'Text Fields Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details div').classes()).toMatch(/text-rui-error/);
    expect(wrapper.find('.details div').text()).toBe(errorMessage);
  });

  it('passes hint successMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details div').exists()).toBeFalsy();

    const successMessage = 'Text Fields Error Message';
    await wrapper.setProps({ successMessages: [successMessage] });
    expect(wrapper.find('.details div').classes()).toMatch(/text-rui-success/);
    expect(wrapper.find('.details div').text()).toBe(successMessage);
  });

  it('passes hideDetails', async () => {
    const wrapper = createWrapper({
      props: {
        hint: 'This hint should not be rendered',
        hideDetails: true,
      },
    });
    expect(wrapper.find('.details div').exists()).toBeFalsy();
  });

  it('passes prependIcon', async () => {
    const icon = 'heart-fill';
    const wrapper = createWrapper({
      props: {
        prependIcon: icon,
      },
    });

    expect(
      wrapper.find('div[class*=prepend] icon-stub').attributes('name'),
    ).toBe(icon);
  });

  it('passes appendIcon', async () => {
    const icon = 'heart-fill';
    const wrapper = createWrapper({
      props: {
        appendIcon: icon,
      },
    });

    expect(
      wrapper.find('div[class*=append] icon-stub').attributes('name'),
    ).toBe(icon);
  });

  it('passes prepend slot', async () => {
    const prepend = 'Prepend text';

    const wrapper = createWrapper({
      slots: {
        prepend: () => prepend,
      },
    });

    expect(wrapper.find('div[class*=prepend]').text()).toBe(prepend);
  });

  it('passes append slot', async () => {
    const append = 'Append text';

    const wrapper = createWrapper({
      slots: {
        append: () => append,
      },
    });

    expect(wrapper.find('div[class*=append]').text()).toBe(append);
  });
});
