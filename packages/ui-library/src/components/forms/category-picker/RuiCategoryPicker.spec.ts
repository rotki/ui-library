import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { groupedOptions, type GroupedSelectOption } from '@/__test__/options';
import RuiCategoryPicker from '@/components/forms/category-picker/RuiCategoryPicker.vue';
import { assertExists, cleanupElements, queryByDataId } from '~/tests/helpers/dom-helpers';

// RuiMenu positions via requestAnimationFrame; run it synchronously in tests.
vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  cb(Date.now());
  return 0;
});

type PickerProps = NonNullable<ComponentMountingOptions<typeof RuiCategoryPicker<string, GroupedSelectOption>>['props']>;

const baseProps: PickerProps = {
  categoryAttr: 'category',
  items: groupedOptions,
  keyAttr: 'id',
  label: 'Country',
  textAttr: 'label',
};

function createWrapper<TValue, TItem>(
  options?: ComponentMountingOptions<typeof RuiCategoryPicker<TValue, TItem>>,
) {
  const opts: ComponentMountingOptions<typeof RuiCategoryPicker<TValue, TItem>> = { ...options };
  return mount(RuiCategoryPicker, opts);
}

function mountPicker(extra?: Partial<PickerProps>) {
  return createWrapper<string, GroupedSelectOption>({ props: { ...baseProps, ...extra } });
}

async function openPicker(wrapper: VueWrapper<any>): Promise<HTMLElement> {
  await wrapper.find('[data-id=activator]').trigger('click');
  await vi.runAllTimersAsync();
  const panel = queryByDataId<HTMLElement>('panel', document.body);
  assertExists(panel);
  return panel;
}

describe('components/forms/category-picker/RuiCategoryPicker.vue', () => {
  let wrapper: ReturnType<typeof mountPicker>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    cleanupElements('*', document.body);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('opens the dialog from the trigger', async () => {
    wrapper = mountPicker();
    expect(queryByDataId('panel', document.body)).toBeFalsy();

    const dialog = await openPicker(wrapper);
    expect(queryByDataId('rail', dialog)).toBeTruthy();
    expect(queryByDataId('detail', dialog)).toBeTruthy();
  });

  it('renders the rail with an "All" entry plus every category', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    const rail = queryByDataId<HTMLElement>('rail', dialog);
    assertExists(rail);
    const tabs = rail.querySelectorAll('[role=tab]');
    // All + Europe + Asia + Africa
    expect(tabs).toHaveLength(4);
    expect(tabs[0]?.textContent).toContain('All');
  });

  it('shows only the active category items when a category is picked', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    const rail = queryByDataId<HTMLElement>('rail', dialog);
    assertExists(rail);
    const europe = Array.from(rail.querySelectorAll<HTMLElement>('[data-category]'))
      .find(el => el.dataset.category === 'Europe');
    assertExists(europe);
    europe.click();
    await vi.runAllTimersAsync();

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const optionLabels = Array.from(detail.querySelectorAll('[role=option]')).map(el => el.textContent?.trim());
    expect(optionLabels).toEqual(['Germany', 'France', 'Spain']);
  });

  it('selects an item, emits the key and closes', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const germany = Array.from(detail.querySelectorAll<HTMLElement>('[role=option]'))
      .find(el => el.textContent?.includes('Germany'));
    assertExists(germany);
    germany.click();
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1']);
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(queryByDataId('panel', document.body)).toBeFalsy();
  });

  it('filters both panes on search and hides empty categories', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    await wrapper.find('[data-id=search-input]').setValue('germany');
    await vi.runAllTimersAsync();

    const rail = queryByDataId<HTMLElement>('rail', dialog);
    assertExists(rail);
    const categoryLabels = Array.from(rail.querySelectorAll<HTMLElement>('[data-category]'))
      .map(el => el.dataset.category);
    // Only "All" and Europe survive (Germany lives in Europe)
    expect(categoryLabels).toEqual(['__all__', 'Europe']);
  });

  it('surfaces a whole category when its label matches the search', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    await wrapper.find('[data-id=search-input]').setValue('asia');
    await vi.runAllTimersAsync();

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const optionLabels = Array.from(detail.querySelectorAll('[role=option]')).map(el => el.textContent?.trim());
    expect(optionLabels).toEqual(['India', 'Indonesia']);
  });

  it('shows the empty state when nothing matches', async () => {
    wrapper = mountPicker({ emptyText: 'Nothing here' });
    const dialog = await openPicker(wrapper);

    await wrapper.find('[data-id=search-input]').setValue('zzzznope');
    await vi.runAllTimersAsync();

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    expect(detail.textContent).toContain('Nothing here');
  });

  it('navigates rail and detail with the keyboard and selects with Enter', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    const rail = queryByDataId<HTMLElement>('rail', dialog);
    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(rail);
    assertExists(detail);

    // Down from "All" to the first real category (Europe), then into the detail.
    rail.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await vi.runAllTimersAsync();
    rail.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await vi.runAllTimersAsync();

    // Down to the second item (France) and select it.
    detail.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await vi.runAllTimersAsync();
    detail.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2']);
  });

  it('picks the top match when pressing Enter in the field', async () => {
    wrapper = mountPicker();
    await openPicker(wrapper);

    const field = wrapper.find('[data-id=search-input]');
    await field.setValue('india');
    await vi.runAllTimersAsync();
    await field.trigger('keydown', { key: 'Enter' });
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['4']); // India
  });

  it('surfaces matches globally when searching with a category selected', async () => {
    wrapper = mountPicker({ modelValue: '4' }); // India → opens on Asia
    const dialog = await openPicker(wrapper);

    await wrapper.find('[data-id=search-input]').setValue('germany');
    await vi.runAllTimersAsync();

    // Even though Asia was the active category, the query jumps to "All" so the
    // Europe match shows instead of an empty Asia pane.
    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const optionLabels = Array.from(detail.querySelectorAll('[role=option]')).map(el => el.textContent?.trim());
    expect(optionLabels).toEqual(['Germany']);
  });

  it('focuses the detail pane without scrolling the page when a category is picked', async () => {
    wrapper = mountPicker();
    const dialog = await openPicker(wrapper);

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const focusSpy = vi.spyOn(detail, 'focus');

    const europe = Array.from(dialog.querySelectorAll<HTMLElement>('[data-category]'))
      .find(el => el.dataset.category === 'Europe');
    assertExists(europe);
    europe.click();
    await vi.runAllTimersAsync();

    // Focusing a teleported pane must pass preventScroll, or the browser scrolls
    // the page behind the popover to bring the pane into view.
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('renders the field label, required marker and error messages', async () => {
    wrapper = mountPicker({ errorMessages: 'This field is required', required: true });

    expect(wrapper.text()).toContain('Country');
    expect(wrapper.text()).toContain('﹡');
    expect(wrapper.text()).toContain('This field is required');
    expect(wrapper.find('[data-id=activator]').attributes('aria-required')).toBe('true');
    expect(wrapper.find('[data-id=activator]').attributes('aria-invalid')).toBe('true');
  });

  it('renders the selected value through the #selection slot', () => {
    wrapper = createWrapper<string, GroupedSelectOption>({
      props: { ...baseProps, modelValue: '1' },
      slots: { selection: '<span class="custom-selection">picked: {{ params.item.label }}</span>' },
    });

    const selection = wrapper.find('.custom-selection');
    expect(selection.exists()).toBe(true);
    expect(selection.text()).toBe('picked: Germany');
  });

  it('opens with the rail pointed at the selected value', async () => {
    wrapper = mountPicker({ modelValue: '4' }); // India → Asia
    const dialog = await openPicker(wrapper);

    const detail = queryByDataId<HTMLElement>('detail', dialog);
    assertExists(detail);
    const optionLabels = Array.from(detail.querySelectorAll('[role=option]')).map(el => el.textContent?.trim());
    expect(optionLabels).toEqual(['India', 'Indonesia']);
  });
});
