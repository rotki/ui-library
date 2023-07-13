import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import { type Props, default as Radio } from './Radio.vue';

type PropsAndLabel = Props & { label: string };

const render: StoryFn<PropsAndLabel> = (args) => ({
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
  title: 'Components/Forms/Radio/Radio',
  component: Radio,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    modelValue: { control: 'text' },
    value: { control: 'text' },
    hint: { control: 'text' },
    errorMessages: { control: 'array', defaultValue: [] },
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
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'With Label',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    errorMessages: ['With error messages'],
  },
};

export const WithHint: Story = {
  args: {
    label: 'Label',
    hint: 'With hint',
  },
};

export const HideDetails: Story = {
  args: {
    label: 'Label',
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export default meta;
