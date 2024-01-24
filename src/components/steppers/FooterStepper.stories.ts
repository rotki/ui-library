import { default as FooterStepper, type Props } from './FooterStepper.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { FooterStepper },
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
    <FooterStepper v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    arrowButtons: { control: 'boolean', table: { category: 'State' } },
    modelValue: {
      control: 'number',
      table: { category: 'State' },
    },
    pages: { control: 'number', table: { category: 'State' } },
    variant: {
      control: 'select',
      options: ['numeric', 'bullet', 'progress', 'pill'],
      table: { category: 'State' },
    },
  },
  component: FooterStepper,
  parameters: {
    docs: {
      controls: { exclude: ['update:modelValue'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/FooterStepper',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'numeric',
  },
};

export const Bullet: Story = {
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'bullet',
  },
};

export const Progress: Story = {
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'progress',
  },
};

export const Pills: Story = {
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'pill',
  },
};

export const ArrowButtons: Story = {
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'numeric',
  },
};

export const BulletWithArrows: Story = {
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'bullet',
  },
};

export const ProgressWithArrows: Story = {
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'progress',
  },
};

export default meta;
