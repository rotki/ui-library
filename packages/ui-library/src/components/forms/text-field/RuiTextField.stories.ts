import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiFieldDefaults from '@/components/forms/field-defaults/RuiFieldDefaults.vue';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiTextField>) {
  return {
    components: { RuiTextField },
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
    template: `<RuiTextField v-model="modelValue" v-bind="args" />`,
  };
}

const meta = preview.meta({
  args: {
    errorMessages: [],
    modelValue: '',
    successMessages: [],
  },
  argTypes: {
    appendIcon: { control: 'text' },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    labelPlacement: { control: 'select', options: ['top', 'hidden'] },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    readonly: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    successMessages: { control: 'object' },
    textColor: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
  },
  component: RuiTextField,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Forms/Text Field',
});

export const Default = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.type(input, 'Hello World');
    await expect(input).toHaveValue('Hello World');
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const Readonly = meta.story({
  args: {
    label: 'Label',
    modelValue: 'Readonly text',
    placeholder: 'Placeholder',
    readonly: true,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    successMessages: ['With success messages'],
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const WithPrependIcon = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    prependIcon: 'lu-heart',
  },
});

export const WithAppendIcon = meta.story({
  args: {
    appendIcon: 'lu-heart',
    label: 'Label',
    placeholder: 'Placeholder',
  },
});

export const WithNoLabel = meta.story({
  args: {
    placeholder: 'Placeholder',
  },
});

export const DenseWithNoLabel = meta.story({
  args: {
    dense: true,
    placeholder: 'Placeholder',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dense + no label = 32px, matching `<RuiMenuSelect dense>`. Useful for inline controls such as table pagination where a text field sits next to a select.',
      },
    },
  },
});

export const WithVeryLongLabel = meta.story({
  args: {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    placeholder: 'Placeholder',
  },
});

export const Required = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    required: true,
  },
});

/**
 * For search and filter fields, and rows that already name the field: the label is not drawn but
 * stays as the field's accessible name, and the placeholder says what to type.
 */
export const HiddenLabel = meta.story({
  args: {
    label: 'Search assets',
    labelPlacement: 'hidden',
    placeholder: 'Search by name or symbol',
    prependIcon: 'lu-search',
  },
  async play({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Search assets' })).toBeVisible();
  },
});

/** The clear button shows while the field is hovered or focused and has a value. */
export const Clearable = meta.story({
  args: {
    clearable: true,
    label: 'Address',
    modelValue: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('textbox', { name: 'Address' });
    await userEvent.click(input);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(input).toHaveValue('');
  },
});

/**
 * `RuiFieldDefaults` sets the label placement for every field inside it, here a settings list whose
 * rows carry their own titles. A field's own `label-placement` still wins, as the last row shows.
 */
export const FieldDefaults = meta.story({
  render: () => ({
    components: { RuiFieldDefaults, RuiTextField },
    setup() {
      const rows = ref<{ description: string; label: string; value: string }[]>([
        { description: 'How often balances refresh, in seconds.', label: 'Refresh interval', value: '60' },
        { description: 'Shown in reports and exports.', label: 'Display name', value: 'Main portfolio' },
      ]);
      const note = ref<string>('');
      return { note, rows };
    },
    template: `
      <RuiFieldDefaults label-placement="hidden">
        <div class="flex flex-col divide-y divide-rui-divider max-w-2xl">
          <div v-for="row in rows" :key="row.label" class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 items-center">
            <div>
              <div class="text-subtitle-2">{{ row.label }}</div>
              <div class="text-caption text-rui-text-secondary">{{ row.description }}</div>
            </div>
            <RuiTextField v-model="row.value" :label="row.label" dense hide-details />
          </div>
          <div class="py-4">
            <RuiTextField v-model="note" label="Note" label-placement="top" placeholder="Anything to remember" hide-details />
          </div>
        </div>
      </RuiFieldDefaults>
    `,
  }),
  async play({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Refresh interval' })).toHaveValue('60');
    await expect(canvas.getByText('Note')).toBeVisible();
  },
});

export default meta;
