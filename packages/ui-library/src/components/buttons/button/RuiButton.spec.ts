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
    expect(wrapper.find('button').exists()).toBeTruthy();
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
    expect(wrapper.find('[data-spinner]').exists()).toBeFalsy();

    await wrapper.setProps({ loading: true });
    expect(wrapper.find('[data-spinner]').exists()).toBeTruthy();

    await wrapper.setProps({ loading: false });
    expect(wrapper.find('[data-spinner]').exists()).toBeFalsy();
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-primary/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-secondary/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-error/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-success/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('data-variant')).toBe('default');

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.attributes('data-variant')).toBe('outlined');

    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.attributes('data-variant')).toBe('text');

    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.attributes('data-variant')).toBe('fab');
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
  });

  it('should pass rounded props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ rounded: true });
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ rounded: false });
    // Default rounded (not rounded-full) should apply
    expectWrapperToHaveClass(wrapper, 'button', /rounded/);
  });

  it('should pass icon props', async () => {
    wrapper = createWrapper();
    await wrapper.setProps({ icon: true });
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ icon: false });
    expectWrapperNotToHaveClass(wrapper, 'button', /rounded-full/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper();
    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'button', /py-1/);
    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'button', /text-base/);
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
