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
  title: 'Forms/Menu Select',
});

export const Default = meta.story({
  args: {
    keyAttr: 'id',
    label: 'Country',
    modelValue: '1',
    textAttr: 'label',
  },
  async play({ canvas, userEvent }) {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    await expect(body.getAllByRole('option').length).toBeGreaterThan(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
  },
});

// @ts-expect-error PrimitiveItems uses string[] options instead of SelectOption[]
export const PrimitiveItems = meta.story({
  args: {
    label: 'Country name',
    modelValue: 'Greece',
    options: options.map(item => item.label),
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    keyAttr: 'id',
    label: 'Country',
    modelValue: '3',
    textAttr: 'label',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    keyAttr: 'id',
    label: 'Country',
    modelValue: '1',
    textAttr: 'label',
  },
});

/** The clear button shows on hover or focus while a value is set. */
export const Clearable = meta.story({
  args: {
    clearable: true,
    keyAttr: 'id',
    label: 'Country',
    modelValue: '4',
    textAttr: 'label',
  },
});

export const Readonly = meta.story({
  args: {
    keyAttr: 'id',
    label: 'Country',
    modelValue: '3',
    readOnly: true,
    textAttr: 'label',
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['This field is required'],
    keyAttr: 'id',
    label: 'Country',
    modelValue: undefined,
    textAttr: 'label',
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    keyAttr: 'id',
    label: 'Country',
    modelValue: '3',
    successMessages: ['Selection confirmed'],
    textAttr: 'label',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Please select a country',
    keyAttr: 'id',
    label: 'Country',
    modelValue: '2',
    textAttr: 'label',
  },
});

/**
 * The same hint on two fields: the first draws it below the field, the second sets `hideDetails`,
 * which drops the hint and the line it would take.
 */
export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'This hint is only drawn when details are shown',
    keyAttr: 'id',
    label: 'Details hidden',
    modelValue: '1',
    textAttr: 'label',
  },
  render: args => ({
    components: { RuiMenuSelect: RuiMenuSelect<string, SelectOption> },
    setup() {
      const shown = ref<string | undefined>('3');
      const hidden = ref<string | undefined>('1');
      return { args, hidden, shown };
    },
    template: `
      <div class="flex flex-col gap-4">
        <RuiMenuSelect v-bind="args" v-model="shown" label="Details shown" :hide-details="false" />
        <RuiMenuSelect v-bind="args" v-model="hidden" />
      </div>
    `,
  }),
});

export const Required = meta.story({
  args: {
    keyAttr: 'id',
    label: 'Country',
    modelValue: undefined,
    required: true,
    textAttr: 'label',
  },
});

export default meta;
