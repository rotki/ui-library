import { contextColors } from '@/consts/colors';
import { default as Radio, type RadioProps } from './Radio.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type PropsAndLabel = RadioProps & { label: string };

const render: StoryFn<PropsAndLabel> = args => ({
  components: { Radio },
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
  template: `<Radio v-bind="args" v-model="modelValue">
  {{ args.default }}
  </Radio>`,
});

const meta: Meta<PropsAndLabel> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    value: { control: 'text' },
  },
  component: Radio,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Radio/Radio',
};

type Story = StoryObj<PropsAndLabel>;

export const Checked: Story = {
  args: {
    modelValue: 'test',
    value: 'test',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    value: 'test',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    value: 'test',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    value: 'test',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'With Label',
    value: 'test',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
    value: 'test',
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    value: 'test',
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
    label: 'Label',
    value: 'test',
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    value: 'test',
  },
};

export default meta;
