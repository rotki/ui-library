import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { type Props, default as SimpleSelect } from './SimpleSelect.vue';

const render: StoryFn<Props> = (args) => ({
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
  title: 'Components/Forms/SimpleSelect',
  component: SimpleSelect,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'string' },
    name: { control: 'string' },
    options: { control: 'array', defaultValue: [] },
    disabled: { control: 'boolean' },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined'],
    },
  },
  args: {
    options: [...new Array(10)].map((_, i) => `Option ${i}`),
    variant: 'default',
    disabled: false,
  },
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    modelValue: 'Option 1',
  },
};

export const DefaultDisabled: Story = {
  args: {
    modelValue: 'Option 1',
    disabled: true,
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
    modelValue: 'Option 1',
    variant: 'outlined',
    disabled: true,
  },
};

export default meta;
