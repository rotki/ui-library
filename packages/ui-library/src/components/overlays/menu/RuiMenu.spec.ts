import { autoUpdate } from '@floating-ui/dom';
import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { assertExists, cleanupElements, queryBody, queryByDataId, queryByRole } from '~/tests/helpers/dom-helpers';
import { DATA_ATTRIBUTE_SELECTORS } from '~/tests/helpers/selectors';

vi.mock('@floating-ui/dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/dom')>();
  return { ...actual, autoUpdate: vi.fn(actual.autoUpdate) };
});

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

  it('should put aria-haspopup on the activator, not on the wrapper', () => {
    wrapper = createWrapper();

    expect(wrapper.find('#trigger').attributes('aria-haspopup')).toBe('true');

    const activatorWrapper = wrapper.find('[data-menu-disabled]');
    expect(activatorWrapper.attributes('aria-haspopup')).toBeUndefined();
    expect(activatorWrapper.attributes('aria-expanded')).toBeUndefined();
  });

  it('should have aria-expanded="false" when closed and "true" when open', async () => {
    wrapper = createWrapper();

    const trigger = wrapper.find('#trigger');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    // Open menu
    await trigger.trigger('click');
    await vi.runAllTimersAsync();

    expect(trigger.attributes('aria-expanded')).toBe('true');

    // Close menu by clicking outside
    document.body.click();
    await vi.runAllTimersAsync();

    expect(trigger.attributes('aria-expanded')).toBe('false');
  });

  it('should point aria-controls at the popover only while it is shown', async () => {
    wrapper = createWrapper();

    const trigger = wrapper.find('#trigger');
    expect(trigger.attributes('aria-controls')).toBeUndefined();

    await trigger.trigger('click');
    await vi.runAllTimersAsync();

    const menu = queryByRole<HTMLDivElement>('menu');
    assertExists(menu);
    expect(trigger.attributes('aria-controls')).toBe(menu.id);
    expect(menu.id).not.toBe('');
  });

  it('should have aria-haspopup on the activator even when disabled', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
      },
    });

    const trigger = wrapper.find('#trigger');
    expect(trigger.attributes('aria-haspopup')).toBe('true');
    expect(trigger.attributes('aria-expanded')).toBe('false');
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

    it('should match aria-haspopup on the activator to the role', () => {
      wrapper = createWrapper({
        props: {
          role: 'listbox',
        },
      });

      expect(wrapper.find('#trigger').attributes('aria-haspopup')).toBe('listbox');
    });

    it('should name the popover with menuLabel', async () => {
      wrapper = createWrapper({
        props: {
          role: 'dialog',
          menuLabel: 'Filters',
        },
      });

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(queryByRole('dialog')?.getAttribute('aria-label')).toBe('Filters');
    });
  });

  describe('escape propagation', () => {
    const Host = defineComponent({
      components: { RuiButton, RuiMenu },
      props: {
        persistent: { default: false, type: Boolean },
      },
      emits: ['ancestor-keydown'],
      template: `
        <div @keydown="$emit('ancestor-keydown')">
          <RuiMenu v-model="open" :persistent="persistent">
            <template #activator="{ attrs }">
              <RuiButton id="trigger" v-bind="attrs">Click me!</RuiButton>
            </template>
            <div>${text}</div>
          </RuiMenu>
        </div>`,
      setup() {
        return { open: ref(false) };
      },
    });

    function createHost(persistent = false): VueWrapper<InstanceType<typeof Host>> {
      return mount(Host, { props: { persistent } });
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

    it('should keep a persistent menu open on escape and let the key through', async () => {
      const host = createHost(true);

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      const before = ancestorKeydowns(host);
      await host.find('#trigger').trigger('keydown', { key: 'Escape' });
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));
      expect(ancestorKeydowns(host)).toBe(before + 1);

      host.unmount();
    });

    it('should stay open on an escape an IME is composing, and let the key through, since there escape only cancels the candidate', async () => {
      const host = createHost();

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      const before = ancestorKeydowns(host);
      await host.find('#trigger').trigger('keydown', { isComposing: true, key: 'Escape' });
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));
      expect(ancestorKeydowns(host)).toBe(before + 1);

      await host.find('#trigger').trigger('keydown', { key: 'Escape' });
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));

      host.unmount();
    });

    it('should still close a persistent menu through its model', async () => {
      const host = createHost(true);

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      host.vm.open = false;
      await vi.runAllTimersAsync();

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

  it('should move focus into the menu and back to the trigger without scrolling the page', async () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    wrapper = createWrapper();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const menuContent = queryByDataId<HTMLElement>('content');
    assertExists(menuContent);
    expect(focus.mock.contexts.at(-1)).toBe(menuContent);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });

    await wrapper.find('#trigger').trigger('keydown', { key: 'Escape' });
    await vi.runAllTimersAsync();

    expect(focus.mock.contexts.at(-1)).toBe(wrapper.find('#trigger').element);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    focus.mockRestore();
  });

  it('should open a menu mounted with its model already true', async () => {
    wrapper = createWrapper({ props: { modelValue: true } });
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).toMatch(new RegExp(text));
    expect(wrapper.find('#trigger').attributes('aria-expanded')).toBe('true');
  });

  it('should keep a menu mounted with its model false closed', async () => {
    wrapper = createWrapper({ props: { modelValue: false } });
    await vi.runAllTimersAsync();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });

  it.each([
    { errorMessages: [], successMessages: '', flags: 'false/false' },
    { errorMessages: ['', ''], successMessages: [''], flags: 'false/false' },
    { errorMessages: 'Required', successMessages: [], flags: 'true/false' },
    { errorMessages: ['', 'Too long'], successMessages: ['Saved'], flags: 'true/true' },
  ])('should tell the activator about its messages ($flags)', ({ errorMessages, successMessages, flags }) => {
    wrapper = mount(RuiMenu, {
      props: { errorMessages, successMessages },
      slots: {
        activator: `<template #activator="{ hasError, hasSuccess }"><span id="flags">{{ hasError }}/{{ hasSuccess }}</span></template>`,
      },
    });

    expect(wrapper.find('#flags').text()).toBe(flags);
  });

  describe('lazy', () => {
    const observe = vi.fn<(element: Element) => void>();
    const SetupResizeObserver = globalThis.ResizeObserver;

    /** A set-up menu observes its activator's size, which tells a set-up menu from one that is not. */
    function observedElements(): Element[] {
      return observe.mock.calls.map(([element]) => element);
    }

    function isSetUp(): boolean {
      return observedElements().includes(wrapper.find('[data-menu-disabled]').element);
    }

    function clickOutsideListeners(): number {
      return vi.mocked(window.addEventListener).mock.calls.filter(([type]) => type === 'pointerdown').length;
    }

    /** The callbacks of the observers watching each element (the menu's and floating-ui's), to report a resize. */
    const resizeCallbacks = new Map<Element, ResizeObserverCallback[]>();

    /** A menu whose content shows the width it gets from its slot. */
    function mountWidthMenu(props: Record<string, unknown>): VueWrapper {
      return mount(defineComponent({
        components: { RuiButton, RuiMenu },
        template: `
          <RuiMenu v-bind="props">
            <template #activator="{ attrs }">
              <RuiButton id="trigger" v-bind="attrs">Click me!</RuiButton>
            </template>
            <template #default="{ width }">
              <div data-id="width">{{ width }}</div>
            </template>
          </RuiMenu>`,
        setup: () => ({ props }),
      }));
    }

    beforeEach(() => {
      observe.mockClear();
      resizeCallbacks.clear();
      vi.stubGlobal('ResizeObserver', class {
        constructor(private readonly callback: ResizeObserverCallback) {}

        observe = (element: Element): void => {
          observe(element);
          resizeCallbacks.set(element, [...resizeCallbacks.get(element) ?? [], this.callback]);
        };

        unobserve = vi.fn();
        disconnect = vi.fn();
      });
      vi.spyOn(window, 'addEventListener');
    });

    afterEach(() => {
      vi.stubGlobal('ResizeObserver', SetupResizeObserver);
      vi.mocked(autoUpdate).mockReset();
    });

    it.each([
      { lazy: true, listeners: 0 },
      { lazy: false, listeners: 1 },
    ])('should set up at mount only without lazy (lazy=$lazy)', async ({ lazy, listeners }) => {
      wrapper = createWrapper({ props: { lazy } });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(!lazy);
      expect(clickOutsideListeners()).toBe(listeners);
    });

    it.each(['mouse', 'pen', 'touch'])('should not set up on a %s pointerenter or on focus', async (pointerType) => {
      wrapper = createWrapper({ props: { lazy: true } });
      const activatorWrapper = wrapper.find('[data-menu-disabled]');

      await activatorWrapper.trigger('pointerenter', { pointerType });
      await wrapper.find('#trigger').trigger('focusin');

      expect(isSetUp()).toBe(false);
      expect(clickOutsideListeners()).toBe(0);
    });

    it('should open on the first click', async () => {
      wrapper = createWrapper({ props: { lazy: true } });

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));
      expect(wrapper.find('#trigger').attributes('aria-expanded')).toBe('true');

      document.body.click();
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });

    it('should close on a second activator click', async () => {
      wrapper = createWrapper({ props: { lazy: true } });

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
      expect(wrapper.find('#trigger').attributes('aria-expanded')).toBe('false');
    });

    it('should stay open on a second activator click with persistOnActivatorClick', async () => {
      wrapper = createWrapper({ props: { lazy: true, persistOnActivatorClick: true } });

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(document.body.innerHTML).toMatch(new RegExp(text));
    });

    it('should set up on a context menu', async () => {
      wrapper = createWrapper({ props: { lazy: true } });

      await wrapper.find('#trigger').trigger('contextmenu');

      expect(isSetUp()).toBe(true);
    });

    it('should not set up on events that are not a first use', async () => {
      wrapper = createWrapper({ props: { lazy: true } });

      await wrapper.find('#trigger').trigger('keydown', { key: 'a' });
      await wrapper.find('#trigger').trigger('mouseover');

      expect(isSetUp()).toBe(false);
    });

    it('should not set up a disabled menu', async () => {
      wrapper = createWrapper({ props: { disabled: true, lazy: true } });

      await wrapper.find('#trigger').trigger('contextmenu');
      await wrapper.find('#trigger').trigger('click');

      expect(isSetUp()).toBe(false);
    });

    it('should not set up a disabled menu whose model is true', async () => {
      wrapper = createWrapper({ props: { disabled: true, lazy: true, modelValue: true } });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(false);

      await wrapper.setProps({ modelValue: false });
      await wrapper.setProps({ modelValue: true });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(false);
      expect(document.body.innerHTML).not.toMatch(new RegExp(text));
    });

    it('should set up and open on hover with openOnHover', async () => {
      wrapper = createWrapper({ props: { lazy: true, openOnHover: true } });

      // The activator's own handler, with no pointerenter first
      await wrapper.find('#trigger').trigger('mouseover');
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(true);
      expect(document.body.innerHTML).toMatch(new RegExp(text));
    });

    it('should keep the same elements and markup around the activator across setup', async () => {
      wrapper = createWrapper({ props: { lazy: true } });
      const root = wrapper.element as HTMLElement;
      const activatorWrapper = wrapper.find('[data-menu-disabled]').element;
      const trigger = wrapper.find('#trigger').element;
      const before = activatorWrapper.outerHTML;

      await wrapper.find('#trigger').trigger('contextmenu');

      expect(isSetUp()).toBe(true);
      expect(wrapper.element).toBe(root);
      expect(wrapper.find('[data-menu-disabled]').element).toBe(activatorWrapper);
      expect(wrapper.find('#trigger').element).toBe(trigger);
      expect(activatorWrapper.outerHTML).toBe(before);
      expect(Array.from(root.children, child => child.outerHTML)).toEqual([before]);

      // The comparison does see a change: opening the menu flips the activator's ARIA
      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      expect(activatorWrapper.outerHTML).not.toBe(before);
    });

    it('should keep keyboard focus on the activator across setup', async () => {
      wrapper = createWrapper({ attachTo: document.body, props: { lazy: true } });
      const trigger = wrapper.find('#trigger');
      const triggerElement = trigger.element as HTMLElement;

      // The context menu key on a focused activator
      triggerElement.focus();
      await trigger.trigger('contextmenu');
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(true);
      expect(document.activeElement).toBe(triggerElement);

      // Focus does move once the menu opens, so the check above is not vacuous
      await trigger.trigger('click');
      await vi.runAllTimersAsync();

      expect(document.activeElement).toBe(queryByDataId('content'));
    });

    it.each([true, false])('should keep the popover positioned with lazy=%s', async (lazy) => {
      wrapper = createWrapper({ props: { lazy } });
      await vi.runAllTimersAsync();
      vi.mocked(autoUpdate).mockClear();

      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      const menu = queryByRole('menu');
      assertExists(menu);
      expect(autoUpdate).toHaveBeenCalledWith(
        wrapper.find('[data-menu-disabled]').element,
        menu,
        expect.any(Function),
        undefined,
      );
    });

    it('should open a lazy menu mounted with its model already true', async () => {
      wrapper = createWrapper({ props: { lazy: true, modelValue: true } });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(true);
      expect(document.body.innerHTML).toMatch(new RegExp(text));
    });

    it('should set up and open when the model turns true', async () => {
      wrapper = createWrapper({ props: { 'lazy': true, 'modelValue': false, 'onUpdate:modelValue': async (value: boolean) => wrapper.setProps({ modelValue: value }) } });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(false);
      expect(document.body.innerHTML).not.toMatch(new RegExp(text));

      await wrapper.setProps({ modelValue: true });
      await vi.runAllTimersAsync();

      expect(isSetUp()).toBe(true);
      expect(document.body.innerHTML).toMatch(new RegExp(text));
      expect(wrapper.find('#trigger').attributes('aria-expanded')).toBe('true');
    });

    it('should stop its listeners on unmount after a late setup', async () => {
      const removeEventListener = vi.spyOn(window, 'removeEventListener');
      wrapper = createWrapper({ props: { lazy: true } });
      await wrapper.find('#trigger').trigger('contextmenu');

      const removedPointerdown = (): unknown[] => removeEventListener.mock.calls.filter(([type]) => type === 'pointerdown');
      const removedBefore = removedPointerdown().length;
      wrapper.unmount();

      expect(removedPointerdown()).toHaveLength(removedBefore + 1);
    });

    it('should start no timers from an activator used after unmount', async () => {
      wrapper = createWrapper({ props: { lazy: true } });
      await wrapper.find('#trigger').trigger('contextmenu');
      expect(isSetUp()).toBe(true);
      await vi.runAllTimersAsync();

      const trigger = wrapper.find('#trigger').element as HTMLElement;
      wrapper.unmount();
      trigger.click();

      expect(vi.getTimerCount()).toBe(0);
    });

    it('should start no timers from an escape that reaches an open menu after unmount', async () => {
      wrapper = createWrapper({ props: { lazy: true } });
      await wrapper.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(document.body.innerHTML).toMatch(new RegExp(text));

      const trigger = wrapper.find('#trigger').element;
      wrapper.unmount();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));

      expect(vi.getTimerCount()).toBe(0);
    });

    it('should tie a setup run from another component\'s mounted hook to the menu', async () => {
      const stopAutoUpdate = vi.fn();
      vi.mocked(autoUpdate).mockImplementation(() => stopAutoUpdate);

      const Host = defineComponent({
        components: { RuiButton, RuiMenu },
        template: `
          <div>
            <RuiMenu v-if="show" lazy>
              <template #activator="{ attrs }">
                <RuiButton id="trigger" ref="trigger" v-bind="attrs">Click me!</RuiButton>
              </template>
              <div>${text}</div>
            </RuiMenu>
          </div>`,
        setup() {
          const show = ref<boolean>(true);
          const trigger = useTemplateRef<{ $el: HTMLElement }>('trigger');
          // A first use dispatched while this component's own mounted hook runs
          onMounted(() => {
            get(trigger)?.$el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
          });
          return { show };
        },
      });

      const host = mount(Host);
      await vi.runAllTimersAsync();
      expect(observedElements()).toHaveLength(1);

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(autoUpdate).toHaveBeenCalled();

      host.vm.show = false;
      await vi.runAllTimersAsync();

      expect(stopAutoUpdate).toHaveBeenCalled();
      host.unmount();
    });

    it.each([true, false])('should give the content the activator width with lazy=%s', async (lazy) => {
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);
      const host = mountWidthMenu({ lazy });

      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();
      expect(queryByDataId('width')?.textContent).toBe('80');

      const callbacks = resizeCallbacks.get(host.find('[data-menu-disabled]').element) ?? [];
      for (const callback of callbacks)
        callback([{ contentRect: { width: 150 } } as ResizeObserverEntry], {} as ResizeObserver);
      await nextTick();

      expect(queryByDataId('width')?.textContent).toBe('150');
      host.unmount();
    });

    it('should measure the activator for a setup run from another component\'s mounted hook', async () => {
      const Host = defineComponent({
        components: { RuiButton, RuiMenu },
        template: `
          <RuiMenu lazy>
            <template #activator="{ attrs }">
              <RuiButton id="trigger" ref="trigger" v-bind="attrs">Click me!</RuiButton>
            </template>
            <template #default="{ width }">
              <div data-id="width">{{ width }}</div>
            </template>
          </RuiMenu>`,
        setup() {
          const trigger = useTemplateRef<{ $el: HTMLElement }>('trigger');
          onMounted(() => {
            const element = get(trigger)?.$el;
            assertExists(element?.parentElement);
            Object.defineProperty(element.parentElement, 'offsetWidth', { value: 120 });
            element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
          });
        },
      });

      const host = mount(Host);
      await host.find('#trigger').trigger('click');
      await vi.runAllTimersAsync();

      // The stubbed observer never reports, so only the setup's own read can give the width
      expect(queryByDataId('width')?.textContent).toBe('120');
      host.unmount();
    });

    it('should ignore a first use that arrives after unmount', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      wrapper = createWrapper({ props: { lazy: true } });
      const activatorWrapper = wrapper.find('[data-menu-disabled]').element;
      wrapper.unmount();

      activatorWrapper.dispatchEvent(new MouseEvent('click'));
      activatorWrapper.dispatchEvent(new MouseEvent('contextmenu'));

      expect(observedElements()).not.toContain(activatorWrapper);
      expect(warn).not.toHaveBeenCalled();
    });
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
