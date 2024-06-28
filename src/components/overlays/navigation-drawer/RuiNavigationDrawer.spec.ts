import { describe, expect, it, vi } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiNavigationDrawer from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

const text = 'Navigation Drawer Content';

function createWrapper(options?: ComponentMountingOptions<typeof RuiNavigationDrawer>) {
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

describe('navigation drawer', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();
    await nextTick();
    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();

    // Open drawer by clicking activator
    await wrapper.find('#trigger').trigger('click');

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();

    // Click the button that call close function
    const closeButton = drawer.querySelector('#close') as HTMLButtonElement;
    closeButton.click();

    await nextTick();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();
    wrapper.unmount();
  });

  it('should pass width and position props', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    expect(drawer.style.width).toBe('360px');

    await wrapper.setProps({
      position: 'right',
      width: '500',
    });

    drawer = document.body.querySelector('aside[class*=_visible_][class*=_right_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();
    expect(drawer.style.width).toBe('500px');

    wrapper.unmount();
  });

  it('dialog works with `temporary=false`', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.delay();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeTruthy();

    wrapper.unmount();
  });

  it('dialog works with `temporary=true`', async () => {
    const wrapper = createWrapper({
      props: {
        temporary: true,
      },
    });
    await nextTick();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');

    let drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;
    expect(drawer).toBeTruthy();

    // Click outside should not close the drawer
    document.body.click();
    await vi.delay();

    drawer = document.body.querySelector('aside[class*=_visible_]') as HTMLDivElement;

    expect(drawer).toBeFalsy();

    wrapper.unmount();
  });
});
