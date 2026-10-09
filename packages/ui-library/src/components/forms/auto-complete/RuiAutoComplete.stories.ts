import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import { groupedOptions, type GroupedSelectOption, options, type SelectOption } from '@/__test__/options';
import RuiChip from '@/components/chips/RuiChip.vue';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import preview from '~/.storybook/preview';

type AutoCompleteProps = ComponentPropsAndSlots<typeof RuiAutoComplete<string, SelectOption>>;

type AutoCompleteMetaArgs = Required<Pick<AutoCompleteProps, 'clearable' | 'disabled' | 'options'>>;

function render(args: AutoCompleteProps) {
  return {
    components: {
      RuiAutoComplete: RuiAutoComplete<string, SelectOption>,
    },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      return { args, modelValue };
    },
    template: `<RuiAutoComplete v-bind="args" v-model="modelValue" />`,
  };
}

const meta = preview.meta<
  typeof RuiAutoComplete<string, SelectOption>,
  Decorator,
  AutoCompleteMetaArgs
>({
  args: {
    clearable: true,
    disabled: false,
    options,
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'object' },
    options: { control: 'object' },
    required: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiAutoComplete<string, SelectOption>,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Forms/Auto Complete',
});

export const Default = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Select a country',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

/** A search-style field, as in a command palette: a leading search icon and no dropdown arrow. */
export const SearchStyle = meta.story({
  args: {
    hideArrow: true,
    keyAttr: 'id',
    labelPlacement: 'hidden',
    modelValue: undefined,
    placeholder: 'Search anything…',
    prependIcon: 'lu-search',
    textAttr: 'label',
  },
});

// @ts-expect-error PrimitiveItems uses string[] options instead of SelectOption[]
export const PrimitiveItems = meta.story({
  args: {
    modelValue: 'Greece',
    options: options.map(item => item.label),
  },
});

/** Without chips, the selected values are listed as plain, comma-separated text. */
// @ts-expect-error MultipleValue uses string[] options and array modelValue
export const MultipleValue = meta.story({
  args: {
    modelValue: ['Germany', 'Greece', 'Spain'],
    options: options.map(item => item.label),
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: '3',
    textAttr: 'label',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    keyAttr: 'id',
    modelValue: '1',
    textAttr: 'label',
  },
});

// @ts-expect-error Chips uses string[] modelValue for multi-select
export const Chips = meta.story({
  args: {
    chips: true,
    dense: true,
    keyAttr: 'id',
    modelValue: ['3', '4'],
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);

    // Verify initial chips are rendered
    expect(canvas.getByText('Greece')).toBeVisible();
    expect(canvas.getByText('Indonesia')).toBeVisible();

    // Focus input
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);

    // First Backspace: selects the last chip, while focus stays in the input
    await userEvent.keyboard('{Backspace}');

    const lastChip = canvas.getByText('Indonesia').closest('[data-index]');
    await waitFor(() => expect(lastChip).toHaveAttribute('data-selected', 'true'));
    await expect(input).toHaveFocus();

    // Second Backspace: removes the selected chip
    await userEvent.keyboard('{Backspace}');

    // Verify chip was removed
    await waitFor(() => expect(canvas.queryByText('Indonesia')).toBeNull());
    expect(canvas.getByText('Greece')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

// @ts-expect-error MultipleValueDeletion uses string[] options and array modelValue
export const MultipleValueDeletion = meta.story({
  args: {
    modelValue: ['Germany', 'Nigeria'],
    options: options.map(item => item.label),
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);

    // Verify initial values are rendered, joined by a comma
    expect(canvas.getByText('Germany,')).toBeVisible();
    expect(canvas.getByText('Nigeria')).toBeVisible();

    // Focus input
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);

    // Backspace removes last value directly (no chip focus step)
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(canvas.queryByText('Nigeria')).toBeNull());
    expect(canvas.getByText('Germany')).toBeVisible();

    // Another Backspace removes the remaining value
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(canvas.queryByText(/^Germany/)).toBeNull());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export const CustomValue = meta.story({
  args: {
    customValue: true,
    dense: false,
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Pick a country or type your own',
    textAttr: 'label',
  },
});

export const ReadOnly = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: '3',
    readOnly: true,
    textAttr: 'label',
  },
  async play({ canvas }) {
    const combobox = canvas.getByRole('combobox');
    expect(combobox.getAttribute('aria-readonly')).toBe('true');
    expect(combobox.getAttribute('tabindex')).toBe('-1');
  },
});

export const Loading = meta.story({
  args: {
    keyAttr: 'id',
    loading: true,
    modelValue: undefined,
    placeholder: 'Loading countries',
    textAttr: 'label',
  },
});

export const WithPlaceholder = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Search countries...',
    textAttr: 'label',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Select your country of residence',
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Select a country',
    textAttr: 'label',
  },
});

export const WithErrors = meta.story({
  args: {
    errorMessages: ['This field is required', 'Please select a valid option'],
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Select a country',
    textAttr: 'label',
  },
});

export const WithSuccess = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: '1',
    successMessages: ['Selection confirmed'],
    textAttr: 'label',
  },
});

/**
 * The same hint on two fields: the first draws it below the field, the second sets `hideDetails`,
 * which drops the hint and the line it would take.
 */
export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'This hint is only drawn when details are shown',
    keyAttr: 'id',
    label: 'Details hidden',
    modelValue: '1',
    textAttr: 'label',
  },
  render: args => ({
    components: { RuiAutoComplete: RuiAutoComplete<string, SelectOption> },
    setup() {
      const shown = ref<string | undefined>('3');
      const hidden = ref<string | undefined>('1');
      return { args, hidden, shown };
    },
    template: `
      <div class="flex flex-col gap-4">
        <RuiAutoComplete v-bind="args" v-model="shown" label="Details shown" :hide-details="false" />
        <RuiAutoComplete v-bind="args" v-model="hidden" />
      </div>
    `,
  }),
});

// @ts-expect-error HideSelected uses string[] modelValue for multi-select
export const HideSelected = meta.story({
  args: {
    hideSelected: true,
    keyAttr: 'id',
    modelValue: ['1', '2'],
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    const body = within(document.body);

    await waitFor(() => {
      const menu = body.getByRole('listbox');
      expect(menu).toBeVisible();
      const menuContent = within(menu);
      // Selected items (Germany, Nigeria) should not appear in menu
      expect(menuContent.queryByText('Germany')).toBeNull();
      expect(menuContent.queryByText('Nigeria')).toBeNull();
      // Unselected items should still be visible
      expect(menuContent.getByText('Greece')).toBeVisible();
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export const NoFilter = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    noFilter: true,
    placeholder: 'Every option stays listed while you type',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'xyz');

    const body = within(document.body);

    // All options should remain visible despite non-matching search
    await waitFor(() => {
      const menu = body.getByRole('listbox');
      expect(menu).toBeVisible();
      expect(within(menu).getByText('Germany')).toBeVisible();
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export const AutoSelectFirst = meta.story({
  args: {
    autoSelectFirst: true,
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Enter picks the first match',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());

    // Press Enter to select auto-highlighted first item
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());

    // First option (Germany) should be selected
    expect(canvas.getByDisplayValue('Germany')).toBeVisible();
  },
});

export const CustomValueInteraction = meta.story({
  args: {
    customValue: true,
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Type a country that is not listed',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'Custom Country');
    await userEvent.keyboard('{Enter}');

    // Custom value should be accepted
    await waitFor(() => expect(canvas.getByDisplayValue('Custom Country')).toBeVisible());
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export const Required = meta.story({
  args: {
    keyAttr: 'id',
    label: 'Country',
    modelValue: undefined,
    placeholder: 'Select a country',
    required: true,
    textAttr: 'label',
  },
});

// @ts-expect-error Grouped uses GroupedSelectOption[] options instead of SelectOption[]
export const Grouped = meta.story({
  args: {
    groupBy: 'category',
    keyAttr: 'id',
    modelValue: undefined,
    options: groupedOptions,
    placeholder: 'Countries grouped by continent',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());

    const menu = body.getByRole('listbox');
    await waitFor(() => expect(within(menu).getByText('Europe')).toBeVisible());
    expect(within(menu).getByText('Asia')).toBeVisible();
    expect(within(menu).getByText('Africa')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

// @ts-expect-error GroupedSearchLabel uses GroupedSelectOption[] options
export const GroupedSearchLabel = meta.story({
  args: {
    groupBy: 'category',
    keyAttr: 'id',
    modelValue: undefined,
    options: groupedOptions,
    placeholder: 'Search by country or continent',
    searchIncludesGroupLabel: true,
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());

    // A group label surfaces every item under it, none of whose own labels hold the query
    await userEvent.keyboard('Europe');
    const menu = body.getByRole('listbox');
    await waitFor(() => expect(within(menu).getByText('Germany')).toBeVisible());
    expect(within(menu).getByText('France')).toBeVisible();
    expect(within(menu).getByText('Spain')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

// @ts-expect-error GroupedCustomHeader uses GroupedSelectOption[] options
export const GroupedCustomHeader = meta.story({
  args: {
    groupBy: 'category',
    keyAttr: 'id',
    modelValue: '4',
    options: groupedOptions,
    textAttr: 'label',
  },
  render: args => ({
    components: { RuiAutoComplete: RuiAutoComplete<string, GroupedSelectOption>, RuiChip },
    setup() {
      const modelValue = computed({
        get: () => args.modelValue,
        // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
        set: (val) => { args.modelValue = val; },
      });
      return { args, modelValue };
    },
    template: `
      <RuiAutoComplete v-bind="args" v-model="modelValue">
        <template #group-header="{ group, items }">
          <div class="px-3 py-2 bg-rui-primary/10 flex items-center justify-between">
            <span class="font-bold text-rui-primary">{{ group }}</span>
            <RuiChip size="sm">{{ items.length }}</RuiChip>
          </div>
        </template>
      </RuiAutoComplete>
    `,
  }),
});

// @ts-expect-error WithDisabledItems uses GroupedSelectOption[] options with `disabled` field
export const WithDisabledItems = meta.story({
  args: {
    itemDisabled: 'disabled',
    keyAttr: 'id',
    modelValue: undefined,
    options: [
      { category: 'A', id: '1', label: 'Available row' },
      { category: 'A', disabled: true, id: '2', label: 'Disabled row' },
      { category: 'A', id: '3', label: 'Another available row' },
      { category: 'A', disabled: true, id: '4', label: 'Also disabled' },
      { category: 'A', id: '5', label: 'Final available row' },
    ] satisfies GroupedSelectOption[],
    placeholder: 'Some rows cannot be picked',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());

    // ArrowDown should skip the disabled row and land on the next available.
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    const menu = body.getByRole('listbox');
    const highlighted = menu.querySelector('button[data-highlighted="true"]');
    expect(highlighted?.textContent).toContain('Another available row');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export const PlaceholderSlot = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
  render: args => ({
    components: { RuiAutoComplete: RuiAutoComplete<string, SelectOption>, RuiIcon },
    setup() {
      const modelValue = computed({
        get: () => args.modelValue,
        // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
        set: (val) => { args.modelValue = val; },
      });
      return { args, modelValue };
    },
    template: `
      <RuiAutoComplete v-bind="args" v-model="modelValue">
        <template #placeholder>
          <span class="flex items-center gap-2 text-rui-text-secondary">
            <RuiIcon name="lu-search" size="16" />
            <span class="italic">Find a country…</span>
          </span>
        </template>
      </RuiAutoComplete>
    `,
  }),
});

export const FooterSlot = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    placeholder: 'Open to see the footer',
    textAttr: 'label',
  },
  render: args => ({
    components: { RuiAutoComplete: RuiAutoComplete<string, SelectOption> },
    setup() {
      const modelValue = computed({
        get: () => args.modelValue,
        // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
        set: (val) => { args.modelValue = val; },
      });
      return { args, modelValue };
    },
    template: `
      <RuiAutoComplete v-bind="args" v-model="modelValue">
        <template #footer>
          <div class="flex items-center justify-between px-3 py-2 text-xs text-rui-text-secondary">
            <span>↑↓ navigate · ↵ select · esc close</span>
            <span class="font-mono">{{ args.options.length }} items</span>
          </div>
        </template>
      </RuiAutoComplete>
    `,
  }),
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());

    const menu = body.getByRole('listbox');
    await waitFor(() => expect(within(menu).getByText(/navigate/)).toBeVisible());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

export default meta;
