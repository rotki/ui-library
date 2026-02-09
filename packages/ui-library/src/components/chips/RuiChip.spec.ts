import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiChip from '@/components/chips/RuiChip.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

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

    expect(wrapper.find('span[class*=_label]').text()).toContain(label);
    expect(wrapper.find('span[class*=_label]').classes()).toContain('content-class');
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
    expect(wrapper.find('span[class*=_label]').text()).toContain('Closeable');
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

  it('should apply disabled class when disabled', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_disabled_/);
  });

  it('should apply readonly class when not clickable', () => {
    wrapper = createWrapper({
      props: {
        clickable: false,
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_readonly_/);
  });

  it('should apply size classes', async () => {
    wrapper = createWrapper({
      props: {
        size: 'md',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_md_/);

    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_sm_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=button]', /_md_/);
  });

  it('should apply color classes', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_primary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_error_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=button]', /_primary_/);
  });

  it('should apply variant classes', async () => {
    wrapper = createWrapper({
      props: {
        variant: 'filled',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_filled_/);

    await wrapper.setProps({ variant: 'outlined' });
    expectWrapperToHaveClass(wrapper, 'div[role=button]', /_outlined_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=button]', /_filled_/);
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
