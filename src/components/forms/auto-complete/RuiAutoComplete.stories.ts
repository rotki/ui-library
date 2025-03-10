import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import { options, type SelectOption } from '@/__test__/options';
import RuiAutoComplete, { type AutoCompleteModelValue, type AutoCompleteProps } from '@/components/forms/auto-complete/RuiAutoComplete.vue';

type ComponentProps<TValue = string, TItem = SelectOption> = AutoCompleteProps<TValue, TItem> & {
  modelValue: AutoCompleteModelValue<TValue>;
};

const render: StoryFn<ComponentProps> = args => ({
  components: {
    RuiAutoComplete: RuiAutoComplete as any,
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
  template: `<RuiAutoComplete v-bind="args" v-model="modelValue" />`,
});

const meta: Meta<ComponentProps> = {
  args: {
    clearable: true,
    disabled: false,
    options,
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'object' },
    options: { control: 'object' },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined', 'filled'],
    },
  },
  component: RuiAutoComplete as any,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/AutoComplete',
};

type Story<TValue = string> = StoryObj<ComponentProps<TValue>>;

type PrimitiveStory<TValue = string> = StoryObj<ComponentProps<TValue, string>>;

export const Default: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
};

export const PrimitiveItems: PrimitiveStory = {
  args: {
    options: options.map(item => item.label),
  },
};

export const MultipleValue: PrimitiveStory<string[]> = {
  args: {
    modelValue: [],
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

export const Chips: Story<string[]> = {
  args: {
    chips: true,
    dense: true,
    keyAttr: 'id',
    modelValue: ['3', '4'],
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const CustomValue: Story = {
  args: {
    customValue: true,
    dense: false,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export default meta;
