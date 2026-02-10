import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiRevealableTextField from '@/components/forms/revealable-text-field/RuiRevealableTextField.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiRevealableTextField>) {
  return {
    components: { RuiRevealableTextField },
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
    template: `<RuiRevealableTextField v-model="modelValue" v-bind="args" />`,
  };
}

const meta = preview.meta({
  args: {
    errorMessages: [],
    modelValue: undefined,
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
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    required: { control: 'boolean', table: { category: 'State' } },
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
  component: RuiRevealableTextField,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/RevealableTextField',
});

export const Default = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const PrimaryText = meta.story({
  args: {
    appendIcon: 'lu-eye',
    label: 'Password',
    placeholder: 'Placeholder',
    textColor: 'primary',
    variant: 'outlined',
  },
});

export const SuccessText = meta.story({
  args: {
    appendIcon: 'lu-eye',
    label: 'Password',
    placeholder: 'Placeholder',
    textColor: 'success',
    variant: 'outlined',
  },
});

export const ErrorsMessage = meta.story({
  args: {
    errorMessages: ['Lorem ipsum dolor'],
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const SuccessMessage = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    successMessages: ['Lorem ipsum dolor'],
    variant: 'outlined',
  },
});

export const Hinted = meta.story({
  args: {
    hint: 'Lorem ipsum dolor',
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
});

export const Required = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    required: true,
    variant: 'outlined',
  },
});

export default meta;
