import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import Checkbox from './Checkbox.vue';

const render: StoryFn<typeof Checkbox> = (_, { argTypes }) => ({
  components: { Checkbox },
  props: Object.keys(argTypes),
  template: `<Checkbox v-bind="$props" :error-messages="$props.errorMessages ? [$props.errorMessages] : []">
    {{ $props.label }}
  </Checkbox>`,
});

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    hint: { control: 'text' },
    errorMessages: { control: 'text' },
    hideDetails: { control: 'boolean' },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: { control: 'select', options: contextColors },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
};

export const Checked = {
  args: {
    modelValue: true,
  },
};

export const Indeterminate = {
  args: {
    indeterminate: true,
  },
};

export const Large = {
  args: {
    size: 'lg',
  },
};

export const Small = {
  args: {
    size: 'sm',
  },
};

export const WithLabel = {
  args: {
    label: 'With Label',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

export const WithErrorMessage = {
  args: {
    label: 'Label',
    errorMessages: 'With error messages',
  },
};

export const WithHint = {
  args: {
    label: 'Label',
    hint: 'With hint',
  },
};

export const HideDetails = {
  args: {
    label: 'Label',
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export default meta;
