import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

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

    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_badge_/);
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_placement__top_/);
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__full_/);
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_size__md_/);
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_primary_/);
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
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_dot_/);
    expect(wrapper.find('span[class*=_content_]').exists()).toBeFalsy();
  });

  it('should apply placement classes', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_placement__top_/);

    await wrapper.setProps({ placement: 'bottom' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_placement__bottom_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=status]', /_placement__top_/);

    await wrapper.setProps({ placement: 'center' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_placement__center_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=status]', /_placement__bottom_/);
  });

  it('should apply color classes', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
        color: 'primary',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_secondary_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=status]', /_primary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_error_/);
  });

  it('should apply rounded classes', async () => {
    wrapper = createWrapper({
      props: {
        text: '1',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__full_/);

    await wrapper.setProps({ rounded: 'sm' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__sm_/);

    await wrapper.setProps({ rounded: 'lg' });
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__lg_/);
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

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_left_/);
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

    expect(wrapper.find('span[class*=_content_]').exists()).toBeTruthy();
    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();
    expect(wrapper.find('svg[class*=_rui-icon_]').exists()).toBeFalsy();

    await wrapper.setProps({ icon: 'lu-star' });

    expect(wrapper.find('svg[class*=_rui-icon_]').exists()).toBeTruthy();
    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__full_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=status]', /_rounded__sm_/);

    await wrapper.setProps({ rounded: 'sm' });

    expectWrapperToHaveClass(wrapper, 'div[role=status]', /_rounded__sm_/);
    expectWrapperNotToHaveClass(wrapper, 'div[role=status]', /_rounded__full_/);
  });
});
