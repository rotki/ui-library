import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiRadioGroup, { type Props } from '@/components/forms/radio-button/radio-group/RuiRadioGroup.vue';
import RuiRadio from '@/components/forms/radio-button/radio/RuiRadio.vue';
import { contextColors } from '@/consts/colors';

type RuiRadioGroupProps = Props & { modelValue: string };
const render: StoryFn<RuiRadioGroupProps> = args => ({
  components: {
    RuiRadio: RuiRadio as any,
    RuiRadioGroup: RuiRadioGroup as any,
  },
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
  template: `<RuiRadioGroup v-bind="args" v-model="modelValue">
    <RuiRadio value="yes">yes</RuiRadio>
    <RuiRadio value="no">no</RuiRadio>
  </RuiRadioGroup>`,
});

const meta: Meta<RuiRadioGroupProps> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    inline: { control: 'boolean' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    successMessages: { control: 'object' },
  },
  component: RuiRadioGroup as any,
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Radio/RadioGroup',
};

type Story = StoryObj<RuiRadioGroupProps>;

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

export const Required: Story = {
  args: {
    label: 'Required Group',
    required: true,
  },
};

export default meta;
