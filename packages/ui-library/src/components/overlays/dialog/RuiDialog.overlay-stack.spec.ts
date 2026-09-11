import { mount } from '@vue/test-utils';
import { get } from '@vueuse/shared';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import RuiBottomSheet from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';
import { resetOverlayStack, useOverlayStack } from '@/composables/overlay-stack';
import { cleanupElements } from '~/tests/helpers/dom-helpers';

describe('components/overlays/dialog/RuiDialog.vue overlay stack', () => {
  afterEach(() => {
    resetOverlayStack();
    cleanupElements('*', document.body);
  });

  it('should put an open dialog in the stack and take it out again', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: false },
      slots: { default: '<p>content</p>' },
    });
    const { hasOverlay } = useOverlayStack();

    expect(get(hasOverlay)).toBe(false);

    await wrapper.setProps({ modelValue: true });
    expect(get(hasOverlay)).toBe(true);

    await wrapper.setProps({ modelValue: false });
    expect(get(hasOverlay)).toBe(false);

    wrapper.unmount();
  });

  it('should close on dismissal and say so', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);

    wrapper.unmount();
  });

  it('should refuse while persistent, and still swallow the gesture', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true, persistent: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    wrapper.unmount();
  });

  it('should stay in the stack when it turns persistent partway through', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true, persistent: false },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    await wrapper.setProps({ persistent: true });

    const { dismissTop, hasOverlay } = useOverlayStack();
    expect(get(hasOverlay)).toBe(true);
    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    wrapper.unmount();
  });

  it('should reach a bottom sheet through the dialog it wraps', async () => {
    const wrapper = mount(RuiBottomSheet, {
      props: { modelValue: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop, hasOverlay } = useOverlayStack();
    expect(get(hasOverlay)).toBe(true);

    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(wrapper.findComponent(RuiDialog).emitted('dismiss')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(get(hasOverlay)).toBe(false);

    wrapper.unmount();
  });

  it('should let go of the stack the moment it closes, not when it finishes leaving', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop, hasOverlay } = useOverlayStack();
    await wrapper.setProps({ modelValue: false });

    /**
     * A closing dialog is on its way out rather than covering the page, so it holds the
     * stack no longer than `modelValue` says. How that overlaps its leave transition is
     * not observable here: happy-dom runs no CSS, so Vue resolves the leave at once.
     */
    expect(get(hasOverlay)).toBe(false);
    expect(dismissTop()).toBe(false);

    wrapper.unmount();
  });

  it('should keep escape and dismissal apart, so neither fires the other', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    dismissTop();
    await nextTick();

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    expect(wrapper.emitted('click:esc')).toBeUndefined();
    expect(wrapper.emitted('click:outside')).toBeUndefined();

    wrapper.unmount();
  });

  it('should keep handing gestures to a refusing dialog rather than the one underneath', async () => {
    const lower = mount(RuiDialog, { props: { modelValue: true }, slots: { default: '<p>lower</p>' } });
    await nextTick();
    const upper = mount(RuiDialog, {
      props: { modelValue: true, persistent: true },
      slots: { default: '<p>upper</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();

    expect(dismissTop()).toBe(true);
    await nextTick();
    expect(upper.emitted('dismiss')).toHaveLength(1);

    // A persistent dialog never closes, so it never leaves the stack to be passed
    expect(dismissTop()).toBe(true);
    await nextTick();
    expect(upper.emitted('dismiss')).toHaveLength(2);
    expect(lower.emitted('dismiss')).toBeUndefined();

    upper.unmount();
    lower.unmount();
  });

  it('should hand a bottom sheet consumer the dismissal through attribute fallthrough', async () => {
    const wrapper = mount(RuiBottomSheet, {
      props: { modelValue: true, persistent: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(wrapper.findComponent(RuiDialog).emitted('dismiss')).toHaveLength(1);
    expect(wrapper.props('modelValue')).toBe(true);

    wrapper.unmount();
  });

  it('should leave the stack when the dialog is torn down while open', async () => {
    const wrapper = mount(RuiDialog, {
      props: { modelValue: true },
      slots: { default: '<p>content</p>' },
    });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);

    wrapper.unmount();
    expect(dismissTop()).toBe(false);
  });

  it('should reach the dialog that opened last', async () => {
    const lower = mount(RuiDialog, { props: { modelValue: true }, slots: { default: '<p>lower</p>' } });
    await nextTick();
    const upper = mount(RuiDialog, { props: { modelValue: true }, slots: { default: '<p>upper</p>' } });
    await nextTick();

    const { dismissTop } = useOverlayStack();
    expect(dismissTop()).toBe(true);
    await nextTick();

    expect(upper.emitted('dismiss')).toHaveLength(1);
    expect(lower.emitted('dismiss')).toBeUndefined();

    upper.unmount();
    lower.unmount();
  });
});
