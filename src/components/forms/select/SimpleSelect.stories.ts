import { type Props, default as SimpleSelect } from './SimpleSelect.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { SimpleSelect },
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
  template: `<SimpleSelect v-bind="args" v-model="modelValue" />`,
});

const meta: Meta<Props> = {
  args: {
    disabled: false,
    options: [...new Array(10)].map((_, i) => `Option ${i}`),
    variant: 'default',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    modelValue: { control: 'string' },
    name: { control: 'string' },
    options: { control: 'array', defaultValue: [] },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined'],
    },
  },
  component: SimpleSelect,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/SimpleSelect',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    modelValue: 'Option 1',
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    modelValue: 'Option 1',
  },
};

export const Outlined: Story = {
  args: {
    modelValue: 'Option 1',
    variant: 'outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    disabled: true,
    modelValue: 'Option 1',
    variant: 'outlined',
  },
};

export default meta;
