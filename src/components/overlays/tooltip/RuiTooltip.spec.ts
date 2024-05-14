import { describe, expect, it, vi } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';

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

  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        text,
      },
    });

    await wrapper.trigger('mouseover');
    await vi.delay();

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
    await vi.delay();

    let tooltip = document.body.querySelector('div[role=tooltip]');

    expect(tooltip).toBeFalsy();
    expect(
      document.body.querySelector('div[data-popper-placement=bottom]'),
    ).toBeFalsy();
    expect(tooltip?.querySelector('span[data-popper-arrow]')).toBeFalsy();
    await wrapper.setProps({ disabled: false });

    await wrapper.trigger('mouseover');
    await vi.delay();

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
    await vi.delay();

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
    await vi.delay(100);
    await wrapper.trigger('mouseleave');
    await vi.delay(500);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await vi.delay(100);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    await wrapper.trigger('mouseover');
    await vi.delay(350);
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
    await vi.delay();

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

    await vi.delay(600);
    expect(document.body.innerHTML).not.toMatch(new RegExp(text));

    wrapper.unmount();
  });
});
