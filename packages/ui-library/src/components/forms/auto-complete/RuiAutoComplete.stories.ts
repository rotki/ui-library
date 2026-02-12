import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import { options, type SelectOption } from '@/__test__/options';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import preview from '~/.storybook/preview';

type AutoCompleteProps = ComponentPropsAndSlots<typeof RuiAutoComplete<string, SelectOption>>;

type AutoCompleteMetaArgs = Required<Pick<AutoCompleteProps, 'clearable' | 'disabled' | 'options'>>;

function render(args: AutoCompleteProps) {
  return {
    components: {
      RuiAutoComplete: RuiAutoComplete<string, SelectOption>,
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
  };
}

const meta = preview.meta<typeof RuiAutoComplete<string, SelectOption>, Decorator, AutoCompleteMetaArgs>({
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
    required: { control: 'boolean', table: { category: 'State' } },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined', 'filled'],
    },
  },
  component: RuiAutoComplete<string, SelectOption>,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/AutoComplete',
});

export const Default = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
  },
});

// @ts-expect-error PrimitiveItems uses string[] options instead of SelectOption[]
export const PrimitiveItems = meta.story({
  args: {
    options: options.map(item => item.label),
  },
});

// @ts-expect-error MultipleValue uses string[] options and array modelValue
export const MultipleValue = meta.story({
  args: {
    modelValue: [],
    options: options.map(item => item.label),
  },
});

export const DefaultDisabled = meta.story({
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const Outlined = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
});

export const OutlinedDisabled = meta.story({
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
});

export const OutlinedDense = meta.story({
  args: {
    dense: false,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
});

export const OutlinedDisabledDense = meta.story({
  args: {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
});

// @ts-expect-error Chips uses string[] modelValue for multi-select
export const Chips = meta.story({
  args: {
    chips: true,
    dense: true,
    keyAttr: 'id',
    modelValue: ['3', '4'],
    textAttr: 'label',
    variant: 'outlined',
  },
});

export const CustomValue = meta.story({
  args: {
    customValue: true,
    dense: false,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
});

export const Required = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    required: true,
    textAttr: 'label',
    variant: 'outlined',
  },
});

export default meta;
