import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import { type Props, default as TextArea } from './TextArea.vue';

const render: StoryFn<Props> = (args) => ({
  components: { TextArea },
  setup() {
    const modelValue = computed({
      get() {
        return args.value;
      },
      set(val) {
        args.value = val;
      },
    });

    return { args, modelValue };
  },
  template: `<TextArea v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<Props> = {
  title: 'Components/Forms/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  render,
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    readonly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    appendIcon: { control: 'text' },
    prependIcon: { control: 'text' },
    errorMessages: { control: 'array', defaultValue: [] },
    successMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
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
    textColor: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    minRows: { control: 'number', default: 2 },
    rowHeight: { control: 'number', default: 1.5 },
    maxRows: { control: 'number' },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const Filled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
  },
};

export const Primary: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    color: 'primary',
  },
};

export const Dense: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    disabled: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    errorMessages: ['With error messages'],
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    successMessages: ['With success messages'],
  },
};

export const WithHint: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    hint: 'With hint',
  },
};

export const HideDetails: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    hint: 'Hint (should be invisible)',
    hideDetails: true,
  },
};

export const WithPrependIcon: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    prependIcon: 'heart-fill',
  },
};

export const WithAppendIcon: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    appendIcon: 'heart-fill',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    readonly: true,
    value: 'Readonly text',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outlined',
    clearable: true,
    value: 'Clearable text',
  },
};

export default meta;
