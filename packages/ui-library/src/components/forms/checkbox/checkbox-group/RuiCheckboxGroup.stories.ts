import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiCheckboxGroup from '@/components/forms/checkbox/checkbox-group/RuiCheckboxGroup.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiCheckboxGroup<string>>) {
  return {
    components: {
      RuiCheckbox: RuiCheckbox<string>,
      RuiCheckboxGroup: RuiCheckboxGroup<string>,
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
    template: `<RuiCheckboxGroup v-bind="args" v-model="modelValue">
    <RuiCheckbox value="apples">apples</RuiCheckbox>
    <RuiCheckbox value="oranges">oranges</RuiCheckbox>
    <RuiCheckbox value="grapes">grapes</RuiCheckbox>
  </RuiCheckboxGroup>`,
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
    modelValue: { control: 'object' },
    required: { control: 'boolean', table: { category: 'State' } },
    size: { control: 'select', options: ['sm', 'lg'] },
    successMessages: { control: 'object' },
  },
  args: {
    modelValue: [],
  },
  component: RuiCheckboxGroup<string>,
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Checkbox/CheckboxGroup',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const apples = canvas.getByRole('checkbox', { name: 'apples' });
    const oranges = canvas.getByRole('checkbox', { name: 'oranges' });
    await expect(apples).not.toBeChecked();
    await expect(oranges).not.toBeChecked();
    await userEvent.click(apples);
    await expect(apples).toBeChecked();
    await userEvent.click(oranges);
    await expect(oranges).toBeChecked();
    // Both can be checked simultaneously (vs radios)
    await expect(apples).toBeChecked();
  },
});

export const Inline = meta.story({
  args: {
    inline: true,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['Select at least one option'],
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'Pick any combination of fruits',
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

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Disabled Group',
    modelValue: ['apples'],
  },
});

export default meta;
