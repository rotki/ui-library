import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import RevealableTextField from './RevealableTextField.vue';

const render: StoryFn<typeof RevealableTextField> = (_, { argTypes }) => ({
  components: { RevealableTextField },
  props: Object.keys(argTypes),
  template: `<RevealableTextField v-bind="$props" />`,
});

const meta: Meta<typeof RevealableTextField> = {
  title: 'Components/Forms/RevealableTextField',
  component: RevealableTextField,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    appendIcon: { control: 'text' },
    prependIcon: { control: 'text' },
    errorMessages: { control: 'text' },
    hideDetails: { control: 'boolean' },
    dense: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: { control: 'select', options: contextColors },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
};

export const Default = {
  args: {
    label: 'Password',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export default meta;
