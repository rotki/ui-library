import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Button from '@/components/buttons/button/Button.vue';
import Badge from '@/components/overlays/badge/Badge.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Badge>) =>
  mount(Badge, {
    ...options,
    slots: {
      default: '<rui-button>Badge</rui-button>',
    },
    global: {
      stubs: { 'rui-button': Button },
    },
  });

describe('Badge', () => {
  it.only('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Badge content',
        modelValue: false,
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    expect(wrapper.get('div[role=status]').classes()).toMatch(/_badge_/);
    expect(wrapper.get('div[role=status]').classes()).toMatch(
      /_placement__top_/,
    );
    expect(wrapper.get('div[role=status]').classes()).toMatch(
      /_rounded__full_/,
    );
    expect(wrapper.get('div[role=status]').classes()).toMatch(/_size__md_/);
    expect(wrapper.get('div[role=status]').classes()).toMatch(/_primary_/);
  });

  it.only('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Badge content',
        modelValue: false,
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find('span[class*=_content_]').exists()).toBeTruthy();

    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    expect(wrapper.find('svg[class*=_remixicon_]').exists()).toBeFalsy();

    await wrapper.setProps({ icon: 'star-line' });

    expect(wrapper.find('svg[class*=_remixicon_]').exists()).toBeTruthy();

    expect(wrapper.get('div[role=status]').classes()).toMatch(
      /_rounded__full_/,
    );

    expect(wrapper.get('div[role=status]').classes()).not.toMatch(
      /_rounded__sm_/,
    );

    await wrapper.setProps({ rounded: 'sm' });

    expect(wrapper.get('div[role=status]').classes()).toMatch(/_rounded__sm_/);
    expect(wrapper.get('div[role=status]').classes()).not.toMatch(
      /_rounded__full_/,
    );
  });
});
