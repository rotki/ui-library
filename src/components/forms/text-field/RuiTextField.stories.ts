import { contextColors } from '@/consts/colors';
import RuiTextField, { type TextFieldProps } from '@/components/forms/text-field/RuiTextField.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = TextFieldProps & { modelValue: string; customAppend?: boolean };

const render: StoryFn<Props> = args => ({
  components: { RuiTextField },
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
  template: `<RuiTextField v-model="modelValue" v-bind="args">
    <template v-if="args.customAppend" #append>
      <slot name="append" />
    </template>
  </RuiTextField>`,
});

const meta: Meta<Props> = {
  args: {
    errorMessages: [],
    successMessages: [],
  },
  argTypes: {
    appendIcon: { control: 'text' },
    color: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    dense: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    prependIcon: { control: 'text' },
    readonly: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    successMessages: { control: 'object' },
    textColor: {
      control: 'select',
      options: contextColors,
      table: { category: 'State' },
    },
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      table: { category: 'State' },
    },
  },
  component: RuiTextField,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/TextField',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
  },
};

export const EmailExample: Story = {
  args: {
    customAppend: true,
    hint: 'This is a hint text to help user.',
    label: 'Email',
    placeholder: 'lefteris@rotki.com',
    required: true,
  },
  render: args => ({
    components: { RuiButton, RuiIcon, RuiTextField },
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
    template: `
      <div class="w-1/3">
        <div class="flex gap-2 items-center">
          <RuiTextField 
            v-model="modelValue" 
            v-bind="args"
            class="flex-1"
          >
            <template #prepend>
              <RuiIcon name="mail-line" class="w-4 h-4 text-rui-text-secondary" />
            </template>
            <template #append>
              <RuiButton
                size="sm"
                variant="text"
                class="!p-1 !min-w-0"
                aria-label="Help"
              >
                <RuiIcon name="question-line" class="w-4 h-4" />
              </RuiButton>
            </template>
          </RuiTextField>
          <RuiButton
            size="sm"
            color="primary"
            disabled
          >
            Button CTA
          </RuiButton>
        </div>
      </div>
    `,
  }),
};

export const Filled: Story = {
  args: {
    label: 'Filled Variant',
    placeholder: 'This is a filled variant',
    variant: 'filled',
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    label: 'Dense Field',
    placeholder: 'Compact size',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Field',
    placeholder: 'Cannot be edited',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Readonly Field',
    modelValue: 'Cannot be modified',
    readonly: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['This field has an error'],
    label: 'Error State',
    placeholder: 'Type something...',
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Success State',
    placeholder: 'Type something...',
    successMessages: ['This field is valid'],
  },
};

export const WithHint: Story = {
  args: {
    hint: 'Helper text appears here',
    label: 'Field with Hint',
    placeholder: 'Type something...',
  },
};

export const WithPrependIcon: Story = {
  args: {
    label: 'With Prepend Icon',
    placeholder: 'Type something...',
    prependIcon: 'user-line',
  },
};

export const WithAppendIcon: Story = {
  args: {
    appendIcon: 'search-line',
    label: 'With Append Icon',
    placeholder: 'Search...',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: 'No label text above',
  },
};

export default meta;
