import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { default as FooterStepper, type Props } from './FooterStepper.vue';

const render: StoryFn<Props> = (args) => ({
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

    return { modelValue, args };
  },
  template: `
    <FooterStepper v-model="modelValue" v-bind="args" />`,
});

const meta: Meta<Props> = {
  title: 'Components/FooterStepper',
  component: FooterStepper,
  tags: ['autodocs'],
  render,
  argTypes: {
    pages: { control: 'number', table: { category: 'State' } },
    modelValue: {
      control: 'number',
      table: { category: 'State' },
    },
    variant: {
      control: 'select',
      options: ['numeric', 'bullet', 'progress', 'pill'],
      table: { category: 'State' },
    },
    arrowButtons: { control: 'boolean', table: { category: 'State' } },
  },
  parameters: {
    docs: {
      controls: { exclude: ['update:modelValue'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: false,
    variant: 'numeric',
  },
};

export const Bullet: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: false,
    variant: 'bullet',
  },
};

export const Progress: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: false,
    variant: 'progress',
  },
};

export const Pills: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: false,
    variant: 'pill',
  },
};

export const ArrowButtons: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: true,
    variant: 'numeric',
  },
};

export const BulletWithArrows: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: true,
    variant: 'bullet',
  },
};

export const ProgressWithArrows: Story = {
  args: {
    pages: 5,
    modelValue: 1,
    arrowButtons: true,
    variant: 'progress',
  },
};

export default meta;
