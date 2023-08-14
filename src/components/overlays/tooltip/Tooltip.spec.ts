import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';
import Button from '@/components/buttons/button/Button.vue';
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Tooltip>) =>
  mount(Tooltip, {
    ...options,
    slots: {
      default: '<rui-button>Tooltip trigger</rui-button>',
    },
    global: {
      stubs: { 'rui-button': Button },
    },
  });

const delay = (time: number = 100) => promiseTimeout(time);

describe('Tooltip', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Tooltip content',
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    expect(wrapper.get('div[role=tooltip]').classes()).toMatch(/_tooltip_/);
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Tooltip content',
        disabled: true,
      },
    });
    expect(wrapper.get('div[class*=_trigger_]')).toBeTruthy();
    expect(wrapper.find('div[role=tooltip]').exists()).toBeFalsy();
  });

  it('disabled does not trigger tooltip', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Tooltip content',
        disabled: true,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    expect(wrapper.find('div[role=tooltip]').exists()).toBeFalsy();
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeFalsy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');
    await delay();

    expect(wrapper.get('div[role=tooltip]').classes()).toMatch(/_tooltip_/);
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeTruthy();
  });

  it('tooltip disappears after close timeout', async () => {
    const wrapper = createWrapper({
      props: {
        text: 'Tooltip content',
        closeDelay: 1000,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    expect(wrapper.get('div[role=tooltip]').classes()).toMatch(/_tooltip_/);
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeTruthy();

    await wrapper.trigger('mouseleave');

    expect(wrapper.get('div[role=tooltip]').classes()).toMatch(/_tooltip_/);
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeTruthy();

    await delay(1000);

    expect(wrapper.find('div[role=tooltip]').exists()).toBeFalsy();
    expect(
      wrapper.find('div[data-popper-placement=bottom]').exists(),
    ).toBeFalsy();
    expect(wrapper.find('span[data-popper-arrow]').exists()).toBeFalsy();
    await wrapper.setProps({ disabled: false });
  });
});
