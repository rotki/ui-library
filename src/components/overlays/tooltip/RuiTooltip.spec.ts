import { type ComponentMountingOptions, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiTooltip>) {
  return mount(RuiTooltip, {
    ...options,
    global: {
      stubs: { 'rui-button': RuiButton },
    },
    slots: {
      activator: '<rui-button id="activator">Tooltip trigger</rui-button>',
      default: options?.props?.text ?? '',
    },
  });
}

describe('tooltip', () => {
  const text = 'Tooltip content';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    // Clean up any tooltips that might be left in DOM
    const tooltips = document.querySelectorAll('[role="tooltip"]');
    tooltips.forEach(tooltip => tooltip.remove());
  });

  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        text,
      },
    });

    await wrapper.trigger('mouseover');

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.unmount();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });
    expect(wrapper.get('#activator')).toBeTruthy();
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();
    wrapper.unmount();
  });

  it('disabled does not trigger tooltip', async () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });

    await wrapper.trigger('mouseover');

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    wrapper.unmount();
  });

  it('tooltip only appears after `openDelay` timeout', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 50000,
        openDelay: 400,
        text,
      },
    });

    await wrapper.trigger('mouseover');

    const tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    // Tooltip shouldn't appear if the mouseleave happens before the timer ends.
    vi.advanceTimersByTime(100);
    await flushPromises();
    await wrapper.trigger('mouseleave');
    vi.advanceTimersByTime(500);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(100);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(350);
    await flushPromises();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    wrapper.unmount();
  });

  it('tooltip disappears after `closeDelay` timeout', async () => {
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();
    const wrapper = createWrapper({
      props: {
        closeDelay: 500,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(1);
    await flushPromises();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();

    await wrapper.trigger('mouseleave');

    tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeTruthy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    vi.advanceTimersByTime(600);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });

  it('tooltip appears on focus and disappears on blur', async () => {
    const wrapper = createWrapper({
      props: {
        text,
      },
    });

    // Initially no tooltip
    expect(document.body.querySelector('div[role=tooltip]')).toBeFalsy();

    // Focus on the activator button
    await wrapper.trigger('focusin');
    vi.advanceTimersByTime(1);
    await flushPromises();

    const tooltip = document.body.querySelector('div[role=tooltip]');
    expect(tooltip).toBeTruthy();
    expect(Array.from(tooltip?.classList ?? [])).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tooltip_/)]),
    );
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Blur should close the tooltip
    await wrapper.trigger('focusout');
    vi.advanceTimersByTime(600);
    await flushPromises(); // Wait for closeDelay

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });

  it('tooltip respects openDelay and closeDelay for focus events', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 500,
        openDelay: 400,
        text,
      },
    });

    // Focus and wait for openDelay
    await wrapper.trigger('focusin');
    vi.advanceTimersByTime(100);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    vi.advanceTimersByTime(350);
    await flushPromises();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Blur and check closeDelay
    await wrapper.trigger('focusout');
    vi.advanceTimersByTime(100);
    await flushPromises();
    expect(document.body.innerHTML).toMatch(new RegExp(text)); // Still visible

    vi.advanceTimersByTime(500);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text)); // Now hidden

    wrapper.unmount();
  });

  it('tooltip stays open when triggered by both hover and focus', async () => {
    const wrapper = createWrapper({
      props: {
        closeDelay: 500,
        openDelay: 0,
        text,
      },
    });

    // Trigger both mouseover and focus
    await wrapper.trigger('mouseover');
    await wrapper.trigger('focusin');
    vi.advanceTimersByTime(100);
    await flushPromises();

    let tooltip = document.body.querySelector('div[role=tooltip]');
    expect(tooltip).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Mouse leaves but focus remains - tooltip should stay
    await wrapper.trigger('mouseleave');
    vi.advanceTimersByTime(100);
    await flushPromises(); // Small delay to ensure event is processed

    tooltip = document.body.querySelector('div[role=tooltip]');
    expect(tooltip).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Now blur - tooltip should close after closeDelay
    await wrapper.trigger('focusout');
    vi.advanceTimersByTime(600);
    await flushPromises();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });
});
