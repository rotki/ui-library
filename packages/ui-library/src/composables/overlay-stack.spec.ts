import { mount } from '@vue/test-utils';
import { get } from '@vueuse/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { resetOverlayStack, useDismissableOverlay, useOverlayStack } from '@/composables/overlay-stack';

/**
 * Runs a composable inside a component, so it gets the scope its cleanup hangs
 * off.
 *
 * @param composable - the composable to run
 * @returns a way to unmount the component holding it
 */
function withSetup(composable: () => void): { unmount: () => void } {
  const wrapper = mount(defineComponent({
    setup() {
      composable();
      return () => h('div');
    },
  }));

  return { unmount: () => wrapper.unmount() };
}

describe('composables/overlay-stack', () => {
  afterEach(() => {
    resetOverlayStack();
  });

  it('should report nothing covering the page to begin with', () => {
    const { hasOverlay, dismissTop } = useOverlayStack();

    expect(get(hasOverlay)).toBe(false);
    expect(dismissTop()).toBe(false);
  });

  it('should dismiss the layer that opened last, not the one built last', async () => {
    const order: string[] = [];
    const first = ref<boolean>(false);
    const second = ref<boolean>(false);

    // built first, opened second
    withSetup(() => useDismissableOverlay(first, () => order.push('first')));
    withSetup(() => useDismissableOverlay(second, () => order.push('second')));

    second.value = true;
    await nextTick();
    first.value = true;
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    expect(order).toEqual(['first']);
  });

  it('should keep a layer that declines, so the gesture stays swallowed', async () => {
    const open = ref<boolean>(true);
    const dismiss = vi.fn();

    withSetup(() => useDismissableOverlay(open, dismiss));
    await nextTick();

    const { dismissTop, hasOverlay } = useOverlayStack();

    expect(dismissTop()).toBe(true);
    expect(dismissTop()).toBe(true);
    expect(dismiss).toHaveBeenCalledTimes(2);
    expect(get(hasOverlay)).toBe(true);
  });

  it('should skip a layer that has closed but not yet left the list', async () => {
    const outer = ref<boolean>(true);
    const inner = ref<boolean>(true);
    const outerDismiss = vi.fn();

    withSetup(() => useDismissableOverlay(outer, outerDismiss));
    withSetup(() => useDismissableOverlay(inner, () => {
      inner.value = false;
    }));
    await nextTick();

    const { dismissTop } = useOverlayStack();

    // the inner layer closes itself, but its watcher has not run yet
    expect(dismissTop()).toBe(true);
    expect(outerDismiss).not.toHaveBeenCalled();

    // the very next gesture must reach the outer one rather than the closed inner one
    expect(dismissTop()).toBe(true);
    expect(outerDismiss).toHaveBeenCalledTimes(1);
  });

  it('should count what is showing rather than what is registered', async () => {
    const open = ref<boolean>(true);
    withSetup(() => useDismissableOverlay(open, () => {}));
    await nextTick();

    const { hasOverlay } = useOverlayStack();
    expect(get(hasOverlay)).toBe(true);

    open.value = false;
    expect(get(hasOverlay)).toBe(false);
  });

  it('should drop a layer whose component is torn down without closing', async () => {
    const open = ref<boolean>(true);
    const { unmount } = withSetup(() => useDismissableOverlay(open, () => {}));
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);

    unmount();
    expect(dismissTop()).toBe(false);
  });

  it('should register a layer that is already open when it is declared', () => {
    const dismiss = vi.fn();
    withSetup(() => useDismissableOverlay(ref(true), dismiss));

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('should take a getter as well as a ref', async () => {
    const state = ref<{ open: boolean }>({ open: false });
    const dismiss = vi.fn();

    withSetup(() => useDismissableOverlay(() => state.value.open, dismiss));
    state.value = { open: true };
    await nextTick();

    const { dismissTop, hasOverlay } = useOverlayStack();
    expect(get(hasOverlay)).toBe(true);
    expect(dismissTop()).toBe(true);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('should re-register on a second open, back on top of the stack', async () => {
    const lower = ref<boolean>(true);
    const upper = ref<boolean>(true);
    const lowerDismiss = vi.fn();
    const upperDismiss = vi.fn();

    withSetup(() => useDismissableOverlay(lower, lowerDismiss));
    withSetup(() => useDismissableOverlay(upper, upperDismiss));
    await nextTick();

    upper.value = false;
    await nextTick();
    upper.value = true;
    await nextTick();

    const { dismissTop } = useOverlayStack();
    dismissTop();

    expect(upperDismiss).toHaveBeenCalledTimes(1);
    expect(lowerDismiss).not.toHaveBeenCalled();
  });
});
