import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Button from '@/components/buttons/button/Button.vue';
import ButtonGroup from './ButtonGroup.vue';

const createWrapper = (
  options?: ComponentMountingOptions<typeof ButtonGroup>,
) =>
  mount(ButtonGroup, {
    ...options,
    slots: {
      default: [h(Button), h(Button)],
    },
  });

describe('Button/ButtonGroup', () => {
  it('passes vertical props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toMatch(
      /vertical/,
    );
    await wrapper.setProps({ vertical: true });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/vertical/);
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_primary_/);
    expect(wrapper.find('button').classes()).toMatch(/_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(
      /_secondary_/,
    );
    expect(wrapper.find('button').classes()).toMatch(/_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_error_/);
    expect(wrapper.find('button').classes()).toMatch(/_error_/);

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_success_/);
    expect(wrapper.find('button').classes()).toMatch(/_success_/);
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toMatch(
      /_outlined_/,
    );
    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_outlined_/);
    expect(wrapper.find('button').classes()).toMatch(/_outlined_/);
    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/_text_/);
    expect(wrapper.find('button').classes()).toMatch(/_text_/);
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
});
