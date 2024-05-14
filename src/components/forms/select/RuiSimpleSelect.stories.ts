import RuiSimpleSelect, { type Props } from '@/components/forms/select/RuiSimpleSelect.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { RuiSimpleSelect },
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
  template: `<RuiSimpleSelect v-bind="args" v-model="modelValue" />`,
});

const meta: Meta<Props> = {
  args: {
    disabled: false,
    options: [...new Array(10)].map((_, i) => `Option ${i}`),
    variant: 'default',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    modelValue: { control: 'text' },
    name: { control: 'text' },
    options: { control: 'object' },
    variant: {
      control: 'select',
      options: ['default', 'outlined'],
    },
  },
  component: RuiSimpleSelect,
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
