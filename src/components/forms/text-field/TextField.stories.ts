import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import TextField from './TextField.vue';

const render: StoryFn<typeof TextField> = (_, { argTypes }) => ({
  components: { TextField },
  props: Object.keys(argTypes),
  template: `<TextField v-bind="$props" :error-messages="$props.errorMessages ? [$props.errorMessages] : []" />`,
});

const meta: Meta<typeof TextField> = {
  title: 'Components/Forms/TextField',
  component: TextField,
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
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    dense: { control: 'boolean', table: { category: 'State' } },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
};

export const Default = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const Filled = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const Outlined = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Primary = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    color: 'primary',
  },
};

export const Dense = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    dense: true,
  },
};

export const Disabled = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    disabled: true,
  },
};

export const WithErrorMessage = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    hint: 'With error messages',
  },
};

export const WithHint = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    hint: 'With hint',
  },
};

export const HideDetails = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export const WithPrependIcon = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    prependIcon: 'heart-fill',
  },
};

export const WithAppendIcon = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    appendIcon: 'heart-fill',
  },
};

export default meta;
