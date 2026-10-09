import type { ComponentPropsAndSlots, Decorator } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import { options, type SelectOption } from '@/__test__/options';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';
import preview from '~/.storybook/preview';

type MenuSelectProps = ComponentPropsAndSlots<typeof RuiMenuSelect<string, SelectOption>>;

type MenuSelectMetaArgs = Required<Pick<MenuSelectProps, 'disabled' | 'options'>>;

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

const meta = preview.meta<
  typeof RuiMenuSelect<string, SelectOption>,
  Decorator,
  MenuSelectMetaArgs
>({
  args: {
    disabled: false,
    options,
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'text' },
    options: { control: 'object' },
    required: { control: 'boolean', table: { category: 'State' } },
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
  async play({ canvas, userEvent }) {
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

// @ts-expect-error PrimitiveItems uses string[] options instead of SelectOption[]
export const PrimitiveItems = meta.story({
  args: {
    options: options.map(item => item.label),
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const DisabledDense = meta.story({
  args: {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const Readonly = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: '3',
    readOnly: true,
    textAttr: 'label',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['This field is required'],
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: '3',
    successMessages: ['Selection confirmed'],
    textAttr: 'label',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Please select a country',
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'This hint should not be rendered',
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const Required = meta.story({
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    required: true,
    textAttr: 'label',
  },
});

export default meta;
