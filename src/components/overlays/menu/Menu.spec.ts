import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';
import Button from '@/components/buttons/button/Button.vue';
import Menu from '@/components/overlays/menu/Menu.vue';

const text = 'This is menu';

function createWrapper(options?: ComponentMountingOptions<typeof Menu>) {
  return mount(Menu, {
    ...options,
    global: {
      stubs: { 'rui-button': Button },
    },
    slots: {
      activator: `<rui-button id="trigger" v-on="params.on">
        Click me!
      </rui-button>`,
      default: `<div class="py-2 px-3">${text}</div>`,
    },
  });
}

const delay = (time: number = 100) => promiseTimeout(time);

describe('menu', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    // Click the content shouldn't close the menu
    menu.click();
    await delay();

    menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click outside should close the menu
    document.body.click();
    await delay();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    wrapper.unmount();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });
    expect(wrapper.get('#trigger')).toBeTruthy();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();
    wrapper.unmount();
  });

  it('disabled does not trigger menu', async () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));
    wrapper.unmount();
  });

  it('menu only appears after `openDelay` timeout', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 50000,
        openDelay: 400,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    const menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    await delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    await delay(500);
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    wrapper.unmount();
  });

  it('menu disappears after `closeDelay` timeout', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 1000,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await wrapper.find('#trigger').trigger('click');

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await delay(2100);

    menu = document.body.querySelector('div[role=menu]');
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.setProps({ disabled: true });
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });

  describe('menu works with `openOnHover=true`', () => {
    it('hover without click', async () => {
      const wrapper = createWrapper({
        props: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');

      menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await delay(2100);

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });

    it('hover with click', async () => {
      const wrapper = createWrapper({
        props: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(menu?.classList).toMatch(/_menu_/);
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');
      await delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await delay();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });
  });

  it('menu works with `closeOnContentClick=true`', async () => {
    const wrapper = createWrapper({
      props: {
        closeOnContentClick: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await delay();

    const menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(menu?.classList).toMatch(/_menu_/);

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click the content should close the menu
    menu.click();
    await delay();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });
});
