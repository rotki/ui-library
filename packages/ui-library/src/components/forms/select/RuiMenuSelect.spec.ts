import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { options } from '@/__test__/options';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import { assert } from '@/utils/assert';
import { cleanupElements, expectWrapperToHaveClass, queryAllMenuButtons, queryByRole, queryMenuButton } from '~/tests/helpers/dom-helpers';

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

function createWrapper<TItem>(
  options?: ComponentMountingOptions<typeof RuiMenuSelect<string | undefined, TItem>>,
) {
  const opts: ComponentMountingOptions<typeof RuiMenuSelect<string | undefined, TItem>> = {
    ...options,
    global: {
      stubs: {
        RuiProgress: true,
        TransitionGroup: false,
      },
    },
  };
  return mount(RuiMenuSelect, opts);
}

describe('components/forms/select/RuiMenuSelect.vue', () => {
  let wrapper: ReturnType<typeof createWrapper<any>>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();

    cleanupElements('*', document.body);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expectWrapperToHaveClass(wrapper, 'button[data-id="activator"]', /_activator_/);
    expect(wrapper.find('button[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('should pass props correctly', () => {
    const option4 = options[4];
    assert(option4);
    wrapper = createWrapper({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: option4.id,
        options,
        textAttr: 'label',
      },
    });
    expect(wrapper.find('button[aria-disabled]').exists()).toBeTruthy();
    expect(wrapper.find('button[aria-disabled]').text()).toMatch('Spain');
  });

  it('should work with primitive options', () => {
    const option4 = options[4];
    assert(option4);
    const countryLabels = options.map(item => item.label);
    wrapper = createWrapper({
      props: {
        modelValue: option4.label,
        options: countryLabels,
      },
    });
    expect(wrapper.find('button[data-id=activator]').text()).toMatch('Spain');
  });

  it('should value passed and emitted properly', async () => {
    wrapper = createWrapper({
      props: {
        autoSelectFirst: true,
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    expect(queryByRole('menu')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = queryMenuButton(1);
    assert(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = queryMenuButton(selectedIndex);
    buttonToSelect?.click();
    expect(wrapper.emitted('update:modelValue')).toEqual([[selectedIndex.toString()]]);

    await vi.runAllTimersAsync();
    expect(queryByRole('menu')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    expect(queryByRole('menu')).toBeTruthy();

    await vi.runAllTimersAsync();

    highlightedItemButton = queryMenuButton(selectedIndex);
    assert(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.down');

    highlightedItemButton = queryMenuButton(selectedIndex + 1);
    assert(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.up');
    await wrapper.find('[data-id=activator]').trigger('keydown.up');

    const newSelectedIndex = selectedIndex - 1;

    highlightedItemButton = queryMenuButton(newSelectedIndex);
    assert(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    highlightedItemButton?.click();
    const updates = wrapper.emitted('update:modelValue');
    assert(updates);
    expect(updates).toHaveLength(2);
    expect(updates[1]).toEqual([newSelectedIndex.toString()]);
  });

  it('should show required asterisk when required prop is true', async () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        label: 'Select',
        modelValue: undefined,
        options,
        textAttr: 'label',
        variant: 'outlined',
      },
    });

    // Required asterisk should not be present by default
    expect(wrapper.find('button[data-id="activator"]').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('button[data-id="activator"]').text()).toContain('﹡');
    expect(wrapper.find('button[data-id="activator"] .text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('button[data-id="activator"]').text()).not.toContain('﹡');
  });

  it('should show clear button and emit undefined on click', async () => {
    const option0 = options[0];
    assert(option0);
    wrapper = createWrapper({
      props: {
        clearable: true,
        keyAttr: 'id',
        modelValue: option0.id,
        options,
        textAttr: 'label',
      },
    });

    const clearButton = wrapper.find('[data-id=clear]');
    expect(clearButton.exists()).toBeTruthy();

    await clearButton.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]]);
  });

  it('should not open menu when readOnly', async () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: options[0]!.id,
        options,
        readOnly: true,
        textAttr: 'label',
      },
    });

    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();

    expect(queryByRole('menu')).toBeFalsy();
  });

  it('should render progress indicator when loading', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        loading: true,
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    // RuiProgress is stubbed, so it renders as a stub element
    expect(wrapper.find('rui-progress-stub').exists()).toBeTruthy();
  });

  it('should render error messages', () => {
    wrapper = createWrapper({
      props: {
        errorMessages: ['Required'],
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.text()).toContain('Required');
    expect(wrapper.find('button[data-id="activator"]').attributes('aria-invalid')).toBe('true');
  });

  it('should render success messages', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        successMessages: ['Valid'],
        textAttr: 'label',
      },
    });

    expect(wrapper.text()).toContain('Valid');
  });

  it('should hide messages when hideDetails is true', () => {
    wrapper = createWrapper({
      props: {
        errorMessages: ['Required'],
        hideDetails: true,
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.text()).not.toContain('Required');
  });

  it('should render hint text', () => {
    wrapper = createWrapper({
      props: {
        hint: 'Help text',
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.text()).toContain('Help text');
  });

  it('should show no-data text when options empty', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: undefined,
        noDataText: 'Nothing here',
        options: [],
      },
    });

    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    const menu = queryByRole('menu');
    assert(menu);
    const noData = menu.querySelector('[data-id=no-data]');
    assert(noData);
    expect(noData.textContent).toContain('Nothing here');
  });

  it('should hide no-data when hideNoData is true', async () => {
    wrapper = createWrapper({
      props: {
        hideNoData: true,
        modelValue: undefined,
        options: [],
      },
    });

    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    const menu = queryByRole('menu');
    if (menu) {
      const noData = menu.querySelector('[data-id=no-data]');
      expect(noData).toBeFalsy();
    }
  });

  it('should render outlined variant with fieldset', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
        variant: 'outlined',
      },
    });

    expect(wrapper.find('fieldset').exists()).toBeTruthy();
  });

  it('should apply dense styling', () => {
    wrapper = createWrapper({
      props: {
        dense: true,
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expectWrapperToHaveClass(wrapper, 'button[data-id="activator"]', /_dense_/);
  });

  it('should render aria-expanded attribute', async () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    const activator = wrapper.find('button[data-id="activator"]');
    expect(activator.attributes('aria-expanded')).toBe('false');

    await activator.trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    expect(activator.attributes('aria-expanded')).toBe('true');
  });

  it('should render aria-readonly attribute', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        readOnly: true,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('aria-readonly')).toBe('true');
  });

  it('should render aria-required attribute', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        required: true,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('aria-required')).toBe('true');
  });

  it('should render aria-busy attribute', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        loading: true,
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('aria-busy')).toBe('true');
  });

  it('should render aria-selected on active option', async () => {
    const option0 = options[0];
    assert(option0);
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: option0.id,
        options,
        textAttr: 'label',
      },
    });

    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync();
    await vi.runAllTimersAsync();

    expect(queryByRole('menu')).toBeTruthy();

    const buttons = queryAllMenuButtons();
    const activeButton = buttons[0];
    assert(activeButton);
    expect(activeButton.getAttribute('aria-selected')).toBe('true');

    // Other buttons should have aria-selected="false"
    const otherButton = buttons[1];
    assert(otherButton);
    expect(otherButton.getAttribute('aria-selected')).toBe('false');
  });

  it('should not show clear button when disabled even if clearable', () => {
    const option0 = options[0];
    assert(option0);
    wrapper = createWrapper({
      props: {
        clearable: true,
        disabled: true,
        keyAttr: 'id',
        modelValue: option0.id,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('[data-id=clear]').exists()).toBeFalsy();
  });

  it('should set tabindex to -1 when disabled', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('tabindex')).toBe('-1');
  });

  it('should set tabindex to -1 when readOnly', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        readOnly: true,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('tabindex')).toBe('-1');
  });

  it('should set tabindex to 0 when interactive', () => {
    wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('button[data-id="activator"]').attributes('tabindex')).toBe('0');
  });
});
