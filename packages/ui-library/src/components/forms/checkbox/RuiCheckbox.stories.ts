import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiCheckbox>) {
  return {
    components: { RuiCheckbox },
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

      const indeterminate = computed({
        get() {
          return args.indeterminate;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.indeterminate = val;
        },
      });
      return { args, indeterminate, modelValue };
    },
    template: `<RuiCheckbox v-bind="args" v-model="modelValue" v-model:indeterminate="indeterminate">
      {{ args.label }}
    </RuiCheckbox>`,
  };
}

const meta = preview.meta({
  args: {
    errorMessages: [],
    successMessages: [],
  },
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    successMessages: { control: 'object' },
  },
  component: RuiCheckbox,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Checkbox',
});

export const Checked = meta.story({
  args: {
    modelValue: true,
  },
  async play({ canvas, userEvent }) {
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
});

export const Indeterminate = meta.story({
  args: {
    indeterminate: true,
  },
});

export const Large = meta.story({
  args: {
    size: 'lg',
  },
});

export const Small = meta.story({
  args: {
    size: 'sm',
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
  },
});

export const WithLabel = meta.story({
  args: {
    label: 'With Label',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Disabled',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    label: 'Label',
    successMessages: ['With success messages'],
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Checkbox',
    required: true,
  },
});

export default meta;
