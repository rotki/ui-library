import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiBadge>) {
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

    expect(wrapper.find('svg[class*=_rui-icon_]').exists()).toBeFalsy();

    await wrapper.setProps({ icon: 'lu-star' });

    expect(wrapper.find('svg[class*=_rui-icon_]').exists()).toBeTruthy();

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
