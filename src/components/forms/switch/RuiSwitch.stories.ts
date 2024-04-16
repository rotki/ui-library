import { contextColors } from '@/consts/colors';
import RuiSwitch, { type Props } from '@/components/forms/switch/RuiSwitch.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type PropsAndLabel = Props & { label: string };

const render: StoryFn<PropsAndLabel> = args => ({
  components: { RuiSwitch },
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
  template: `<RuiSwitch v-bind="args" v-model="modelValue">
    {{ args.label }}
  </RuiSwitch>`,
});

const meta: Meta<PropsAndLabel> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    size: { control: 'select', options: ['medium', 'sm'] },
    successMessages: { control: 'array', defaultValue: [] },
  },
  component: RuiSwitch,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Switch',
};

type Story = StoryObj<PropsAndLabel>;

export const Checked: Story = {
  args: {
    modelValue: true,
  },
};

export const Small: Story = {
  args: {
    label: 'asdfa',
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
    errorMessages: ['With error messages'],
    label: 'Label',
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Label',
    successMessages: ['With success messages'],
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
    label: 'Label',
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
  },
};

export default meta;
