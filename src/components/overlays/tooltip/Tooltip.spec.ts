import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';
import Button from '@/components/buttons/button/Button.vue';
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';

function createWrapper(options?: ComponentMountingOptions<typeof Tooltip>) {
  return mount(Tooltip, {
    ...options,
    global: {
      stubs: { 'rui-button': Button },
    },
    slots: {
      activator: '<rui-button id="activator">Tooltip trigger</rui-button>',
      default: options?.props?.text ?? '',
    },
  });
}

const delay = (time: number = 100) => promiseTimeout(time);

describe('tooltip', () => {
  const text = 'Tooltip content';

  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.unmount();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });
    expect(wrapper.get('#activator')).toBeTruthy();
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();
    wrapper.unmount();
  });

  it('disabled does not trigger tooltip', async () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');
    await delay();

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.unmount();
  });

  it('tooltip only appears after `openDelay` timeout', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 50000,
        openDelay: 400,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    // Tooltip shouldn't appear if the mouseleave happens before the timer ends.
    await delay(100);
    await wrapper.trigger('mouseleave');
    await delay(500);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await delay(350);
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    wrapper.unmount();
  });

  it('tooltip disappears after `closeDelay` timeout', async () => {
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();
    const wrapper = createWrapper({
      props: {
        closeDelay: 500,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await delay();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    await wrapper.trigger('mouseleave');

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList).toMatch(/_tooltip_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await delay(600);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });
});
