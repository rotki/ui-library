import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiSlider from '@/components/forms/slider/RuiSlider.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiSlider>) {
  return {
    components: { RuiSlider },
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
    template: `<div>
      <RuiSlider v-bind="args" v-model="modelValue" />
      <div class="text-rui-text">Value: {{ modelValue }}</div>
    </div>`,
  };
}

const meta = preview.meta({
  args: {
    errorMessages: [],
    successMessages: [],
  },
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'object' },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hideTrack: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    modelValue: { control: 'number' },
    required: { control: 'boolean', table: { category: 'State' } },
    showThumbLabel: { control: 'boolean', table: { category: 'State' } },
    showTicks: { control: 'boolean', table: { category: 'State' } },
    step: { control: 'number' },
    successMessages: { control: 'object' },
    vertical: { control: 'boolean', table: { category: 'State' } },
  },
  component: RuiSlider,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Slider',
});

export const Default = meta.story({
  args: {
    label: 'Label',
    modelValue: 0,
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    label: 'Label',
    modelValue: 0,
  },
});

export const Vertical = meta.story({
  args: {
    label: 'Label',
    modelValue: 0,
    vertical: true,
  },
});

export const ShowThumbLabel = meta.story({
  args: {
    label: 'Label',
    modelValue: 0,
    showThumbLabel: true,
  },
});

export const ShowTicks = meta.story({
  args: {
    label: 'Label',
    modelValue: 0,
    showTicks: true,
  },
});

export const HideTrack = meta.story({
  args: {
    hideTrack: true,
    label: 'Label',
    modelValue: 0,
  },
});

export const TriStateStyle = meta.story({
  args: {
    label: 'Label',
    max: 2,
    modelValue: 0,
    showTicks: true,
    sliderClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    step: 1,
    tickClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickSize: 12,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Label',
    modelValue: 0,
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
    modelValue: 0,
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    modelValue: 0,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    modelValue: 0,
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    label: 'Label',
    modelValue: 0,
    successMessages: ['With success messages'],
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Slider',
    modelValue: 0,
    required: true,
  },
});

export default meta;
