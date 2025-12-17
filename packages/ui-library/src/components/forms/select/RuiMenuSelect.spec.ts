import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { options } from '@/__test__/options';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import { assert } from '@/utils/assert';
import { cleanupElements, expectWrapperToHaveClass, queryByRole, queryMenuButton } from '~/tests/helpers/dom-helpers';

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
});
