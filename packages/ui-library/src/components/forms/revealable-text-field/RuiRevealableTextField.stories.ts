import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
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
    modelValue: '',
    successMessages: [],
  },
  argTypes: {
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
  },
  component: RuiRevealableTextField,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Forms/Revealable Text Field',
});

export const Default = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
  },
  async play({ canvas, userEvent }) {
    const input = canvas.getByPlaceholderText('Placeholder');
    await userEvent.type(input, 'secret123');
    await expect(input).toHaveAttribute('type', 'password');
    const toggleButton = canvas.getByRole('button', { name: 'Show password' });
    await userEvent.click(toggleButton);
    await expect(input).toHaveAttribute('type', 'text');
  },
});

/** The field fills `#append` with its own reveal toggle, so the text color is what varies here. */
export const TextColor = meta.story({
  args: {
    label: 'Password',
    modelValue: 'secret123',
    textColor: 'success',
  },
});

export const ErrorsMessage = meta.story({
  args: {
    errorMessages: ['Lorem ipsum dolor'],
    label: 'Password',
    placeholder: 'Placeholder',
  },
});

export const SuccessMessage = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    successMessages: ['Lorem ipsum dolor'],
  },
});

export const Hinted = meta.story({
  args: {
    hint: 'Lorem ipsum dolor',
    label: 'Password',
    placeholder: 'Placeholder',
  },
});

export const Required = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    required: true,
  },
});

export default meta;
