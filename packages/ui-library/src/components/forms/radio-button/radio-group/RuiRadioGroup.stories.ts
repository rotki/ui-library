import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiRadioGroup from '@/components/forms/radio-button/radio-group/RuiRadioGroup.vue';
import RuiRadio from '@/components/forms/radio-button/radio/RuiRadio.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiRadioGroup<string>>) {
  return {
    components: {
      RuiRadio: RuiRadio<string>,
      RuiRadioGroup: RuiRadioGroup<string>,
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
    template: `<RuiRadioGroup v-bind="args" v-model="modelValue">
    <RuiRadio value="yes">yes</RuiRadio>
    <RuiRadio value="no">no</RuiRadio>
  </RuiRadioGroup>`,
  };
}

const meta = preview.meta({
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean' },
    hint: { control: 'text' },
    inline: { control: 'boolean' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    successMessages: { control: 'object' },
  },
  component: RuiRadioGroup<string>,
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Radio/RadioGroup',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const yesRadio = canvas.getByRole('radio', { name: 'yes' });
    const noRadio = canvas.getByRole('radio', { name: 'no' });
    // Both should start unchecked
    await expect(yesRadio).not.toBeChecked();
    await expect(noRadio).not.toBeChecked();
    // Select "no" and verify
    await userEvent.click(noRadio);
    await expect(noRadio).toBeChecked();
    await expect(yesRadio).not.toBeChecked();
  },
});

export const Inline = meta.story({
  args: {
    inline: true,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Group',
    required: true,
  },
});

export default meta;
