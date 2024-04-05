import { describe, expect, it } from 'vitest';
import {
  type ComponentMountingOptions,
  DOMWrapper,
  mount,
} from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';
import Dialog from '@/components/overlays/dialog/Dialog.vue';
import Button from '@/components/buttons/button/Button.vue';

function createWrapper(options: ComponentMountingOptions<typeof Dialog>) {
  return mount(Dialog, { ...options, global: { stubs: { 'rui-button': Button } } });
}

const delay = (time: number = 100) => promiseTimeout(time);

function getPortal() {
  return new DOMWrapper(
    document.querySelector('#headlessui-portal-root div[role=dialog]'),
  );
}

describe('dialog', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
      },
    });

    await delay();
    const portal = getPortal();
    expect(portal.exists()).toBeTruthy();
    expect(portal.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_dialog_/)]),
    );

    await wrapper.setProps({ dismissible: true });
    await delay(500);

    await wrapper.setProps({ modelValue: false });
    await delay(500);

    expect(getPortal().exists()).toBeFalsy();
  });

  it('reacts to props changes', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
      },
      slots: {
        default: ({ text = 'Lorem ipsum dolor sit amet' }: { text?: string }) =>
          `<p>${text}</p>`,
        description: ({ text = 'Dialog description' }: { text?: string }) =>
          text,
        title: ({ text = 'Dialog title' }: { text?: string }) => text,
      },
    });

    await delay();
    const portal = getPortal();
    expect(portal.exists()).toBeTruthy();
    expect(portal.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_dialog_/)]),
    );
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeFalsy();

    await wrapper.setProps({ dismissible: true });
    await delay();
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeTruthy();
    expect(portal.get('div[class*=_dismiss_] button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_btn_/)]),
    );

    await wrapper.setProps({ persistent: true });
    await delay();
    expect(portal.find('div[class*=_dismiss_] button').exists()).toBeFalsy();

    await wrapper.setProps({ modelValue: false });
    await delay(500);

    expect(getPortal().exists()).toBeFalsy();
  });
});
