import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Button from './Button.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Button>) =>
  mount(Button, options);

describe('Button/Button', () => {
  it('renders properly', () => {
    const label = 'Primary Button';
    const wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.classes()).toMatch(/_btn_/);
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.find('button').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('button').classes()).toMatch(/_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('button').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('button').classes()).toMatch(/_success_/);
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toMatch(/_outlined_/);
    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('button').classes()).toMatch(/_outlined_/);
    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.find('button').classes()).toMatch(/_text_/);
    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.find('button').classes()).toMatch(/_fab_/);
  });

  it('passes rounded props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toMatch(/_rounded_/);
    await wrapper.setProps({ rounded: true });
    expect(wrapper.find('button').classes()).toMatch(/_rounded_/);
    await wrapper.setProps({ rounded: false });
    expect(wrapper.find('button').classes()).not.toMatch(/_rounded_/);
  });

  it('passes icon props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toMatch(/_icon_/);
    await wrapper.setProps({ icon: true });
    expect(wrapper.find('button').classes()).toMatch(/_icon_/);
    await wrapper.setProps({ icon: false });
    expect(wrapper.find('button').classes()).not.toMatch(/_icon_/);
  });

  it('passes size props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toMatch(/_sm_/);
    expect(wrapper.find('button').classes()).not.toMatch(/_lg_/);
    await wrapper.setProps({ size: 'sm' });
    expect(wrapper.find('button').classes()).toMatch(/_sm_/);
    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toMatch(/_lg_/);
  });

  it('passes elevation props and set to correct classes based on the state', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).toMatch(/shadow-0/);
    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.find('button').classes()).toMatch(/shadow-6/);
    await wrapper.setProps({ elevation: 10 });
    expect(wrapper.find('button').classes()).toMatch(/shadow-10/);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').classes()).toMatch(/shadow-0/);
  });
});
