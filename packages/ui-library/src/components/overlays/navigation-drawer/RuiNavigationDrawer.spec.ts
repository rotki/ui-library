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

    let drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.runAllTimersAsync();

    drawer = queryBody<HTMLDivElement>('aside[class*=_visible_]');

    expect(drawer).toBeFalsy();
  });
});
