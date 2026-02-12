import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiTextArea from '@/components/forms/text-area/RuiTextArea.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiTextArea>) {
  return {
    components: { RuiTextArea },
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
    template: `<RuiTextArea v-model="modelValue" v-bind="args" />`,
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
    clearable: { control: 'boolean' },
    color: {
      control: 'select',
      options: ['grey', ...contextColors],
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    maxRows: { control: 'number' },
    minRows: { control: 'number', default: 2 },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean', table: { category: 'State' } },
    rowHeight: { control: 'number', default: 1.5 },
    successMessages: { control: 'object' },
    textColor: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
  },
  component: RuiTextArea,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/TextArea',
});

export const Default = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
  async play({ canvas, userEvent }) {
    const textarea = canvas.getByPlaceholderText('Placeholder');
    await userEvent.type(textarea, 'Hello World');
    await expect(textarea).toHaveValue('Hello World');
  },
});

export const Filled = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'filled',
  },
});

export const Outlined = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    successMessages: ['With success messages'],
    variant: 'outlined',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const WithPrependIcon = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    prependIcon: 'lu-heart',
    variant: 'outlined',
  },
});

export const WithAppendIcon = meta.story({
  args: {
    appendIcon: 'lu-heart',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Readonly = meta.story({
  args: {
    label: 'Label',
    modelValue: 'Readonly text',
    placeholder: 'Placeholder',
    readonly: true,
    variant: 'outlined',
  },
});

export const Clearable = meta.story({
  args: {
    clearable: true,
    label: 'Label',
    modelValue: 'Clearable text',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Required = meta.story({
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    required: true,
    variant: 'outlined',
  },
});

export default meta;
