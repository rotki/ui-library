import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import Radio from '@/components/forms/radio-button/radio/Radio.vue';
import { contextColors } from '@/consts/colors';
import { type Props, default as RadioGroup } from './RadioGroup.vue';

const render: StoryFn<Props> = (args) => ({
  components: { RadioGroup, Radio },
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
  title: 'Components/Forms/Radio/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'text' },
    inline: { control: 'boolean' },
    hint: { control: 'text' },
    errorMessages: { control: 'object' },
    successMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: { control: 'select', options: contextColors },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
  },
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
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export default meta;
