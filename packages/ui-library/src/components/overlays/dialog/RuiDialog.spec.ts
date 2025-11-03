import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';
import { assertExists, cleanupElements, queryByRole } from '~/tests/helpers/dom-helpers';

const text = 'This is content';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiDialog>,
): VueWrapper<InstanceType<typeof RuiDialog>> {
  return mount(RuiDialog, {
    ...options,
    global: {
      components: { RuiButton },
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

describe('components/overlays/dialog/RuiDialog.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiDialog>>;

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
    let dialog = queryByRole<HTMLDivElement>('dialog');

    expect(dialog).toBeFalsy();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    dialog = queryByRole<HTMLDivElement>('dialog');

    assertExists(dialog);
    expect(dialog.querySelector('div[class*=_content_]')).toBeTruthy();
    expect(dialog.querySelector('div[class*=_center_]')).toBeTruthy();

    // Click the button that call close function
    const closeButton = dialog.querySelector<HTMLButtonElement>('#close');
    assertExists(closeButton);
    closeButton.click();

    await vi.runAllTimersAsync();
    dialog = queryByRole<HTMLDivElement>('dialog');

    expect(dialog).toBeFalsy();
  });

  it('should pass width and maxWidth props', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const dialog = queryByRole<HTMLDivElement>('dialog');
    assertExists(dialog);

    const contentWrapper = dialog.querySelector<HTMLDivElement>('div[class*=_content_]');
    assertExists(contentWrapper);

    expect(contentWrapper.style.width).toBe('98%');
    expect(contentWrapper.style.maxWidth).toBeFalsy();

    await wrapper.setProps({
      maxWidth: '100%',
      width: '500',
    });

    expect(contentWrapper.style.width).toBe('500px');
    expect(contentWrapper.style.maxWidth).toBe('100%');
  });

  it('should dialog works with `persistent=false`', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    let dialog = queryByRole<HTMLDivElement>('dialog');
    assertExists(dialog);

    // Click on the overlay should close the dialog
    const overlay = dialog.querySelector<HTMLDivElement>('div[class*=_overlay_]');
    assertExists(overlay);
    overlay.click();

    await vi.runAllTimersAsync();
    dialog = queryByRole<HTMLDivElement>('dialog');

    expect(dialog).toBeFalsy();

    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    dialog = queryByRole<HTMLDivElement>('dialog');
    assertExists(dialog);

    // Press escape should also close the dialog
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.dispatchEvent(event);

    await vi.runAllTimersAsync();
    dialog = queryByRole<HTMLDivElement>('dialog');

    expect(dialog).toBeFalsy();
  });

  it('should dialog works with `persistent=true`', async () => {
    wrapper = createWrapper({
      props: {
        persistent: true,
      },
    });
    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let dialog = queryByRole<HTMLDivElement>('dialog');
    assertExists(dialog);

    // Click on the overlay should not close the dialog
    const overlay = dialog.querySelector<HTMLDivElement>('div[class*=_overlay_]');
    assertExists(overlay);
    overlay.click();

    await vi.runAllTimersAsync();
    dialog = queryByRole<HTMLDivElement>('dialog');

    assertExists(dialog);

    // Press escape should not close the dialog
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.dispatchEvent(event);

    await vi.runAllTimersAsync();
    dialog = queryByRole<HTMLDivElement>('dialog');

    assertExists(dialog);
  });

  it('should click:outside and click:esc emitted', async () => {
    const clickOutsideFunc = vi.fn();
    const clickEscFunc = vi.fn();

    wrapper = createWrapper({
      props: {
        'onClick:esc': clickEscFunc,
        'onClick:outside': clickOutsideFunc,
      },
    });

    await vi.runAllTimersAsync();

    // Open dialog by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const dialog = queryByRole<HTMLDivElement>('dialog');
    assertExists(dialog);

    // Click on the overlay should not close the dialog
    const overlay = dialog.querySelector<HTMLDivElement>('div[class*=_overlay_]');
    assertExists(overlay);

    overlay.click();
    await vi.runAllTimersAsync();

    expect(clickOutsideFunc).toHaveBeenCalledOnce();

    // Press escape should not close the dialog
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    dialog.dispatchEvent(event);

    expect(clickEscFunc).toHaveBeenCalledOnce();
  });
});
