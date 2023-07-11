import { type Meta, type StoryFn } from '@storybook/vue3';
import Progress from './Progress.vue';

const render: StoryFn<typeof Progress> = (_, { argTypes }) => ({
  components: { Progress },
  props: Object.keys(argTypes),
  template: '<Progress v-bind="$props" />',
});

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  render,
  argTypes: {
    value: {
      control: 'number',
    },
    bufferValue: {
      control: 'number',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'inherit'],
      selected: 'primary',
    },
    type: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer'],
    },
    circular: { control: 'boolean', default: true },
  },
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
};

export const Primary = {
  args: {
    value: 0.5,
    bufferValue: 0.6,
    type: 'determinate',
    color: 'primary',
    circular: false,
  },
};

export const Secondary = {
  args: {
    value: 0.5,
    color: 'secondary',
  },
};

export const Inherit = {
  args: {
    value: 0.5,
    color: 'inherit',
  },
};

export const PrimaryIndeterminate = {
  args: {
    value: 0.5,
    type: 'indeterminate',
  },
};

export const PrimaryBuffer = {
  args: {
    value: 0.5,
    bufferValue: 0.7,
    type: 'buffer',
  },
};

export const PrimaryCircular = {
  args: {
    value: 0.5,
    type: 'circular',
  },
};

export default meta;
