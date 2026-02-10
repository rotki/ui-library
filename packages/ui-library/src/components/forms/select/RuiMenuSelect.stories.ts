import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { options, type SelectOption } from '@/__test__/options';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import preview from '~/.storybook/preview';

type MenuSelectProps = ComponentPropsAndSlots<typeof RuiMenuSelect<string, SelectOption>>;

type MenuSelectMetaArgs = Required<Pick<MenuSelectProps, 'disabled' | 'options' | 'variant'>>;

function render(args: MenuSelectProps) {
  return {
    components: {
      RuiMenuSelect: RuiMenuSelect<string, SelectOption>,
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
  };
}

const meta = preview.meta<typeof RuiMenuSelect<string, SelectOption>, Decorator, MenuSelectMetaArgs>({
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
  component: RuiMenuSelect<string, SelectOption>,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/MenuSelect',
});

export const Default = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

// @ts-expect-error PrimitiveItems uses string[] options instead of SelectOption[]
export const PrimitiveItems = meta.story({
  args: {
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
