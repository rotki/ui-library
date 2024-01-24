import Radio from '@/components/forms/radio-button/radio/Radio.vue';
import { contextColors } from '@/consts/colors';
import { type Props, default as RadioGroup } from './RadioGroup.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Radio, RadioGroup },
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
  template: `<RadioGroup v-bind="args" v-model="modelValue">
    <Radio value="yes">yes</Radio>
    <Radio value="no">no</Radio>
  </RadioGroup>`,
});

const meta: Meta<Props> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    inline: { control: 'boolean' },
    modelValue: { control: 'text' },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    successMessages: { control: 'object' },
  },
  component: RadioGroup,
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Radio/RadioGroup',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Inline: Story = {
  args: {
    inline: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['With error messages'],
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
  },
};

export default meta;
