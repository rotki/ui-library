import { type Meta, type StoryFn } from '@storybook/vue3';
import FooterStepper from './FooterStepper.vue';

const render: StoryFn<typeof FooterStepper> = (_, { argTypes }) => ({
  components: { FooterStepper },
  props: Object.keys(argTypes),
  template: `
    <FooterStepper v-bind="$props" />`,
});

const meta: Meta<typeof FooterStepper> = {
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
  },
  parameters: {
    docs: {
      controls: { exclude: ['update:modelValue'] },
    },
  },
};

export const Default = {
  args: {
    pages: 5,
    modelValue: 1,
    variant: 'numeric',
  },
};

export const Bullet = {
  args: {
    pages: 5,
    modelValue: 1,
    variant: 'bullet',
  },
};

export const Progress = {
  args: {
    pages: 5,
    modelValue: 1,
    variant: 'progress',
  },
};

export const Pills = {
  args: {
    pages: 5,
    modelValue: 1,
    variant: 'pill',
  },
};

export default meta;
