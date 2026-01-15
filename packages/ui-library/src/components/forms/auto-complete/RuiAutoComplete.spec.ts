import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { options, type SelectOption } from '@/__test__/options';
import RuiChip from '@/components/chips/RuiChip.vue';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import { assert } from '@/utils/assert';
import {
  assertExists,
  cleanupElements,
  expectWrapperToHaveClass,
  queryAllMenuButtons,
  queryBody,
  queryByRole,
} from '~/tests/helpers/dom-helpers';

function createWrapper<TValue, TItem>(
  options?: ComponentMountingOptions<typeof RuiAutoComplete<TValue, TItem>>,
) {
  const opts: ComponentMountingOptions<typeof RuiAutoComplete<TValue, TItem>> = {
    ...options,
    global: {
      stubs: {
        Transition: false,
        TransitionGroup: false,
      },
    },
  };
  return mount(RuiAutoComplete, opts);
}

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

describe('components/forms/auto-complete/RuiAutoComplete.vue', () => {
  let wrapper: ReturnType<typeof createWrapper<any, any>>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();

    cleanupElements('*', document.body);
    vi.useRealTimers();
  });

  it('should render properly', () => {
    wrapper = createWrapper<string | undefined, SelectOption>({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[data-id="activator"]', /_activator_/);
    expect(wrapper.find('div[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('should pass props correctly', () => {
    const option4 = options[4];
    assert(option4);
    wrapper = createWrapper<string, SelectOption>({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: option4.id,
        options,
        textAttr: 'label',
      },
    });
    expect(wrapper.find('div[data-id=activator][tabindex=-1]').exists()).toBeTruthy();
    expect(wrapper.find<HTMLInputElement>('div[data-id=activator][tabindex=-1] input').element.value).toMatch('Spain');
  });

  it('should work with primitive options', () => {
    const option4 = options[4];
    assert(option4);
    wrapper = createWrapper<string, string>({
      props: {
        modelValue: option4.label,
        options: options.map(item => item.label),
      },
    });
    expect(wrapper.find<HTMLInputElement>('div[data-id=activator] input').element.value).toMatch('Spain');
  });

  it('should pass and emit values properly', async () => {
    const wrapper = createWrapper<string, SelectOption>({
      attachTo: document.body,
      props: {
        autoSelectFirst: true,
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    await wrapper.find('input').trigger('focus');
    await vi.advanceTimersToNextTimerAsync();
    expect(queryByRole('menu')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('focus');
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.advanceTimersToNextTimerAsync();
    expect(queryByRole('menu')).toBeTruthy();

    // Close Menu Select
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.runAllTimersAsync();
    expect(queryByRole('menu')).toBeFalsy();

    // Open Menu Select by Enter
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.advanceTimersToNextTimerAsync();

    expect(queryByRole('menu')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = queryBody<HTMLButtonElement>(`button:first-child`);
    assertExists(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = queryBody<HTMLButtonElement>(`button:nth-child(${selectedIndex})`);
    assertExists(buttonToSelect);
    buttonToSelect.click();
    await vi.advanceTimersToNextTimerAsync();
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([selectedIndex.toString()]);
    expect(document.activeElement?.classList.contains('group')).toBe(true);

    await wrapper.setProps({
      modelValue: selectedIndex.toString(),
    });

    await vi.advanceTimersToNextTimerAsync();
    expect(queryByRole('menu')).toBeFalsy();

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.advanceTimersToNextTimerAsync();
    expect(queryByRole('menu')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runAllTimersAsync(); // Wait for debounce

    expect(queryByRole('menu')).toBeTruthy();

    highlightedItemButton = queryBody<HTMLButtonElement>(`button:nth-child(${selectedIndex})`);
    assertExists(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.down');

    highlightedItemButton = queryBody<HTMLButtonElement>(`button:nth-child(${selectedIndex + 1})`);
    assertExists(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.up');
    await wrapper.find('[data-id=activator]').trigger('keydown.up');

    const newSelectedIndex = selectedIndex - 1;

    highlightedItemButton = queryBody<HTMLButtonElement>(`button:nth-child(${newSelectedIndex})`);
    assertExists(highlightedItemButton);
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.advanceTimersToNextTimerAsync();

    const newSelectedIndexToString = newSelectedIndex.toString();
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([newSelectedIndexToString]);
    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('Greece');
    expect(queryBody('div[role=menu] button')).toBeFalsy();

    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('Greece');

    // Open menu again
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.advanceTimersToNextTimerAsync();

    // Delete option should also remove selected value with that option
    const newOptions = options.filter(item => item.id !== newSelectedIndexToString);

    await wrapper.setProps({
      modelValue: newSelectedIndexToString,
      options: newOptions,
    });
    await vi.advanceTimersToNextTimerAsync();

    // Even if the options changed, the search value should not be touch as long as the menu is still opened, so the UX is not breaking
    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('Greece');
    vi.advanceTimersToNextTimer();

    // Only after the menu is closed, the search value can be reset
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.advanceTimersToNextTimerAsync();

    expect(queryByRole('menu')).toBeFalsy();

    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('');

    // doesn't break when use chips
    await wrapper.setProps({
      chips: true,
    });
  });

  it('should multiple values', async () => {
    wrapper = createWrapper<string[], SelectOption>({
      props: {
        autoSelectFirst: true,
        chips: true,
        keyAttr: 'id',
        modelValue: ['7', '8'],
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('div[data-id=activator]').exists()).toBeTruthy();

    let chips = wrapper.find('div[data-id=activator]').findAllComponents(RuiChip);
    expect(chips).toHaveLength(2);
    expect(chips[0].text()).toBe('France');
    expect(chips[1].text()).toBe('England');

    // Add India
    await wrapper.find('input').setValue('India');
    await vi.runAllTimersAsync();

    expect(document.body.querySelectorAll('button').length).toBe(1);
    const itemButton = queryBody<HTMLButtonElement>('button');
    assertExists(itemButton);
    expect(itemButton.innerHTML).toContain('India');
    itemButton.click();

    await vi.advanceTimersToNextTimerAsync();
    const input = wrapper.find<HTMLInputElement>('div[data-id=activator] input').element;
    expect(input.value).toMatch('');
    expect(input.classList).toContain('h-0');

    let newValue = ['7', '8', '6'];
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).not.toHaveProperty('input');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue]);

    await wrapper.setProps({
      modelValue: newValue,
    });

    chips = wrapper.find('div[data-id=activator]').findAllComponents(RuiChip);
    expect(chips).toHaveLength(3);

    expect(chips[0].text()).toBe('France');
    expect(chips[1].text()).toBe('England');
    expect(chips[2].text()).toBe('India');

    // Delete England
    await chips[0].find('button[type="button"]').trigger('click');
    await vi.advanceTimersToNextTimerAsync();

    newValue = ['8', '6'];
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([newValue]);

    await wrapper.setProps({
      modelValue: newValue,
    });
    const newOptions = options.filter(item => item.id !== '8');

    await wrapper.setProps({
      options: newOptions,
    });
    await vi.advanceTimersToNextTimerAsync();

    newValue = ['6'];
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([newValue]);
  });

  it('should custom value', async () => {
    wrapper = createWrapper<string[], SelectOption>({
      attachTo: document.body,
      props: {
        autoSelectFirst: true,
        chips: true,
        customValue: true,
        hideCustomValue: true,
        keyAttr: 'id',
        modelValue: ['custom value'],
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.find('div[data-id=activator]').exists()).toBeTruthy();
    const chips = wrapper.find('div[data-id=activator]').findAllComponents(RuiChip);
    expect(chips).toHaveLength(1);
    expect(chips[0].text()).toBe('custom value');

    await wrapper.find('input').setValue('German');
    await vi.advanceTimersToNextTimerAsync();

    // The menu is teleported to document.body, so we need to query it there
    expect(queryByRole('menu')).toBeTruthy();

    // Find all buttons in the menu that is specific to this test
    // We need to be more specific to avoid catching buttons from other tests
    let menuButtons = queryAllMenuButtons();

    // Filter only the buttons from the current menu (should contain our search terms)
    let relevantButtons = menuButtons.filter(btn =>
      btn.innerHTML.includes('German') || btn.innerHTML.includes('Germany'),
    );

    expect(relevantButtons.length).toBe(1);

    let firstButton = relevantButtons[0];
    assert(firstButton);
    expect(firstButton.innerHTML).toContain('Germany');

    await wrapper.setProps({ hideCustomValue: false });
    await vi.runAllTimersAsync();

    menuButtons = queryAllMenuButtons();
    relevantButtons = menuButtons.filter(btn => btn.innerHTML.includes('German') || btn.innerHTML.includes('Germany'));

    expect(relevantButtons.length).toBe(2);

    firstButton = relevantButtons[0];
    assert(firstButton);
    expect(firstButton.innerHTML).toContain('German');

    const secondButton = relevantButtons[1];
    assert(secondButton);
    expect(secondButton.innerHTML).toContain('Germany');

    await wrapper.find('input').setValue('Germany');
    await vi.advanceTimersToNextTimerAsync();

    // Re-query buttons after value change
    const updatedMenuButtons = queryAllMenuButtons();
    const updatedRelevantButtons = updatedMenuButtons.filter(btn => btn.innerHTML.includes('Germany'));

    expect(updatedRelevantButtons.length).toBe(1);

    firstButton = updatedRelevantButtons[0];
    assert(firstButton);
    expect(firstButton.innerHTML).toContain('Germany');

    await wrapper.find('input').setValue('German');
    await vi.advanceTimersToNextTimerAsync();

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.advanceTimersToNextTimerAsync();

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[
      'custom value',
      'German',
    ]]);
  });

  it('should hide selected value when search input focused in single select', async () => {
    wrapper = createWrapper<string, SelectOption>({
      attachTo: document.body,
      props: {
        keyAttr: 'id',
        modelValue: '4',
        options,
        textAttr: 'label',
      },
    });

    await vi.advanceTimersToNextTimerAsync();
    const input = wrapper.find<HTMLInputElement>('input');
    expect(input.element.value).toBe('Indonesia');

    await input.trigger('focus');
    await vi.advanceTimersToNextTimerAsync();
    expect(input.element.value).toBe('Indonesia');
    expect(wrapper.find('div.value div.flex').exists()).toBe(false);

    await input.trigger('blur');
    await vi.advanceTimersToNextTimerAsync();
    expect(input.element.value).toBe('Indonesia');
  });

  it('should trigger form submit when pressing enter on activator', async () => {
    const form = document.createElement('form');
    const submitFunc = vi.fn();
    form.onsubmit = submitFunc;

    wrapper = createWrapper<string, SelectOption>({
      attachTo: form,
      props: {
        keyAttr: 'id',
        modelValue: '4',
        options,
        textAttr: 'label',
      },
    });

    await wrapper.find('div[data-id="activator"]').trigger('focus');

    await vi.advanceTimersToNextTimerAsync();
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');

    expect(submitFunc).toBeCalledTimes(1);
  });

  it('should only show placeholder when input is focused', async () => {
    wrapper = createWrapper<string | undefined, SelectOption>({
      attachTo: document.body,
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        placeholder: 'Search...',
        textAttr: 'label',
      },
    });

    const input = wrapper.find<HTMLInputElement>('input');
    const activator = wrapper.find('[data-id=activator]');

    // Placeholder should be empty when not focused
    expect(input.element.placeholder).toBe('');

    // Click on activator to focus the input
    await activator.trigger('click');
    await vi.runAllTimersAsync();

    // Placeholder should now be visible
    expect(input.element.placeholder).toBe('Search...');

    // Blur the input element directly
    input.element.blur();
    await vi.runAllTimersAsync();

    // Placeholder should be empty again
    expect(input.element.placeholder).toBe('');
  });

  it('should show required asterisk when required prop is true', async () => {
    wrapper = createWrapper<string | undefined, SelectOption>({
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
    expect(wrapper.find('div[data-id="activator"]').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('div[data-id="activator"]').text()).toContain('﹡');
    expect(wrapper.find('div[data-id="activator"] .text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('div[data-id="activator"]').text()).not.toContain('﹡');
  });

  it('should hide search input when hideSearchInput is true', async () => {
    wrapper = createWrapper<string | undefined, SelectOption>({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    const input = wrapper.find<HTMLInputElement>('input');

    // Input should be visible by default
    expect(input.classes()).not.toContain('hidden');

    // Set hideSearchInput to true
    await wrapper.setProps({ hideSearchInput: true });
    expect(input.classes()).toContain('hidden');

    // Set hideSearchInput back to false
    await wrapper.setProps({ hideSearchInput: false });
    expect(input.classes()).not.toContain('hidden');
  });

  it('should use contents class instead of flex when hideSelectionWrapper is true', async () => {
    wrapper = createWrapper<string[], SelectOption>({
      props: {
        keyAttr: 'id',
        modelValue: ['7', '8'],
        options,
        textAttr: 'label',
      },
    });

    // Selection wrapper should have flex class by default (multiple mode renders div wrapper)
    const selectionWrapper = wrapper.find('div[data-id="activator"] div[class*=value] > div.flex');
    expect(selectionWrapper.exists()).toBe(true);

    // Set hideSelectionWrapper to true
    await wrapper.setProps({ hideSelectionWrapper: true });
    expect(wrapper.find('div[data-id="activator"] div[class*=value] > div.flex').exists()).toBe(false);
    expect(wrapper.find('div[data-id="activator"] div[class*=value] > div.contents').exists()).toBe(true);

    // Set hideSelectionWrapper back to false
    await wrapper.setProps({ hideSelectionWrapper: false });
    expect(wrapper.find('div[data-id="activator"] div[class*=value] > div.flex').exists()).toBe(true);
    expect(wrapper.find('div[data-id="activator"] div[class*=value] > div.contents').exists()).toBe(false);
  });
});
