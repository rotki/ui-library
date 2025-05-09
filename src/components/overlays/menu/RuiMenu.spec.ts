import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

const text = 'This is menu';

function createWrapper(options?: ComponentMountingOptions<typeof RuiMenu>) {
  return mount(RuiMenu, {
    ...options,
    global: {
      components: {
        RuiButton,
      },
    },
    slots: {
      activator: `<RuiButton id="trigger" v-bind="attrs">Click me!</RuiButton>`,
      default: `<div class="py-2 px-3">${text}</div>`,
    },
  });
}

describe('menu', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    let menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    // Click the content shouldn't close the menu
    menu.click();
    await vi.delay();

    menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click outside should close the menu
    document.body.click();
    await vi.delay();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    wrapper.unmount();
  });

  it('passes props correctly', () => {
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
    await vi.delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );
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
    await vi.delay();

    const menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    await vi.delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    await vi.delay(500);
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
    await vi.delay();

    let menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await wrapper.find('#trigger').trigger('click');

    menu = document.body.querySelector('div[role=menu]');

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await vi.delay(2100);

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
          closeDelay: 200,
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await vi.delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(Array.from(menu?.classList ?? [])).toEqual(
        expect.arrayContaining([expect.stringMatching(/_menu_/)]),
      );
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');

      menu = document.body.querySelector('div[role=menu]');
      const menuContent = document.body.querySelector('div[role=menu-content]');

      // Trigger mouseover on the content to simulate hovering over the menu content
      await menuContent?.dispatchEvent(new MouseEvent('mouseover'));

      expect(menu).toBeTruthy();
      expect(Array.from(menu?.classList ?? [])).toEqual(
        expect.arrayContaining([expect.stringMatching(/_menu_/)]),
      );
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await vi.delay(2100);

      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await menuContent?.dispatchEvent(new MouseEvent('click'));
      await vi.delay(400);

      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await menuContent?.dispatchEvent(new MouseEvent('mouseleave'));
      await vi.delay(400);

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });

    it('hover with click', async () => {
      const wrapper = createWrapper({
        props: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await vi.delay();

      let menu = document.body.querySelector('div[role=menu]');

      expect(menu).toBeTruthy();
      expect(Array.from(menu?.classList ?? [])).toEqual(
        expect.arrayContaining([expect.stringMatching(/_menu_/)]),
      );
      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');
      await vi.delay();

      menu = document.body.querySelector('div[role=menu]');
      expect(menu).toBeTruthy();

      expect(
        document.body.querySelector('div[data-popper-placement=bottom]'),
      ).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.delay();

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
    await vi.delay();

    const menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;

    expect(menu).toBeTruthy();
    expect(Array.from(menu?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_menu_/)]),
    );

    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click the content should close the menu
    menu.click();
    await vi.delay();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });
});
