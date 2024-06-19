import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RuiBottomSheet from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

const text = 'This is content';

function createWrapper(options?: any) {
  return mount(RuiBottomSheet, {
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

describe('bottom-sheet', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();
    await nextTick();
    let bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeFalsy();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeTruthy();
    expect(bottomSheet.querySelector('div[class*=_content_]')).toBeTruthy();
    expect(bottomSheet.querySelector('div[class*=_center_]')).toBeFalsy();

    // Click the button that call close function
    const closeButton = bottomSheet.querySelector('#close') as HTMLButtonElement;
    closeButton.click();

    await vi.delay();
    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeFalsy();
    wrapper.unmount();
  });

  it('should pass width and maxWidth props', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    const bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(bottomSheet).toBeTruthy();

    const contentWrapper = bottomSheet.querySelector('div[class*=_content_]') as HTMLDivElement;
    expect(contentWrapper).toBeTruthy();

    expect(contentWrapper.style.width).toBe('98%');
    expect(contentWrapper.style.maxWidth).toBeFalsy();

    await wrapper.setProps({
      maxWidth: '100%',
      width: '500',
    });

    expect(contentWrapper.style.width).toBe('500px');
    expect(contentWrapper.style.maxWidth).toBe('100%');

    wrapper.unmount();
  });

  it('bottom sheet works with `persistent=false`', async () => {
    const wrapper = createWrapper();
    await nextTick();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    let bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(bottomSheet).toBeTruthy();

    // Click on the overlay should close the bottom sheet
    const overlay = bottomSheet.querySelector('div[class*=_overlay_]') as HTMLDivElement;
    overlay.click();

    await vi.delay();
    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeFalsy();

    await vi.delay();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(bottomSheet).toBeTruthy();

    // Press escape should also close the bottom sheet
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    bottomSheet.dispatchEvent(event);

    await vi.delay();
    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeFalsy();

    wrapper.unmount();
  });

  it('bottom sheet works with `persistent=true`', async () => {
    const wrapper = createWrapper({
      propsData: {
        persistent: true,
      },
    });
    await nextTick();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.delay();

    let bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;
    expect(bottomSheet).toBeTruthy();

    // Click on the overlay should not close the bottom sheet
    const overlay = bottomSheet.querySelector('div[class*=_overlay_]') as HTMLDivElement;
    overlay.click();

    await vi.delay();
    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeTruthy();

    // Press escape should not close the bottom sheet
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    bottomSheet.dispatchEvent(event);

    await vi.delay();
    bottomSheet = document.body.querySelector('div[role=dialog]') as HTMLDivElement;

    expect(bottomSheet).toBeTruthy();

    wrapper.unmount();
  });
});
