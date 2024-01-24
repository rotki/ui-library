import { contextColors } from '@/consts/colors';
import RevealableTextField, { type Props } from './RevealableTextField.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { RevealableTextField },
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
  template: `
    <RevealableTextField v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    appendIcon: { control: 'text' },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    successMessages: { control: 'array', defaultValue: [] },
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
  component: RevealableTextField,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/RevealableTextField',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const PrimaryText: Story = {
  args: {
    appendIcon: 'eye-line',
    label: 'Password',
    placeholder: 'Placeholder',
    textColor: 'primary',
    variant: 'outlined',
  },
};

export const SuccessText: Story = {
  args: {
    appendIcon: 'eye-line',
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
