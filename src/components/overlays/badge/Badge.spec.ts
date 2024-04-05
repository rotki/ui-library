import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import Button from '@/components/buttons/button/Button.vue';
import Badge from '@/components/overlays/badge/Badge.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Badge>) {
  return mount(Badge, {
    ...options,
    global: {
      stubs: { 'rui-button': Button },
    },
    slots: {
      default: '<rui-button>Badge</rui-button>',
    },
  });
}

describe('badge', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: false,
        text: 'Badge content',
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_badge_/)]),
    );
    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_placement__top_/)]),
    );
    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded__full_/)]),
    );
    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_size__md_/)]),
    );
    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_primary_/)]),
    );
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: false,
        text: 'Badge content',
      },
    });

    expect(wrapper.find('div[role=status]').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find('span[class*=_content_]').exists()).toBeTruthy();

    expect(wrapper.find('div[role=status]').exists()).toBeTruthy();

    expect(wrapper.find('svg[class*=_remixicon_]').exists()).toBeFalsy();

    await wrapper.setProps({ icon: 'star-line' });

    expect(wrapper.find('svg[class*=_remixicon_]').exists()).toBeTruthy();

    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded__full_/)]),
    );

    expect(wrapper.get('div[role=status]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded__sm_/)]),
    );

    await wrapper.setProps({ rounded: 'sm' });

    expect(wrapper.get('div[role=status]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded__sm_/)]),
    );
    expect(wrapper.get('div[role=status]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_rounded__full_/)]),
    );
  });
});
