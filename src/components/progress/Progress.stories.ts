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
    circular: { control: 'boolean' },
    showLabel: { control: 'boolean' },
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
    showLabel: false,
  },
};

export const PrimaryWithLabel = {
  args: {
    value: 0.5,
    showLabel: true,
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

export const BufferWithLabel = {
  args: {
    value: 0.5,
    bufferValue: 0.7,
    type: 'buffer',
    showLabel: true,
  },
};

export const PrimaryCircular = {
  args: {
    value: 0.5,
    circular: true,
  },
};

export const CircularIndeterminate = {
  args: {
    value: 0.5,
    type: 'indeterminate',
    circular: true,
  },
};

export const CircularWithLabel = {
  args: {
    value: 1,
    type: 'determinate',
    circular: true,
    showLabel: true,
  },
};

export default meta;
