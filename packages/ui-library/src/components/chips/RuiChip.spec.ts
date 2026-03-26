import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiChip from '@/components/chips/RuiChip.vue';
import { expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(options?: ComponentMountingOptions<typeof RuiChip>): VueWrapper<InstanceType<typeof RuiChip>> {
  return mount(RuiChip, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/chips/RuiChip.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiChip>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Chip';
    wrapper = createWrapper({
      props: {
        contentClass: 'content-class',
      },
      slots: {
        default: label,
      },
    });

    expect(wrapper.find('span').text()).toContain(label);
    expect(wrapper.find('span').classes()).toContain('content-class');
  });

  it('should show close icon', async () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBeUndefined();

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click:close');
  });

  it('should not close disabled chip', async () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
        disabled: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBe('');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click:close');
  });

  it('should not emit click event for disabled chip', async () => {
    wrapper = createWrapper({
      props: {
        clickable: true,
        disabled: true,
      },
    });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');

    await wrapper.setProps({ disabled: false });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('should render closeable chip with close button', () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
      },
      slots: {
        default: 'Closeable',
      },
    });

    expect(wrapper.find('button').exists()).toBeTruthy();
    expect(wrapper.find('span').text()).toContain('Closeable');
  });

  it('should emit click:close event on close button click', async () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
      },
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click:close');
    expect(wrapper.emitted('click:close')).toHaveLength(1);
  });

  it('should apply disabled state', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /opacity-40/);
  });

  it('should apply readonly state when not clickable', () => {
    wrapper = createWrapper({
      props: {
        clickable: false,
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /cursor-default/);
  });

  it('should apply size classes', async () => {
    wrapper = createWrapper({
      props: {
        size: 'md',
      },
    });

    const chip = wrapper.find('div[role=button]');
    expect(chip.classes()).toContain('min-h-[2.26rem]');

    await wrapper.setProps({ size: 'sm' });
    expect(chip.classes()).not.toContain('min-h-[2.26rem]');
  });

  it('should apply color classes', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });

    const chip = wrapper.find('div[role=button]');
    expect(chip.classes()).toContain('bg-rui-primary');

    await wrapper.setProps({ color: 'error' });
    expect(chip.classes()).toContain('bg-rui-error');
    expect(chip.classes()).not.toContain('bg-rui-primary');
  });

  it('should apply variant classes', async () => {
    wrapper = createWrapper({
      props: {
        variant: 'filled',
        color: 'primary',
      },
    });

    const chip = wrapper.find('div[role=button]');
    expect(chip.attributes('data-variant')).toBe('filled');

    await wrapper.setProps({ variant: 'outlined' });
    expect(chip.attributes('data-variant')).toBe('outlined');
    expect(chip.classes()).toContain('border');
  });

  it('should not emit click event for non-clickable chip', async () => {
    wrapper = createWrapper({
      props: {
        clickable: false,
      },
    });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');

    await wrapper.setProps({ clickable: true });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
