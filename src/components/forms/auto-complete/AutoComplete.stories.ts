import AutoComplete, { type Props } from '@/components/forms/auto-complete/AutoComplete.vue';
import { contextColors } from '@/consts/colors';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { AutoComplete },
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
  template: `
    <div class="mb-60">
      <AutoComplete v-model="modelValue" v-bind="args" />
    </div>
  `,
});

const meta: Meta<Props> = {
  argTypes: {
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hint: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
  },
  component: AutoComplete,
  parameters: {
    docs: {
      controls: {
        exclude: ['default', 'prefix', 'selected', 'update:modelValue'],
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/AutoComplete',
};

type Story = StoryObj<Props>;

const data = [
  { disabled: false, id: '1', text: 'Hello 1' },
  { disabled: false, id: '2', text: 'Hello 2' },
  { disabled: false, id: '3', text: 'Hello 3' },
  { disabled: true, id: '4', text: 'Hello 4' },
  { disabled: true, id: '5', text: 'Hello 5' },
  { disabled: false, id: '6', text: 'Hello 6' },
  { disabled: false, id: '7', text: 'Hello 7' },
  { disabled: true, id: '8', text: 'Hello 8' },
  { disabled: false, id: '9', text: 'Hello 9' },
  ...[...new Array(300).keys()].map((i, index) => ({
    disabled: false,
    id: `${index + 10}`,
    text: `Hello ${index + 10}`,
  })),
];

export const Default: Story = {
  args: {
    data,
    hint: 'Lorem ipsum dolor sit amet',
    label: 'Country',
    modelValue: { disabled: false, id: '1', text: 'Hello 1' },
    nullable: true,
    placeholder: 'Placeholder',
  },
};

export const Multiple: Story = {
  args: {
    data,
    errorMessages: ['Lorem ipsum dolor sit amet'],
    label: 'Country',
    modelValue: [
      { disabled: false, id: '3', text: 'Hello 3' },
      { disabled: true, id: '4', text: 'Hello 4' },
      { disabled: true, id: '5', text: 'Hello 5' },
      { disabled: false, id: '6', text: 'Hello 6' },
    ],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'default',
  },
};

export const MultipleDense: Story = {
  args: {
    data,
    dense: true,
    label: 'Country',
    modelValue: [
      { disabled: false, id: '3', text: 'Hello 3' },
      { disabled: true, id: '4', text: 'Hello 4' },
      { disabled: true, id: '5', text: 'Hello 5' },
      { disabled: false, id: '6', text: 'Hello 6' },
    ],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'default',
  },
};

export const MultipleOutline: Story = {
  args: {
    data,
    label: 'Country',
    modelValue: [{ disabled: false, id: '1', text: 'Hello 1' }],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const MultipleOutlineDense: Story = {
  args: {
    data,
    dense: true,
    label: 'Country',
    modelValue: [
      { disabled: false, id: '3', text: 'Hello 3' },
      { disabled: true, id: '4', text: 'Hello 4' },
      { disabled: true, id: '5', text: 'Hello 5' },
      { disabled: false, id: '6', text: 'Hello 6' },
    ],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const MultipleFilledDense: Story = {
  args: {
    data,
    dense: true,
    label: 'Country',
    modelValue: [
      { disabled: false, id: '3', text: 'Hello 3' },
      { disabled: true, id: '4', text: 'Hello 4' },
      { disabled: true, id: '5', text: 'Hello 5' },
      { disabled: false, id: '6', text: 'Hello 6' },
    ],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const MultipleFilled: Story = {
  args: {
    data,
    label: 'Country',
    modelValue: [
      { disabled: false, id: '1', text: 'Hello 1' },
      { disabled: false, id: '2', text: 'Hello 2' },
      { disabled: false, id: '3', text: 'Hello 3' },
      { disabled: true, id: '4', text: 'Hello 4' },
      { disabled: true, id: '5', text: 'Hello 5' },
      { disabled: false, id: '6', text: 'Hello 6' },
      { disabled: false, id: '7', text: 'Hello 7' },
      { disabled: true, id: '8', text: 'Hello 8' },
      { disabled: false, id: '9', text: 'Hello 9' },
      { disabled: false, id: '10', text: 'Hello 10' },
      { disabled: false, id: '11', text: 'Hello 11' },
      { disabled: false, id: '12', text: 'Hello 12' },
      { disabled: false, id: '13', text: 'Hello 13' },
      { disabled: false, id: '14', text: 'Hello 14' },
      { disabled: false, id: '15', text: 'Hello 15' },
      { disabled: false, id: '16', text: 'Hello 16' },
    ],
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const FilledDense: Story = {
  args: {
    data,
    dense: true,
    label: 'Country',
    modelValue: { disabled: false, id: '3', text: 'Hello 3' },
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const Filled: Story = {
  args: {
    data,
    dense: false,
    label: 'Country',
    modelValue: { disabled: false, id: '3', text: 'Hello 3' },
    nullable: true,
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export default meta;
