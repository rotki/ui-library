import { type ComponentMountingOptions, flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { cleanupElements, expectToHaveClass, queryBody, queryByRole } from '~/tests/helpers/dom-helpers';
import { CLASS_PATTERNS, DATA_ATTRIBUTE_SELECTORS } from '~/tests/helpers/selectors';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTooltip>,
): VueWrapper<InstanceType<typeof RuiTooltip>> {
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

describe('components/overlays/tooltip/RuiTooltip.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiTooltip>>;

  const text = 'Tooltip content';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();

    cleanupElements('[role="tooltip"]');
    vi.runOnlyPendingTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render properly', async () => {
    wrapper = createWrapper({
      props: {
        text,
      },
    });

    await wrapper.trigger('mouseover');

    const tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeTruthy();
  });

  it('should pass props correctly', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });
    expect(wrapper.get('#activator')).toBeTruthy();
    expect(queryByRole('tooltip')).toBeFalsy();
  });

  it('should not trigger tooltip when disabled', async () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });

    await wrapper.trigger('mouseover');

    let tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeFalsy();
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeFalsy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');

    tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeTruthy();
  });

  it('should tooltip only appears after `openDelay` timeout', async () => {
    wrapper = createWrapper({
      props: {
        closeDelay: 50000,
        openDelay: 400,
        text,
      },
    });

    await wrapper.trigger('mouseover');

    const tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeTruthy();

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
  });

  it('should tooltip disappears after `closeDelay` timeout', async () => {
    expect(queryByRole('tooltip')).toBeFalsy();
    wrapper = createWrapper({
      props: {
        closeDelay: 500,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(1);
    await flushPromises();

    let tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeTruthy();

    await wrapper.trigger('mouseleave');

    tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.POPPER_PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.POPPER_ARROW)).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    vi.advanceTimersByTime(600);
    await flushPromises();
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });

  it('should tooltip appears on focus and disappears on blur', async () => {
    wrapper = createWrapper({
      props: {
        text,
      },
    });

    // Initially no tooltip
    expect(queryByRole('tooltip')).toBeFalsy();

    // Focus on the activator button
    await wrapper.trigger('focusin');
    vi.advanceTimersByTime(1);
    await flushPromises();

    const tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip).toBeTruthy();
    expectToHaveClass(tooltip, CLASS_PATTERNS.TOOLTIP);
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Blur should close the tooltip
    await wrapper.trigger('focusout');
    vi.advanceTimersByTime(600);
    await flushPromises(); // Wait for closeDelay

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });

  it('should tooltip respects openDelay and closeDelay for focus events', async () => {
    wrapper = createWrapper({
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
  });

  it('should keep tooltip open when triggered by both hover and focus', async () => {
    wrapper = createWrapper({
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

    let tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Mouse leaves but focus remains - tooltip should stay
    await wrapper.trigger('mouseleave');
    vi.advanceTimersByTime(100);
    await flushPromises(); // Small delay to ensure event is processed

    tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip).toBeTruthy();
    expect(document.body.innerHTML).toMatch(new RegExp(text));

    // Now blur - tooltip should close after closeDelay
    await wrapper.trigger('focusout');
    vi.advanceTimersByTime(600);
    await flushPromises();

    expect(document.body.innerHTML).not.toMatch(new RegExp(text));
  });
});
