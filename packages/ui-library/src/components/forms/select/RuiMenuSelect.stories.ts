import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { options, type SelectOption } from '@/__test__/options';
import RuiMenuSelect, { type Props } from '@/components/forms/select/RuiMenuSelect.vue';

type SelectProps<T extends SelectOption | string = SelectOption> = Props<string, T> & { modelValue: string | undefined };

const render: StoryFn<SelectProps> = args => ({
  components: {
    RuiMenuSelect: RuiMenuSelect as any,
  },
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
  template: `<RuiMenuSelect v-bind="args" v-model="modelValue" />`,
});

const meta: Meta<SelectProps> = {
  args: {
    disabled: false,
    options,
    variant: 'default',
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'text' },
    options: { control: 'object' },
    required: { control: 'boolean', table: { category: 'State' } },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
  },
  component: RuiMenuSelect as any,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/MenuSelect',
};

type Story<T extends SelectOption | string = SelectOption> = StoryObj<SelectProps<T>>;

export const Default: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
};

export const PrimitiveItems: Story<string> = {
  args: {
    options: options.map(item => item.label),
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
};

export const Outlined: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDense: Story = {
  args: {
    dense: false,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDisabledDense: Story = {
  args: {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const Required: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    required: true,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export default meta;
