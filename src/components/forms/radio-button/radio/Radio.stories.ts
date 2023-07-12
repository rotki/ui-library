import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import Radio from './Radio.vue';

const render: StoryFn<typeof Radio> = (_, { argTypes }) => ({
  components: { Radio },
  props: Object.keys(argTypes),
  template: `<Radio v-bind="$props" :error-messages="$props.errorMessages ? [$props.errorMessages] : []">
    {{ $props.label }}
  </Radio>`,
});

const meta: Meta<typeof Radio> = {
  title: 'Components/Forms/Radio/Radio',
  component: Radio,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    modelValue: { control: 'text' },
    value: { control: 'text' },
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
    modelValue: 'test',
    value: 'test',
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

export const Primary = {
  args: {
    color: 'primary',
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
