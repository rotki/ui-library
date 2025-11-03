import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiBottomSheet from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import { assertExists, cleanupElements, queryByRole } from '~/tests/helpers/dom-helpers';

const text = 'This is content';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiBottomSheet>,
): VueWrapper<InstanceType<typeof RuiBottomSheet>> {
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

describe('components/overlays/bottom-sheet/RuiBottomSheet.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiBottomSheet>>;

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
    let bottomSheet = queryByRole<HTMLDivElement>('dialog');

    expect(bottomSheet).toBeFalsy();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    assertExists(bottomSheet);
    expect(bottomSheet.querySelector('div[class*=_content_]')).toBeTruthy();
    expect(bottomSheet.querySelector('div[class*=_center_]')).toBeFalsy();

    // Click the button that call close function
    const closeButton = bottomSheet.querySelector<HTMLButtonElement>('#close');
    assertExists(closeButton);
    closeButton.click();

    await vi.runAllTimersAsync();
    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    expect(bottomSheet).toBeFalsy();
  });

  it('should pass width and maxWidth props', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    const bottomSheet = queryByRole<HTMLDivElement>('dialog');
    assertExists(bottomSheet);

    const contentWrapper = bottomSheet.querySelector<HTMLDivElement>('div[class*=_content_]');
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

  it('should bottom sheet works with `persistent=false`', async () => {
    wrapper = createWrapper();
    await vi.runAllTimersAsync();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let bottomSheet = queryByRole<HTMLDivElement>('dialog');
    assertExists(bottomSheet);

    // Click on the overlay should close the bottom sheet
    const overlay = bottomSheet.querySelector<HTMLDivElement>('div[class*=_overlay_]');
    assertExists(overlay);
    overlay.click();

    await vi.runAllTimersAsync();
    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    expect(bottomSheet).toBeFalsy();

    await vi.runAllTimersAsync();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    bottomSheet = queryByRole<HTMLDivElement>('dialog');
    assertExists(bottomSheet);

    // Press escape should also close the bottom sheet
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    bottomSheet.dispatchEvent(event);

    await vi.runAllTimersAsync();
    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    expect(bottomSheet).toBeFalsy();
  });

  it('should bottom sheet works with `persistent=true`', async () => {
    wrapper = createWrapper({
      props: {
        persistent: true,
      },
    });
    await vi.runAllTimersAsync();

    // Open bottom sheet by clicking activator
    await wrapper.find('#trigger').trigger('click');
    await vi.runAllTimersAsync();

    let bottomSheet = queryByRole<HTMLDivElement>('dialog');
    assertExists(bottomSheet);

    // Click on the overlay should not close the bottom sheet
    const overlay = bottomSheet.querySelector<HTMLDivElement>('div[class*=_overlay_]');
    assertExists(overlay);
    overlay.click();

    await vi.runAllTimersAsync();
    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    assertExists(bottomSheet);

    // Press escape should not close the bottom sheet
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    bottomSheet.dispatchEvent(event);

    await vi.runAllTimersAsync();
    bottomSheet = queryByRole<HTMLDivElement>('dialog');

    assertExists(bottomSheet);
  });
});
