import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { default as Progress, type Props } from './Progress.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Progress },
  setup() {
    return { args };
  },
  template: '<Progress v-bind="args" />',
});

const meta: Meta<Props> = {
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
    variant: {
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

type Story = StoryObj<Props>;

export const Primary: Story = {
  args: {
    value: 0.5,
    bufferValue: 0.6,
    variant: 'determinate',
    color: 'primary',
    circular: false,
    showLabel: false,
  },
};

export const PrimaryWithLabel: Story = {
  args: {
    value: 0.5,
    showLabel: true,
  },
};

export const Secondary: Story = {
  args: {
    value: 0.5,
    color: 'secondary',
  },
};

export const Inherit: Story = {
  args: {
    value: 0.5,
    color: 'inherit',
  },
};

export const PrimaryIndeterminate: Story = {
  args: {
    value: 0.5,
    variant: 'indeterminate',
  },
};

export const PrimaryBuffer: Story = {
  args: {
    value: 0.5,
    bufferValue: 0.7,
    variant: 'buffer',
  },
};

export const BufferWithLabel: Story = {
  args: {
    value: 0.5,
    bufferValue: 0.7,
    variant: 'buffer',
    showLabel: true,
  },
};

export const PrimaryCircular: Story = {
  args: {
    value: 0.5,
    circular: true,
  },
};

export const CircularIndeterminate: Story = {
  args: {
    value: 0.5,
    variant: 'indeterminate',
    circular: true,
  },
};

export const CircularWithLabel: Story = {
  args: {
    value: 1,
    variant: 'determinate',
    circular: true,
    showLabel: true,
  },
};

export default meta;
