import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import { default as Checkbox, type Props } from './Checkbox.vue';

type PropsAndLabel = Props & { label: string };

const render: StoryFn<PropsAndLabel> = (args) => ({
  components: { Checkbox },
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
    return { args, modelValue, indeterminate };
  },
  template: `<Checkbox v-bind="args" v-model="modelValue" v-model:indeterminate="indeterminate">
    {{ args.label }}
  </Checkbox>`,
});

const meta: Meta<PropsAndLabel> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    hint: { control: 'text' },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean' },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: { control: 'select', options: contextColors },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
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
