import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiBadge>): VueWrapper<InstanceType<typeof RuiBadge>> {
  return mount(RuiBadge, {
    ...options,
    global: {
      stubs: { 'rui-button': RuiButton },
    },
    slots: {
      default: '<rui-button>Badge</rui-button>',
    },
  });
}

describe('components/overlays/badge/RuiBadge.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiBadge>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        text: 'Badge content',
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    const badge = wrapper.find('div[role=status]');
    expect(badge.exists()).toBeTruthy();
    expect(badge.attributes('data-placement')).toBe('top');
    expect(badge.classes()).toContain('rounded-full');
    expect(badge.classes()).toContain('min-h-5');
    expect(badge.classes()).toContain('bg-rui-primary');
  });

  it('should have correct ARIA attributes', () => {
    wrapper = createWrapper({
      props: {
        text: 'Badge content',
      },
    });

    const badge = wrapper.find('div[role=status]');
    expect(badge.exists()).toBeTruthy();
    expect(badge.attributes('aria-live')).toBe('polite');
    expect(badge.attributes('aria-atomic')).toBe('true');
    expect(badge.attributes('aria-label')).toBe('Badge');
  });

  it('should render dot variant', () => {
    wrapper = createWrapper({
      props: {
        dot: true,
      },
    });

    const badge = wrapper.find('div[role=status]');
    expect(badge.exists()).toBeTruthy();
    expect(badge.attributes('data-dot')).toBe('true');
    expect(badge.find('span').exists()).toBeFalsy();
  });

  it('should apply placement via data attribute', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
      },
    });

    expect(wrapper.find('div[role=status]').attributes('data-placement')).toBe('top');

    await wrapper.setProps({ placement: 'bottom' });
    expect(wrapper.find('div[role=status]').attributes('data-placement')).toBe('bottom');

    await wrapper.setProps({ placement: 'center' });
    expect(wrapper.find('div[role=status]').attributes('data-placement')).toBe('center');
  });

  it('should apply color classes', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
        color: 'primary',
      },
    });

    const badge = wrapper.find('div[role=status]');
    expect(badge.classes()).toContain('bg-rui-primary');

    await wrapper.setProps({ color: 'secondary' });
    expect(badge.classes()).toContain('bg-rui-secondary');
    expect(badge.classes()).not.toContain('bg-rui-primary');

    await wrapper.setProps({ color: 'error' });
    expect(badge.classes()).toContain('bg-rui-error');
  });

  it('should apply rounded classes', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
      },
    });

    const badge = wrapper.find('div[role=status]');
    expect(badge.classes()).toContain('rounded-full');

    await wrapper.setProps({ rounded: 'sm' });
    expect(badge.classes()).toContain('rounded-sm');

    await wrapper.setProps({ rounded: 'lg' });
    expect(badge.classes()).toContain('rounded-lg');
  });

  it('should be hidden when modelValue is false', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        text: 'Badge content',
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    await wrapper.setProps({ modelValue: false });
    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();
  });

  it('should apply left positioning', () => {
    wrapper = createWrapper({
      props: {
        text: '1',
        left: true,
      },
    });

    expect(wrapper.find('div[role=status]').attributes('data-left')).toBe('true');
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        text: 'Badge content',
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    const badge = wrapper.find('div[role=status]');
    expect(badge.find('span').exists()).toBeTruthy();
    expect(badge.exists()).toBeTruthy();
    expect(wrapper.find('svg[aria-hidden]').exists()).toBeFalsy();

    await wrapper.setProps({ icon: 'lu-star' });

    expect(wrapper.find('svg[aria-hidden]').exists()).toBeTruthy();
    expect(badge.classes()).toContain('rounded-full');
    expect(badge.classes()).not.toContain('rounded-sm');

    await wrapper.setProps({ rounded: 'sm' });

    expect(badge.classes()).toContain('rounded-sm');
    expect(badge.classes()).not.toContain('rounded-full');
  });
});
