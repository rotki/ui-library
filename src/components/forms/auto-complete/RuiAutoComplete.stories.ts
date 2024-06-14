import { type SelectOption, options } from '@/__test__/options';
import RuiAutoComplete, { type AutoCompleteProps } from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<AutoCompleteProps<SelectOption, 'id'>> = args => ({
  components: { RuiAutoComplete },
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

const meta: Meta<AutoCompleteProps<SelectOption, 'id'>> = {
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

type Story = StoryObj<AutoCompleteProps<SelectOption, 'id'>>;

type PrimitiveStory = StoryObj<AutoCompleteProps<string, never>>;

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

export const MultipleValue: PrimitiveStory = {
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

export const Chips: Story = {
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
