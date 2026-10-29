import { autoUpdate } from '@floating-ui/dom';
import { type ComponentMountingOptions, flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { useFloating } from '@/composables/floating';
import { cleanupElements, queryBody, queryByRole } from '~/tests/helpers/dom-helpers';
import { DATA_ATTRIBUTE_SELECTORS } from '~/tests/helpers/selectors';

vi.mock('@floating-ui/dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/dom')>();
  return { ...actual, autoUpdate: vi.fn(actual.autoUpdate) };
});

vi.mock('@/composables/floating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/composables/floating')>();
  return { ...actual, useFloating: vi.fn(actual.useFloating) };
});

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

/** Hovers the activator and lets the open timer run, which is when the tooltip takes its role. */
async function hover(target: VueWrapper<InstanceType<typeof RuiTooltip>>): Promise<void> {
  await target.trigger('mouseover');
  vi.advanceTimersByTime(1);
  await flushPromises();
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

    await hover(wrapper);

    const tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.ARROW)).toBeTruthy();
  });

  it('should wrap at the token width unless the consumer sets its own', async () => {
    wrapper = createWrapper({ props: { text } });
    await hover(wrapper);

    let tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip?.classList.contains('max-w-rui-tooltip')).toBe(true);
    expect(tooltip?.classList.contains('z-rui-tooltip')).toBe(true);

    wrapper.unmount();
    cleanupElements('[role="tooltip"]');

    wrapper = createWrapper({ props: { text, classNames: { tooltip: 'max-w-40' } } });
    await hover(wrapper);

    tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip?.classList.contains('max-w-40')).toBe(true);
    expect(tooltip?.classList.contains('max-w-rui-tooltip')).toBe(false);
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
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeFalsy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.ARROW)).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await hover(wrapper);

    tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.ARROW)).toBeTruthy();
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

    // nothing is announced as a tooltip while the delay runs: it would be a tooltip without text
    expect(queryByRole('tooltip')).toBeFalsy();

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
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.ARROW)).toBeTruthy();

    await wrapper.trigger('mouseleave');

    tooltip = queryByRole<HTMLDivElement>('tooltip');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(queryBody(DATA_ATTRIBUTE_SELECTORS.PLACEMENT_BOTTOM)).toBeTruthy();
    expect(tooltip?.querySelector(DATA_ATTRIBUTE_SELECTORS.ARROW)).toBeTruthy();
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
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
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

  it('should have aria-describedby on activator when tooltip is visible', async () => {
    wrapper = createWrapper({
      props: {
        text,
      },
    });

    // Initially no aria-describedby
    const wrapperEl = wrapper.element as HTMLElement;
    expect(wrapperEl.getAttribute('aria-describedby')).toBeNull();

    // Open tooltip
    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(1);
    await flushPromises();

    // Should have aria-describedby linking to tooltip
    const describedBy = wrapperEl.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    // The tooltip element should have a matching id
    const tooltip = queryByRole<HTMLDivElement>('tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.id).toBe(describedBy);

    // Close tooltip
    await wrapper.trigger('mouseleave');
    vi.advanceTimersByTime(600);
    await flushPromises();

    // aria-describedby should be removed
    expect(wrapperEl.getAttribute('aria-describedby')).toBeNull();
  });

  it('should not have aria-describedby when disabled', async () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        text,
      },
    });

    await wrapper.trigger('mouseover');
    vi.advanceTimersByTime(1);
    await flushPromises();

    const wrapperEl = wrapper.element as HTMLElement;
    expect(wrapperEl.getAttribute('aria-describedby')).toBeNull();
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
  describe('setup on first use', () => {
    beforeEach(() => {
      vi.mocked(useFloating).mockClear();
      vi.mocked(autoUpdate).mockClear();
    });

    it('should set up nothing at mount, and nothing in the body', () => {
      const bodyNodes = document.body.childNodes.length;
      wrapper = createWrapper({ props: { text } });

      expect(useFloating).not.toHaveBeenCalled();
      expect(document.body.childNodes).toHaveLength(bodyNodes);
    });

    it.each(['mouseover', 'focusin'])('should set up once on the first %s', async (event) => {
      wrapper = createWrapper({ props: { text } });

      await wrapper.trigger(event);
      vi.advanceTimersByTime(1);
      await flushPromises();
      await wrapper.trigger(event);

      expect(useFloating).toHaveBeenCalledTimes(1);
      expect(queryByRole('tooltip')).toBeTruthy();
    });

    it('should keep the activator and its markup across setup', async () => {
      wrapper = createWrapper({ props: { closeDelay: 0, text } });
      const root = wrapper.element as HTMLElement;
      const trigger = root.querySelector('#activator');
      /** The root's attributes and its child elements: only the teleport's placeholder comments change once it is set up. */
      const markup = (): string[] => [
        ...root.getAttributeNames().map(name => `${name}="${root.getAttribute(name)}"`),
        ...Array.from(root.children, child => child.outerHTML),
      ];
      const before = markup();

      await hover(wrapper);
      expect(markup()).not.toEqual(before);

      await wrapper.trigger('mouseleave');
      vi.runAllTimers();
      await flushPromises();

      expect(useFloating).toHaveBeenCalledTimes(1);
      expect(wrapper.element).toBe(root);
      expect(root.querySelector('#activator')).toBe(trigger);
      expect(markup()).toEqual(before);
    });

    it('should not set up a disabled tooltip', async () => {
      wrapper = createWrapper({ props: { disabled: true, text } });

      await wrapper.trigger('mouseover');
      await wrapper.trigger('focusin');
      wrapper.vm.onOpen(true);

      expect(useFloating).not.toHaveBeenCalled();
    });

    it('should open from the exposed onOpen before any hover', async () => {
      wrapper = createWrapper({ props: { text } });

      wrapper.vm.onOpen(true);
      vi.advanceTimersByTime(1);
      await flushPromises();

      expect(queryByRole('tooltip')).toBeTruthy();
    });

    it('should not set up for the exposed onClose', () => {
      wrapper = createWrapper({ props: { text } });

      wrapper.vm.onClose(true);

      expect(useFloating).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    });

    it('should keep the tooltip positioned against its activator', async () => {
      wrapper = createWrapper({ props: { text } });

      await hover(wrapper);

      const tooltip = queryByRole('tooltip');
      expect(autoUpdate).toHaveBeenCalledWith(wrapper.element, tooltip, expect.any(Function), undefined);
    });

    it('should stop positioning on unmount after a late setup', async () => {
      const stopAutoUpdate = vi.fn();
      vi.mocked(autoUpdate).mockImplementationOnce(() => stopAutoUpdate);
      wrapper = createWrapper({ props: { text } });

      await hover(wrapper);
      wrapper.unmount();

      expect(stopAutoUpdate).toHaveBeenCalled();
    });

    /** Sends every trigger event to an activator whose tooltip has unmounted. */
    function useAfterUnmount(root: HTMLElement): void {
      for (const event of ['mouseover', 'mouseleave'])
        root.dispatchEvent(new MouseEvent(event, { bubbles: true }));
      for (const event of ['focusin', 'focusout'])
        root.dispatchEvent(new FocusEvent(event, { bubbles: true }));
    }

    it('should start nothing from events that reach an unused activator after unmount', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      wrapper = createWrapper({ props: { text } });
      const root = wrapper.element as HTMLElement;
      wrapper.unmount();

      useAfterUnmount(root);

      expect(useFloating).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
      expect(warn).not.toHaveBeenCalled();
    });

    it('should start nothing from events that reach a used activator after unmount', async () => {
      wrapper = createWrapper({ props: { text } });
      const root = wrapper.element as HTMLElement;
      await hover(wrapper);
      vi.runAllTimers();
      wrapper.unmount();

      useAfterUnmount(root);

      expect(useFloating).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
