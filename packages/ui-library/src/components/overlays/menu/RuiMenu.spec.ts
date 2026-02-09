import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { assertExists, cleanupElements, expectToHaveClass, queryBody, queryByRole } from '~/tests/helpers/dom-helpers';
import { CLASS_PATTERNS, DATA_ATTRIBUTE_SELECTORS } from '~/tests/helpers/selectors';

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
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();

    // Click the content shouldn't close the menu
    menu?.click();
    await vi.runAllTimersAsync();

    menu = queryByRole<HTMLDivElement>('menu');

    expect(menu).toBeTruthy();
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
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
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
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
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();

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
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    await wrapper.find('#trigger').trigger('click');

    menu = queryByRole('menu');

    expect(menu).toBeTruthy();
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
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
      expectToHaveClass(menu, CLASS_PATTERNS.MENU);
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');

      menu = queryByRole('menu');
      const menuContent = queryByRole('menu-content');
      assertExists(menuContent);

      // Trigger mouseover on the content to simulate hovering over the menu content
      await menuContent.dispatchEvent(new MouseEvent('mouseover'));

      expect(menu).toBeTruthy();
      expectToHaveClass(menu, CLASS_PATTERNS.MENU);
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
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
      expectToHaveClass(menu, CLASS_PATTERNS.MENU);
      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      menu = queryByRole('menu');
      expect(menu).toBeTruthy();

      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('mouseleave');
      await vi.runAllTimersAsync();

      menu = queryByRole('menu');
      expect(menu).toBeTruthy();

      expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
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
    const menuContent = queryByRole<HTMLElement>('menu-content');
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
    expectToHaveClass(menu, CLASS_PATTERNS.MENU);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Click the content should close the menu
    menu?.click();
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });
});
