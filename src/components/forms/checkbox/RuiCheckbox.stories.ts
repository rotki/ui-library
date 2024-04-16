import { contextColors } from '@/consts/colors';
import RuiCheckbox, { type Props } from '@/components/forms/checkbox/RuiCheckbox.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type PropsAndLabel = Props & { label: string };

const render: StoryFn<PropsAndLabel> = args => ({
  components: { RuiCheckbox },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    const indeterminate = computed({
      get() {
        return args.indeterminate;
      },
      set(val) {
        args.indeterminate = val;
      },
    });
    return { args, indeterminate, modelValue };
  },
  template: `<RuiCheckbox v-bind="args" v-model="modelValue" v-model:indeterminate="indeterminate">
    {{ args.label }}
  </RuiCheckbox>`,
});

const meta: Meta<PropsAndLabel> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    successMessages: { control: 'array', defaultValue: [] },
  },
  component: RuiCheckbox,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Checkbox',
};

type Story = StoryObj<PropsAndLabel>;

export const Checked: Story = {
  args: {
    modelValue: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
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
