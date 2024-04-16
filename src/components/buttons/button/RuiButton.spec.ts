import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiButton>) {
  return mount(RuiButton, options);
}

describe('button/Button', () => {
  it('renders properly', () => {
    const label = 'Primary Button';
    const wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_btn_/)]),
    );
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('passes disabled props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('passes loading props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_loading_/)]),
    );
    expect(wrapper.find('div[class*=spinner]').exists()).toBeFalsy();

    await wrapper.setProps({ loading: true });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_loading_/)]),
    );
    expect(wrapper.find('div[class*=spinner]').exists()).toBeTruthy();

    await wrapper.setProps({ loading: false });
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_loading_/)]),
    );
    expect(wrapper.find('div[class*=spinner]').exists()).toBeFalsy();
  });

  it('passes color props', async () => {
    const wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_secondary_/)]),
    );

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_error_/)]),
    );

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_success_/)]),
    );
  });

  it('passes variant props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_outlined_/)]),
    );
    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_text_/)]),
    );
    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_fab_/)]),
    );
  });

  it('passes rounded props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded_/)]),
    );
    await wrapper.setProps({ rounded: true });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded_/)]),
    );
    await wrapper.setProps({ rounded: false });
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded_/)]),
    );
  });

  it('passes icon props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_icon_/)]),
    );
    await wrapper.setProps({ icon: true });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_icon_/)]),
    );
    await wrapper.setProps({ icon: false });
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_icon_/)]),
    );
  });

  it('passes size props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_sm_/)]),
    );
    expect(wrapper.find('button').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_lg_/)]),
    );
    await wrapper.setProps({ size: 'sm' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_sm_/)]),
    );
    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_lg_/)]),
    );
  });

  it('passes elevation props and set to correct classes based on the state', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/shadow-0/)]),
    );
    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/shadow-6/)]),
    );
    await wrapper.setProps({ elevation: 10 });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/shadow-10/)]),
    );
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/shadow-0/)]),
    );
  });
});
