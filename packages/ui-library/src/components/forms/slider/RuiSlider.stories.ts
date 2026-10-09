import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor } from 'storybook/test';
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
  title: 'Forms/Slider',
});

export const Default = meta.story({
  args: {
    label: 'Label',
    modelValue: 40,
  },
  async play({ canvas }) {
    const slider = canvas.getByRole('slider');
    await expect(slider).toHaveValue('40');
    await expect(canvas.getByText('Value: 40')).toBeVisible();
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    label: 'Label',
    modelValue: 40,
  },
});

export const Vertical = meta.story({
  args: {
    label: 'Label',
    modelValue: 40,
    vertical: true,
  },
  render: args => ({
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
    // a vertical rail fills its parent's height, so the story gives it a fixed one at the left
    template: `<div class="flex h-64 w-fit flex-col items-start">
      <RuiSlider v-bind="args" v-model="modelValue" class="h-48" />
      <div class="text-rui-text">Value: {{ modelValue }}</div>
    </div>`,
  }),
});

export const ShowThumbLabel = meta.story({
  args: {
    label: 'Label',
    modelValue: 40,
    showThumbLabel: true,
  },
  // the value bubble shows while the thumb is pressed or keyboard focused, so the story focuses it
  async play({ canvas, canvasElement, userEvent }) {
    await userEvent.tab();
    await expect(canvas.getByRole('slider')).toHaveFocus();
    await waitFor(() => expect(canvasElement.querySelector('[data-id=slider-thumb-label]')).toBeVisible());
  },
});

export const ShowTicks = meta.story({
  args: {
    label: 'Label',
    modelValue: 40,
    showTicks: true,
    step: 10,
  },
});

export const HideTrack = meta.story({
  args: {
    hideTrack: true,
    label: 'Label',
    modelValue: 40,
  },
});

export const TriStateStyle = meta.story({
  args: {
    label: 'Label',
    max: 2,
    modelValue: 1,
    showTicks: true,
    // the stops are bumps of the rail itself, one tone in each theme, so the end stop stays visible
    classNames: { slider: '!bg-rui-neutral-200 dark:!bg-rui-neutral-700', tick: '!bg-rui-neutral-200 dark:!bg-rui-neutral-700' },
    step: 1,
    tickSize: 12,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    label: 'Label',
    modelValue: 40,
  },
});

export const WithHint = meta.story({
  args: {
    hint: 'With hint',
    label: 'Label',
    modelValue: 40,
  },
});

export const HideDetails = meta.story({
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    modelValue: 40,
  },
});

export const WithErrorMessage = meta.story({
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    modelValue: 40,
  },
});

export const WithSuccessMessage = meta.story({
  args: {
    label: 'Label',
    modelValue: 40,
    successMessages: ['With success messages'],
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Slider',
    modelValue: 40,
    required: true,
  },
});

export default meta;
