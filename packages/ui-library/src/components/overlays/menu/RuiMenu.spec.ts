import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { assertExists, cleanupElements, queryBody, queryByDataId, queryByRole } from '~/tests/helpers/dom-helpers';
import { DATA_ATTRIBUTE_SELECTORS } from '~/tests/helpers/selectors';

const text = 'This is menu';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiMenu>,
): VueWrapper<InstanceType<typeof RuiMenu>> {
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

describe('components/overlays/menu/RuiMenu.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiMenu>>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    cleanupElements('*', document.body);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render properly', async () => {
    wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let menu = queryByRole<HTMLDivElement>('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();

    // Click the content shouldn't close the menu
    menu?.click();
    await vi.runAllTimersAsync();

    menu = queryByRole<HTMLDivElement>('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click outside should close the menu
    document.body.click();
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });

  it('should pass props correctly', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });
    expect(wrapper.get('#trigger')).toBeTruthy();
    expect(queryByRole('menu')).toBeFalsy();
  });

  it('should not trigger menu when disabled', async () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let menu = queryByRole('menu');

    expect(menu).toBeFalsy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));
  });

  it('should menu only appears after `openDelay` timeout', async () => {
    wrapper = createWrapper({
      props: {
        closeDelay: 50000,
        openDelay: 400,
      },
    });

    await wrapper.find('#trigger').trigger('click');

    // Advance timers by a small amount to let the menu wrapper appear
    await vi.advanceTimersByTimeAsync(50);

    const menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();

    // Content should not be visible yet (openDelay is 400ms)
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    // Advance to just before openDelay
    await vi.advanceTimersByTimeAsync(300);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    // Advance past openDelay
    await vi.advanceTimersByTimeAsync(100);
    expect(document.body.innerHTML).toMatch(new RegExp(text));
  });

  it('should menu disappears after `closeDelay` timeout', async () => {
    wrapper = createWrapper({
      props: {
        closeDelay: 1000,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await wrapper.find('#trigger').trigger('click');

    menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await vi.runAllTimersAsync();

    menu = queryByRole('menu');
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.setProps({ disabled: true });
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });

  describe('menu works with `openOnHover=true`', () => {
    it('should open menu on hover without click', async () => {
      wrapper = createWrapper({
        props: {
          closeDelay: 200,
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await vi.runAllTimersAsync();

      let menu = queryByRole('menu');

      expect(menu).toBeTruthy();
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');

      menu = queryByRole('menu');
      const menuContent = queryByDataId('content');
      assertExists(menuContent);

      // Trigger mouseover on the content to simulate hovering over the menu content
      await menuContent.dispatchEvent(new MouseEvent('mouseover'));

      expect(menu).toBeTruthy();
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await menuContent.dispatchEvent(new MouseEvent('click'));
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await menuContent.dispatchEvent(new MouseEvent('mouseleave'));
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });

    it('should open menu on hover with click', async () => {
      wrapper = createWrapper({
        props: {
          openOnHover: true,
        },
      });

      await wrapper.find('#trigger').trigger('mouseover');
      await vi.runAllTimersAsync();

      let menu = queryByRole('menu');

      expect(menu).toBeTruthy();
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      menu = queryByRole('menu');
      expect(menu).toBeTruthy();

      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');
      await vi.runAllTimersAsync();

      menu = queryByRole('menu');
      expect(menu).toBeTruthy();

      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });
  });

  it('should have aria-haspopup on activator wrapper', () => {
    wrapper = createWrapper();

    const activatorWrapper = wrapper.find('[data-menu-disabled]');
    expect(activatorWrapper.attributes('aria-haspopup')).toBe('true');
  });

  it('should have aria-expanded="false" when closed and "true" when open', async () => {
    wrapper = createWrapper();

    const activatorWrapper = wrapper.find('[data-menu-disabled]');
    expect(activatorWrapper.attributes('aria-expanded')).toBe('false');

    // Open menu
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    expect(activatorWrapper.attributes('aria-expanded')).toBe('true');

    // Close menu by clicking outside
    document.body.click();
    await vi.runAllTimersAsync();

    expect(activatorWrapper.attributes('aria-expanded')).toBe('false');
  });

  it('should have aria-haspopup on activator wrapper even when disabled', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    const activatorWrapper = wrapper.find('[data-menu-disabled]');
    expect(activatorWrapper.attributes('aria-haspopup')).toBe('true');
    expect(activatorWrapper.attributes('aria-expanded')).toBe('false');
  });

  describe('role', () => {
    it('should default the popover to role="menu"', async () => {
      wrapper = createWrapper();

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(queryByRole('menu')).toBeTruthy();
    });

    it('should apply a custom role to the popover', async () => {
      wrapper = createWrapper({
        props: {
          role: 'listbox',
        },
      });

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(queryByRole('listbox')).toBeTruthy();
      expect(queryByRole('menu')).toBeFalsy();
    });

    it('should match aria-haspopup on the activator wrapper to the role', () => {
      wrapper = createWrapper({
        props: {
          role: 'listbox',
        },
      });

      const activatorWrapper = wrapper.find('[data-menu-disabled]');
      expect(activatorWrapper.attributes('aria-haspopup')).toBe('listbox');
    });
  });

  describe('escape propagation', () => {
    const Host = defineComponent({
      components: { RuiButton, RuiMenu },
      emits: ['ancestor-keydown'],
      template: `
        <div @keydown="$emit('ancestor-keydown')">
          <RuiMenu>
            <template #activator="{ attrs }">
              <RuiButton id="trigger" v-bind="attrs">Click me!</RuiButton>
            </template>
            <div>${text}</div>
          </RuiMenu>
        </div>`,
    });

    function createHost(): VueWrapper<InstanceType<typeof Host>> {
      return mount(Host);
    }

    function ancestorKeydowns(host: VueWrapper<InstanceType<typeof Host>>): number {
      return host.emitted('ancestor-keydown')?.length ?? 0;
    }

    it('should let escape through to an ancestor while closed', async () => {
      const host = createHost();

      await host.find('#trigger').trigger('keydown', { key: 'Escape' });

      expect(ancestorKeydowns(host)).toBe(1);

      host.unmount();
    });

    it('should swallow escape while open and close the menu', async () => {
      const host = createHost();

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      const before = ancestorKeydowns(host);
      await host.find('#trigger').trigger('keydown', { key: 'Escape' });
      await vi.runAllTimersAsync();

      expect(ancestorKeydowns(host)).toBe(before);
      expect(document.body.innerHTML).not.toMatch(new RegExp(text));

      host.unmount();
    });

    it('should let other keys through while open', async () => {
      const host = createHost();

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      const before = ancestorKeydowns(host);
      await host.find('#trigger').trigger('keydown', { key: 'a' });

      expect(ancestorKeydowns(host)).toBe(before + 1);

      host.unmount();
    });
  });

  it('should not close when persistent and clicking outside', async () => {
    wrapper = createWrapper({
      props: {
        persistent: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click outside should not close the menu
    document.body.click();
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).toMatch(new RegExp(text));
  });

  it('should focus menu content when opened', async () => {
    wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    // Menu content should be focused
    const menuContent = queryByDataId<HTMLElement>('content');
    assertExists(menuContent);
    expect(document.activeElement).toBe(menuContent);
  });

  it('should menu works with `closeOnContentClick=true`', async () => {
    wrapper = createWrapper({
      props: {
        closeOnContentClick: true,
      },
    });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const menu = queryByRole<HTMLDivElement>('menu');

    expect(menu).toBeTruthy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click the content should close the menu
    menu?.click();
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });
});
