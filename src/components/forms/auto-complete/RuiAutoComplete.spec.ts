import { options, type SelectOption } from '@/__test__/options';
import RuiChip from '@/components/chips/RuiChip.vue';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

function createWrapper<
  TValue,
  TItem,
>(options?: ComponentMountingOptions<typeof RuiAutoComplete<TValue, TItem>>) {
  const opts: ComponentMountingOptions<typeof RuiAutoComplete<TValue, TItem>> = {
    ...options,
    global: {
      stubs: {
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

afterEach(() => {
  document.body.innerHTML = '';
});

describe('autocomplete', () => {
  it('renders properly', () => {
    const wrapper = createWrapper<string | undefined, SelectOption>({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.get('div[data-id="activator"]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_activator_/)]),
    );
    expect(wrapper.find('div[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper<string, SelectOption>({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: options[4].id,
        options,
        textAttr: 'label',
      },
    });
    expect(wrapper.find('div[data-id=activator][tabindex=-1]').exists()).toBeTruthy();
    expect((wrapper.find('div[data-id=activator][tabindex=-1] input').element as HTMLInputElement).value).toMatch('Spain');
  });

  it('works with primitive options', () => {
    const wrapper = createWrapper<string, string>({
      props: {
        modelValue: options[4].label,
        options: options.map(item => item.label),
      },
    });
    expect((wrapper.find('div[data-id=activator] input').element as HTMLInputElement).value).toMatch('Spain');
  });

  it('value passed and emitted properly', async () => {
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
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('focus');
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    // Close Menu Select
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.delay();
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select by Enter
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = document.body.querySelector(`button:first-child`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    buttonToSelect?.click();
    await vi.delay();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([selectedIndex.toString()]);
    expect(document.activeElement?.classList.contains('group')).toBe(true);

    await wrapper.setProps({
      modelValue: selectedIndex.toString(),
    });

    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Shouldn't open menu select because the value has been set
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await nextTick();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    highlightedItemButton = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.down');

    highlightedItemButton = document.body.querySelector(`button:nth-child(${selectedIndex + 1})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.up');
    await wrapper.find('[data-id=activator]').trigger('keydown.up');

    const newSelectedIndex = selectedIndex - 1;

    highlightedItemButton = document.body.querySelector(`button:nth-child(${newSelectedIndex})`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    const newSelectedIndexToString = newSelectedIndex.toString();
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([newSelectedIndexToString]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Open menu again
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();

    // Delete option should also remove selected value with that option
    const newOptions = options.filter(item => item.id !== newSelectedIndexToString);

    await wrapper.setProps({
      modelValue: newSelectedIndexToString,
      options: newOptions,
    });
    await nextTick();

    // Even if the options changed, the search value should not be touch as long as the menu is still opened, so the UX is not breaking
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Only after the menu is closed, the search value can be reset
    await wrapper.find('[data-id=activator]').trigger('keydown.esc');
    await vi.delay();

    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');

    // doesn't break when use chips
    await wrapper.setProps({
      chips: true,
    });
  });

  it('multiple values', async () => {
    const wrapper = createWrapper<string[], SelectOption>({
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
    await vi.delay();

    expect(document.body.querySelectorAll('button').length).toBe(1);
    const itemButton = document.body.querySelector('button')!;
    expect(itemButton.innerHTML).toContain('India');
    itemButton.click();

    await nextTick();
    const input = wrapper.find('div[data-id=activator] input').element as HTMLInputElement;
    expect(input.value).toMatch('');
    expect(input.classList).toContain('h-0');

    let newValue = ['7', '8', '6'];
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
    await nextTick();

    newValue = ['8', '6'];
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([newValue]);

    await wrapper.setProps({
      modelValue: newValue,
    });
    const newOptions = options.filter(item => item.id !== '8');

    await wrapper.setProps({
      options: newOptions,
    });
    await nextTick();

    newValue = ['6'];
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([newValue]);
  });

  it('custom value', async () => {
    const wrapper = createWrapper<string[], SelectOption>({
      attachTo: document.body,
      props: {
        autoSelectFirst: true,
        chips: true,
        customValue: true,
        hideCustomValueOption: true,
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
    await nextTick();
    await vi.delay();

    // The menu is teleported to document.body, so we need to query it there
    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    // Find all buttons in the menu that is specific to this test
    // We need to be more specific to avoid catching buttons from other tests
    let menuButtons = Array.from(document.body.querySelectorAll('div[role=menu] button'));

    // Filter only the buttons from the current menu (should contain our search terms)
    let relevantButtons = menuButtons.filter(btn =>
      btn.innerHTML.includes('German') || btn.innerHTML.includes('Germany'),
    );

    expect(relevantButtons.length).toBe(1);

    let firstButton = relevantButtons[0];
    expect(firstButton.innerHTML).toContain('Germany');

    await wrapper.setProps({ hideCustomValueOption: false });
    await nextTick();

    menuButtons = Array.from(document.body.querySelectorAll('div[role=menu] button'));
    relevantButtons = menuButtons.filter(btn =>
      btn.innerHTML.includes('German') || btn.innerHTML.includes('Germany'),
    );

    expect(relevantButtons.length).toBe(2);

    firstButton = relevantButtons[0];
    expect(firstButton.innerHTML).toContain('German');

    const secondButton = relevantButtons[1];
    expect(secondButton.innerHTML).toContain('Germany');

    await wrapper.find('input').setValue('Germany');
    await nextTick();
    await vi.delay();

    // Re-query buttons after value change
    const updatedMenuButtons = Array.from(document.body.querySelectorAll('div[role=menu] button'));
    const updatedRelevantButtons = updatedMenuButtons.filter(btn =>
      btn.innerHTML.includes('Germany'),
    );

    expect(updatedRelevantButtons.length).toBe(1);

    firstButton = updatedRelevantButtons[0];
    expect(firstButton.innerHTML).toContain('Germany');

    await wrapper.find('input').setValue('German');
    await nextTick();
    await vi.delay();

    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[
      'custom value',
      'German',
    ]]);
  });

  it('hides selected value when search input focused in single select', async () => {
    const wrapper = createWrapper<string, SelectOption>({
      attachTo: document.body,
      props: {
        keyAttr: 'id',
        modelValue: '4',
        options,
        textAttr: 'label',
      },
    });

    await nextTick();
    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Indonesia');

    await input.trigger('focus');
    await nextTick();
    expect((input.element as HTMLInputElement).value).toBe('Indonesia');
    expect(wrapper.find('div.value div.flex').exists()).toBe(false);

    await input.trigger('blur');
    await nextTick();
    await vi.delay(300);
    expect((input.element as HTMLInputElement).value).toBe('Indonesia');
  });

  it('press enter on activator, trigger the form submit', async () => {
    const form = document.createElement('form');
    const submitFunc = vi.fn();
    form.onsubmit = submitFunc;

    const wrapper = createWrapper<string, SelectOption>({
      attachTo: form,
      props: {
        keyAttr: 'id',
        modelValue: '4',
        options,
        textAttr: 'label',
      },
    });

    await wrapper.find('div[data-id="activator"]').trigger('focus');

    await nextTick();
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');

    expect(submitFunc).toBeCalledTimes(1);
  });
});
