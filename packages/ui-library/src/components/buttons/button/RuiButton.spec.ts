import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiButton>,
) {
  return mount(RuiButton, options);
}

describe('components/buttons/button/RuiButton.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Primary Button';
    wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expectWrapperToHaveClass(wrapper, 'button', /_btn_/);
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('should pass loading props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /_loading_/);
    expect(wrapper.find('div[class*=spinner]').exists()).toBeFalsy();

    await wrapper.setProps({ loading: true });
    expectWrapperToHaveClass(wrapper, 'button', /_loading_/);
    expect(wrapper.find('div[class*=spinner]').exists()).toBeTruthy();

    await wrapper.setProps({ loading: false });
    expectWrapperNotToHaveClass(wrapper, 'button', /_loading_/);
    expect(wrapper.find('div[class*=spinner]').exists()).toBeFalsy();
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectWrapperToHaveClass(wrapper, 'button', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'button', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'button', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'button', /_success_/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /_outlined_/);
    await wrapper.setProps({ variant: 'outlined' });
    expectWrapperToHaveClass(wrapper, 'button', /_outlined_/);
    await wrapper.setProps({ variant: 'text' });
    expectWrapperToHaveClass(wrapper, 'button', /_text_/);
    await wrapper.setProps({ variant: 'fab' });
    expectWrapperToHaveClass(wrapper, 'button', /_fab_/);
  });

  it('should pass rounded props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /_rounded_/);
    await wrapper.setProps({ rounded: true });
    expectWrapperToHaveClass(wrapper, 'button', /_rounded_/);
    await wrapper.setProps({ rounded: false });
    expectWrapperNotToHaveClass(wrapper, 'button', /_rounded_/);
  });

  it('should pass icon props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /_icon_/);
    await wrapper.setProps({ icon: true });
    expectWrapperToHaveClass(wrapper, 'button', /_icon_/);
    await wrapper.setProps({ icon: false });
    expectWrapperNotToHaveClass(wrapper, 'button', /_icon_/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /_sm_/);
    expectWrapperNotToHaveClass(wrapper, 'button', /_lg_/);
    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'button', /_sm_/);
    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'button', /_lg_/);
  });

  it('should pass elevation props and set to correct classes based on the state', async () => {
    wrapper = createWrapper();
    expectWrapperToHaveClass(wrapper, 'button', /shadow-0/);
    await wrapper.setProps({ variant: 'fab' });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-6/);
    await wrapper.setProps({ elevation: 10 });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-10/);
    await wrapper.setProps({ disabled: true });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-0/);
  });
});
