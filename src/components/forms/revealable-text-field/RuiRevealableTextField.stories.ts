import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiRevealableTextField, { type Props } from '@/components/forms/revealable-text-field/RuiRevealableTextField.vue';
import { contextColors } from '@/consts/colors';

type RuiRevealableTextFieldProps = Props & { modelValue: string };
const render: StoryFn<RuiRevealableTextFieldProps> = args => ({
  components: { RuiRevealableTextField },
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
  template: `<RuiRevealableTextField v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<RuiRevealableTextFieldProps> = {
  args: {
    errorMessages: [],
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
};

type Story = StoryObj<RuiRevealableTextFieldProps>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const PrimaryText: Story = {
  args: {
    appendIcon: 'lu-eye',
    label: 'Password',
    placeholder: 'Placeholder',
    textColor: 'primary',
    variant: 'outlined',
  },
};

export const SuccessText: Story = {
  args: {
    appendIcon: 'lu-eye',
    label: 'Password',
    placeholder: 'Placeholder',
    textColor: 'success',
    variant: 'outlined',
  },
};

export const ErrorsMessage: Story = {
  args: {
    errorMessages: ['Lorem ipsum dolor'],
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const SuccessMessage: Story = {
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    successMessages: ['Lorem ipsum dolor'],
    variant: 'outlined',
  },
};

export const Hinted: Story = {
  args: {
    hint: 'Lorem ipsum dolor',
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export default meta;
