import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiSwitch from '@/components/forms/switch/RuiSwitch.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiSwitch>) {
  return {
    components: { RuiSwitch },
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
    template: `<RuiSwitch v-bind="args" v-model="modelValue">
      {{ args.label }}
    </RuiSwitch>`,
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
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['medium', 'sm'] },
    successMessages: { control: 'object' },
  },
  component: RuiSwitch,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Switch',
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

export const Small = meta.story({
  args: {
    label: 'asdfa',
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
    label: 'Required Switch',
    required: true,
  },
});

export default meta;
