import { describe, expect, it, vi } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import RuiChip from '@/components/chips/RuiChip.vue';
import { type SelectOption, options } from '@/__test__/options';

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

    // Delete option should also remove selected value with that option
    const newOptions = options.filter(item => item.id !== newSelectedIndexToString);

    await wrapper.setProps({
      modelValue: newSelectedIndexToString,
      options: newOptions,
    });
    await nextTick();

    // Even if the options changed, the search value should not be touch as long as the focus still there, so the UX is not breaking
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Still not supposed to change the search value
    const menu = document.body.querySelector('div[role=menu]') as HTMLDivElement;
    menu.focus();
    await nextTick();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Greece');

    // Only after nothing is focused anymore, the search value can be reset
    menu.blur();
    (wrapper.find('input').element as HTMLInputElement).blur();
    await nextTick();
    await vi.delay(100);
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
      props: {
        autoSelectFirst: true,
        chips: true,
        customValue: true,
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

    await wrapper.find('input').setValue('custom value 2');
    await nextTick();
    await vi.delay();
    await wrapper.find('[data-id=activator]').trigger('keydown.enter');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[
      'custom value',
      'custom value 2',
    ]]);
  });
});
