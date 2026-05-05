import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import preview from '~/.storybook/preview';
import RuiTimezoneSelect from './RuiTimezoneSelect.vue';

function render(args: ComponentPropsAndSlots<typeof RuiTimezoneSelect>) {
  return {
    components: { RuiTimezoneSelect },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <RuiTimezoneSelect v-bind="args" v-model="args.modelValue" />
      </div>
    `,
  };
}

const meta = preview.meta({
  argTypes: {
    'clearable': { control: 'boolean' },
    'dense': { control: 'boolean' },
    'disabled': { control: 'boolean' },
    'errorMessages': { control: 'object' },
    'hideDetails': { control: 'boolean' },
    'hint': { control: 'text' },
    'label': { control: 'text' },
    'modelValue': { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    'placeholder': { control: 'text' },
    'readOnly': { control: 'boolean' },
    'required': { control: 'boolean' },
    'variant': {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
    },
  },
  component: RuiTimezoneSelect,
  render,
  tags: ['autodocs'],
  title: 'Components/TimezoneSelect',
});

export const Default = meta.story({
  args: {
    modelValue: undefined,
  },
});

export const WithValue = meta.story({
  args: {
    modelValue: 'Europe/Madrid',
  },
});

export const Clearable = meta.story({
  args: {
    clearable: true,
    modelValue: 'America/New_York',
  },
});

export const Dense = meta.story({
  args: {
    dense: true,
    modelValue: 'Asia/Tokyo',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    modelValue: 'UTC',
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Pick the timezone for your reports',
    modelValue: undefined,
  },
});

export const WithError = meta.story({
  args: {
    errorMessages: ['A timezone is required'],
    modelValue: undefined,
  },
});

export default meta;
