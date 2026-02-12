import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiRadio from '@/components/forms/radio-button/radio/RuiRadio.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiRadio<string>>) {
  return {
    components: {
      RuiRadio: RuiRadio<string>,
    },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          args.modelValue = val;
        },
      });
      return { args, modelValue };
    },
    template: `<RuiRadio v-bind="args" v-model="modelValue">
  {{ args.default }}
  </RuiRadio>`,
  };
}

const meta = preview.meta({
  args: {
    errorMessages: [],
  },
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    value: { control: 'text' },
  },
  component: RuiRadio<string>,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Radio/Radio',
});

export const Checked = meta.story({
  args: {
    modelValue: 'test',
    value: 'test',
  },
  async play({ canvas }) {
    const radio = canvas.getByRole('radio');
    await expect(radio).toBeChecked();
  },
});

export const Large = meta.story({
  args: {
    size: 'lg',
    value: 'test',
  },
});

export const Small = meta.story({
  args: {
    size: 'sm',
    value: 'test',
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    value: 'test',
  },
});

export const WithLabel = meta.story({
  args: {
    label: 'With Label',
    value: 'test',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Disabled',
    value: 'test',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    value: 'test',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
    value: 'test',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    value: 'test',
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Radio',
    required: true,
    value: 'test',
  },
});

export default meta;
