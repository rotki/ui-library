import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import AutoComplete, {
  type Props,
} from '@/components/forms/auto-complete/AutoComplete.vue';
import { contextColors } from '@/consts/colors';

const render: StoryFn<Props> = (args) => ({
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
  title: 'Components/Forms/AutoComplete',
  component: AutoComplete,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    errorMessages: { control: 'array', defaultValue: [] },
    dense: { control: 'boolean', table: { category: 'State' } },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    color: {
      control: 'select',
      options: ['grey', ...contextColors],
      table: { category: 'State' },
    },
  },
  parameters: {
    docs: {
      controls: {
        exclude: ['default', 'prefix', 'selected', 'update:modelValue'],
      },
    },
  },
};

type Story = StoryObj<Props>;

const data = [
  { id: '1', text: 'Hello 1', disabled: false },
  { id: '2', text: 'Hello 2', disabled: false },
  { id: '3', text: 'Hello 3', disabled: false },
  { id: '4', text: 'Hello 4', disabled: true },
  { id: '5', text: 'Hello 5', disabled: true },
  { id: '6', text: 'Hello 6', disabled: false },
  { id: '7', text: 'Hello 7', disabled: false },
  { id: '8', text: 'Hello 8', disabled: true },
  { id: '9', text: 'Hello 9', disabled: false },
  ...[...new Array(300).keys()].map((i, index) => ({
    id: `${index + 10}`,
    text: `Hello ${index + 10}`,
    disabled: false,
  })),
];

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: { id: '1', text: 'Hello 1', disabled: false },
    nullable: true,
    hint: 'Lorem ipsum dolor sit amet',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [
      { id: '3', text: 'Hello 3', disabled: false },
      { id: '4', text: 'Hello 4', disabled: true },
      { id: '5', text: 'Hello 5', disabled: true },
      { id: '6', text: 'Hello 6', disabled: false },
    ],
    nullable: true,
    variant: 'default',
    errorMessages: ['Lorem ipsum dolor sit amet'],
  },
};

export const MultipleDense: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [
      { id: '3', text: 'Hello 3', disabled: false },
      { id: '4', text: 'Hello 4', disabled: true },
      { id: '5', text: 'Hello 5', disabled: true },
      { id: '6', text: 'Hello 6', disabled: false },
    ],
    nullable: true,
    dense: true,
    variant: 'default',
  },
};

export const MultipleOutline: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [{ id: '1', text: 'Hello 1', disabled: false }],
    nullable: true,
    variant: 'outlined',
  },
};

export const MultipleOutlineDense: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [
      { id: '3', text: 'Hello 3', disabled: false },
      { id: '4', text: 'Hello 4', disabled: true },
      { id: '5', text: 'Hello 5', disabled: true },
      { id: '6', text: 'Hello 6', disabled: false },
    ],
    nullable: true,
    dense: true,
    variant: 'outlined',
  },
};

export const MultipleFilledDense: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [
      { id: '3', text: 'Hello 3', disabled: false },
      { id: '4', text: 'Hello 4', disabled: true },
      { id: '5', text: 'Hello 5', disabled: true },
      { id: '6', text: 'Hello 6', disabled: false },
    ],
    nullable: true,
    dense: true,
    variant: 'filled',
  },
};

export const MultipleFilled: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: [
      { id: '1', text: 'Hello 1', disabled: false },
      { id: '2', text: 'Hello 2', disabled: false },
      { id: '3', text: 'Hello 3', disabled: false },
      { id: '4', text: 'Hello 4', disabled: true },
      { id: '5', text: 'Hello 5', disabled: true },
      { id: '6', text: 'Hello 6', disabled: false },
      { id: '7', text: 'Hello 7', disabled: false },
      { id: '8', text: 'Hello 8', disabled: true },
      { id: '9', text: 'Hello 9', disabled: false },
      { id: '10', text: 'Hello 10', disabled: false },
      { id: '11', text: 'Hello 11', disabled: false },
      { id: '12', text: 'Hello 12', disabled: false },
      { id: '13', text: 'Hello 13', disabled: false },
      { id: '14', text: 'Hello 14', disabled: false },
      { id: '15', text: 'Hello 15', disabled: false },
      { id: '16', text: 'Hello 16', disabled: false },
    ],
    nullable: true,
    variant: 'filled',
  },
};

export const FilledDense: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: { id: '3', text: 'Hello 3', disabled: false },
    nullable: true,
    dense: true,
    variant: 'filled',
  },
};

export const Filled: Story = {
  args: {
    label: 'Country',
    placeholder: 'Placeholder',
    data,
    modelValue: { id: '3', text: 'Hello 3', disabled: false },
    nullable: true,
    dense: false,
    variant: 'filled',
  },
};

export default meta;
