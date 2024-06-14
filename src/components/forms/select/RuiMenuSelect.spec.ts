import { describe, expect, it, vi } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import { options } from '@/__test__/options';

function createWrapper<T extends string | object>(options?: ComponentMountingOptions<typeof RuiMenuSelect<T>>) {
  const opts: ComponentMountingOptions<typeof RuiMenuSelect<T>> = {
    ...options,
    global: {
      stubs: ['RuiProgress'],
    },
  };
  return mount(RuiMenuSelect, opts);
}

describe('menu select', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.get('button[data-id="activator"]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_activator_/)]),
    );
    expect(wrapper.find('button[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: options[4].id,
        options,
        textAttr: 'label',
      },
    });
    expect(wrapper.find('button[aria-disabled]').exists()).toBeTruthy();
    expect(wrapper.find('button[aria-disabled]').text()).toMatch('Spain');
  });

  it('works with primitive options', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: options[4].label,
        options: options.map(item => item.label),
      },
    });
    expect(wrapper.find('button[data-id=activator]').text()).toMatch('Spain');
  });

  it('value passed and emitted properly', async () => {
    const wrapper = createWrapper({
      props: {
        autoSelectFirst: true,
        keyAttr: 'id',
        options,
        textAttr: 'label',
      },
    });

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    const selectedIndex = 4;
    let highlightedItemButton = document.body.querySelector(`button:first-child`) as HTMLButtonElement;
    expect(highlightedItemButton.classList).toContain('highlighted');

    const buttonToSelect = document.body.querySelector(`button:nth-child(${selectedIndex})`) as HTMLButtonElement;
    buttonToSelect?.click();
    expect(wrapper.emitted()).toHaveProperty('update:model-value', [[selectedIndex.toString()]]);

    await vi.delay();
    expect(document.body.querySelector('div[role=menu]')).toBeFalsy();

    // Open Menu Select
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.delay();
    await nextTick();

    expect(document.body.querySelector('div[role=menu]')).toBeTruthy();

    await nextTick();

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

    highlightedItemButton?.click();
    const updates = wrapper.emitted('update:model-value');
    assert(updates);
    expect(updates).toHaveLength(2);
    expect(updates[1]).toEqual([newSelectedIndex.toString()]);
  });
});
