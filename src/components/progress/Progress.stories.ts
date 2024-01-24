import { contextColors } from '@/consts/colors';
import { default as Progress, type Props } from './Progress.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Progress },
  setup() {
    return { args };
  },
  template:
    '<div class="text-black dark:text-white"><Progress v-bind="args" /></div>',
});

const meta: Meta<Props> = {
  args: {
    size: 32,
    thickness: 4,
  },
  argTypes: {
    bufferValue: {
      control: 'number',
    },
    circular: { control: 'boolean' },
    color: {
      control: 'select',
      options: ['inherit', ...contextColors],
      selected: 'inherit',
    },
    showLabel: { control: 'boolean' },
    size: { control: 'number' },
    thickness: { control: 'number' },
    value: {
      control: 'number',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer'],
    },
  },
  component: Progress,
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Progress',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    bufferValue: 60,
    circular: false,
    showLabel: false,
    value: 50,
    variant: 'determinate',
  },
};

export const Primary: Story = {
  args: {
    bufferValue: 60,
    circular: false,
    color: 'primary',
    showLabel: false,
    value: 50,
    variant: 'determinate',
  },
};

export const WithLabel: Story = {
  args: {
    showLabel: true,
    value: 50,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    value: 50,
  },
};

export const Indeterminate: Story = {
  args: {
    value: 50,
    variant: 'indeterminate',
  },
};

export const Buffer: Story = {
  args: {
    bufferValue: 70,
    value: 50,
    variant: 'buffer',
  },
};

export const BufferWithLabel: Story = {
  args: {
    bufferValue: 70,
    showLabel: true,
    value: 50,
    variant: 'buffer',
  },
};

export const Circular: Story = {
  args: {
    circular: true,
    value: 50,
  },
};

export const CircularPrimary: Story = {
  args: {
    circular: true,
    color: 'primary',
    value: 50,
  },
};

export const CircularIndeterminate: Story = {
  args: {
    circular: true,
    value: 50,
    variant: 'indeterminate',
  },
};

export const CircularWithLabel: Story = {
  args: {
    circular: true,
    showLabel: true,
    value: 100,
    variant: 'determinate',
  },
};

export default meta;
