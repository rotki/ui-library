import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiSimpleSelect from '@/components/forms/select/RuiSimpleSelect.vue';
import preview from '~/.storybook/preview';

type SimpleSelectProps = ComponentPropsAndSlots<typeof RuiSimpleSelect>;

type SimpleSelectMetaArgs = Required<Pick<SimpleSelectProps, 'disabled' | 'options' | 'variant'>>;

function render(args: SimpleSelectProps) {
  return {
    components: { RuiSimpleSelect },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      return { args, modelValue };
    },
    template: `<RuiSimpleSelect v-bind="args" v-model="modelValue" />`,
  };
}

const meta = preview.meta<typeof RuiSimpleSelect, Decorator, SimpleSelectMetaArgs>({
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
});

export const Default = meta.story({
  args: {
    modelValue: 'Option 1',
  },
  async play({ canvas, userEvent }) {
    const select = canvas.getByRole('combobox');
    await expect(select).toHaveValue('Option 1');
    await userEvent.selectOptions(select, 'Option 3');
    await expect(select).toHaveValue('Option 3');
  },
});

export const DefaultDisabled = meta.story({
  args: {
    disabled: true,
    modelValue: 'Option 1',
  },
});

export const Outlined = meta.story({
  args: {
    modelValue: 'Option 1',
    variant: 'outlined',
  },
});

export const OutlinedDisabled = meta.story({
  args: {
    disabled: true,
    modelValue: 'Option 1',
    variant: 'outlined',
  },
});

export default meta;
