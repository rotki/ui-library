import { describe, expect, it } from 'vitest';
import {
  type ComponentMountingOptions,
  DOMWrapper,
  mount,
} from '@vue/test-utils';
import Dialog from '@/components/overlays/dialog/Dialog.vue';
import Button from '@/components/buttons/button/Button.vue';

/**
 * quick polyfill
 */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

const createWrapper = (options: ComponentMountingOptions<typeof Dialog>) =>
  mount(Dialog, { ...options, global: { stubs: { 'rui-button': Button } } });

const delay = (time: number = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const getPortal = () =>
  new DOMWrapper(
    document.querySelector('#headlessui-portal-root div[role=dialog]'),
  );

describe('Dialog', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
      },
    });

    await delay();
    const portal = getPortal();
    expect(portal.exists()).toBeTruthy();
    expect(portal.classes()).toMatch(/_dialog_/);

    wrapper.setProps({ dismissible: true });
    await delay(500);

    wrapper.setProps({ modelValue: false });
    await delay(500);

    expect(getPortal().exists()).toBeFalsy();
  });

  it('reacts to props changes', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
      },
      slots: {
        title: ({ text = 'Dialog title' }: { text?: string }) => text,
        description: ({ text = 'Dialog description' }: { text?: string }) =>
          text,
        default: ({ text = 'Lorem ipsum dolor sit amet' }: { text?: string }) =>
          `<p>${text}</p>`,
      },
    });

    await delay();
    const portal = getPortal();
    expect(portal.exists()).toBeTruthy();
    expect(portal.classes()).toMatch(/_dialog_/);
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeFalsy();

    wrapper.setProps({ dismissible: true });
    await delay();
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeTruthy();
    expect(portal.get('div[class*=_dismiss_] button').classes()).toMatch(
      /_btn_/,
    );

    wrapper.setProps({ persistent: true });
    await delay();
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeFalsy();

    wrapper.setProps({ modelValue: false });
    await delay(500);

    expect(getPortal().exists()).toBeFalsy();
  });
});
