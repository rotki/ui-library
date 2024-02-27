import { contextColors } from '@/consts/colors';
import { type Props, default as Slider } from './Slider.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Slider },
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
  template: `<div>
    <Slider v-bind="args" v-model="modelValue" />
    <div class="text-rui-text">Value: {{ modelValue }}</div>
  </div>`,
});

const meta: Meta<Props> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    errorMessages: { control: 'array', defaultValue: [] },
    hideDetails: { control: 'boolean', table: { category: 'State' } },
    hideTrack: { control: 'boolean', table: { category: 'State' } },
    hint: { control: 'text' },
    label: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    modelValue: { control: 'number' },
    showThumbLabel: { control: 'boolean', table: { category: 'State' } },
    showTicks: { control: 'boolean', table: { category: 'State' } },
    step: { control: 'number' },
    successMessages: { control: 'array', defaultValue: [] },
    vertical: { control: 'boolean', table: { category: 'State' } },
  },
  component: Slider,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/Slider',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Label',
    modelValue: 0,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    label: 'Label',
    modelValue: 0,
  },
};

export const Vertical: Story = {
  args: {
    label: 'Label',
    modelValue: 0,
    vertical: true,
  },
};

export const ShowThumbLabel: Story = {
  args: {
    label: 'Label',
    modelValue: 0,
    showThumbLabel: true,
  },
};

export const ShowTicks: Story = {
  args: {
    label: 'Label',
    modelValue: 0,
    showTicks: true,
  },
};

export const HideTrack: Story = {
  args: {
    hideTrack: true,
    label: 'Label',
    modelValue: 0,
  },
};

export const TriStateStyle: Story = {
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
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Label',
    modelValue: 0,
  },
};

export const WithHint: Story = {
  args: {
    hint: 'With hint',
    label: 'Label',
    modelValue: 0,
  },
};

export const HideDetails: Story = {
  args: {
    hideDetails: true,
    hint: 'Hint (should be invisible)',
    label: 'Label',
    modelValue: 0,
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessages: ['With error messages'],
    label: 'Label',
    modelValue: 0,
  },
};

export const WithSuccessMessage: Story = {
  args: {
    label: 'Label',
    modelValue: 0,
    successMessages: ['With success messages'],
  },
};

export default meta;
