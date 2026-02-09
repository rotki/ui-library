import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiNavigationDrawer from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';
import { assertExists, cleanupElements, queryBody } from '~/tests/helpers/dom-helpers';

const text = 'Navigation Drawer Content';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiNavigationDrawer>,
): VueWrapper<InstanceType<typeof RuiNavigationDrawer>> {
  return mount(RuiNavigationDrawer, {
    ...options,
    global: {
      components: {
        RuiButton,
      },
    },
    slots: {
      activator: `<RuiButton id="trigger" v-bind="attrs">Click me!</RuiButton>`,
      default: `
        <div>
          ${text}
          
          <RuiButton id="close" @click="close()" />
        </div>
      `,
    },
  });
}

describe('components/overlays/navigation-drawer/RuiNavigationDrawer.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiNavigationDrawer>>;

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
    await vi.runAllTimersAsync();
    let drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    expect(drawer).toBeFalsy();

    // Open drawer by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    assertExists(drawer);

    // Click the button that call close function
    const closeButton = drawer.querySelector<HTMLButtonElement>('#close');
    assertExists(closeButton);
    closeButton.click();

    await vi.runAllTimersAsync();

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    expect(drawer).toBeFalsy();
  });

  it('should pass width and position props', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');
    assertExists(drawer);

    expect(drawer.style.width).toBe('360px');

    await wrapper.setProps({
      position: 'right',
      width: '500',
    });

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_][class*=_right_]');

    assertExists(drawer);
    expect(drawer.style.width).toBe('500px');
  });

  it('should dialog works with `temporary=false`', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.runAllTimersAsync();

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    expect(drawer).toBeTruthy();
  });

  it('should dialog works with `temporary=true`', async () => {
    wrapper = createWrapper({
      props: {
        temporary: true,
      },
    });
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.runAllTimersAsync();

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    expect(drawer).toBeFalsy();
  });

  it('should transition smoothly when modelValue is toggled externally', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
      },
    });
    await vi.runAllTimersAsync();

    // Drawer element should not be in the DOM initially
    let drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    expect(drawerElement).toBeFalsy();

    // Open drawer by setting modelValue to true (simulates parent v-model update)
    await wrapper.setProps({ modelValue: true });
    await vi.runAllTimersAsync();

    drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    assertExists(drawerElement);
    // Should have visible class when fully open
    expect(drawerElement.className).toMatch(/_visible_/);

    // Close drawer by setting modelValue to false (simulates parent v-if + v-model)
    await wrapper.setProps({ modelValue: false });

    // Drawer element should still be in the DOM immediately after closing (transition in progress)
    drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    expect(drawerElement).toBeTruthy();

    // After timers complete, drawer element should be fully removed from the DOM
    await vi.runAllTimersAsync();

    drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    expect(drawerElement).toBeFalsy();
  });

  it('should render as aside element', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const drawer = queryBody<HTMLElement>('aside[class*=_visible_]');
    assertExists(drawer);
    expect(drawer.tagName).toBe('ASIDE');
  });

  it('should have aria-label when prop provided', async () => {
    wrapper = createWrapper({
      attrs: {
        'aria-label': 'Main navigation',
      },
    });
    await vi.runAllTimersAsync();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const drawer = queryBody<HTMLElement>('aside[class*=_visible_]');
    assertExists(drawer);
    expect(drawer.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should have aria-hidden when miniVariant is true and drawer is collapsed', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        miniVariant: true,
      },
    });
    await vi.runAllTimersAsync();

    const drawer = queryBody<HTMLElement>('aside[class*=_content_]');
    assertExists(drawer);
    expect(drawer.getAttribute('aria-hidden')).toBe('true');

    // Open drawer
    await wrapper.setProps({ modelValue: true });
    await vi.runAllTimersAsync();

    const openDrawer = queryBody<HTMLElement>('aside[class*=_visible_]');
    assertExists(openDrawer);
    expect(openDrawer.getAttribute('aria-hidden')).toBeNull();
  });

  it('should apply left position class by default', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const drawer = queryBody<HTMLElement>('aside[class*=_visible_][class*=_left_]');
    assertExists(drawer);
  });

  it('should keep DOM element when miniVariant is true and modelValue is false', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        miniVariant: true,
      },
    });
    await vi.runAllTimersAsync();

    // Drawer element should be in the DOM even when modelValue is false (mini collapsed state)
    let drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    assertExists(drawerElement);
    // Should have mini class but not visible class
    expect(drawerElement.className).toMatch(/_mini_/);
    expect(drawerElement.className).not.toMatch(/_visible_/);

    // Open drawer by setting modelValue to true
    await wrapper.setProps({ modelValue: true });
    await vi.runAllTimersAsync();

    drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    assertExists(drawerElement);
    // Should have both mini and visible classes (full width)
    expect(drawerElement.className).toMatch(/_mini_/);
    expect(drawerElement.className).toMatch(/_visible_/);

    // Close drawer by setting modelValue to false
    await wrapper.setProps({ modelValue: false });
    await vi.runAllTimersAsync();

    // Drawer element should still be in the DOM (collapsed to mini width)
    drawerElement = queryBody<HTMLDivElement>('aside[class*=_content_]');
    assertExists(drawerElement);
    // Should have mini class but not visible class
    expect(drawerElement.className).toMatch(/_mini_/);
    expect(drawerElement.className).not.toMatch(/_visible_/);
  });
});
