import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import { default as Progress, type Props } from './Progress.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Progress },
  setup() {
    return { args };
  },
  template:
    '<div class="text-black dark:text-white"><Progress v-bind="args" /></div>',
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
      options: ['inherit', ...contextColors],
      selected: 'inherit',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer'],
    },
    circular: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    thickness: { control: 'number' },
    size: { control: 'number' },
  },
  args: {
    thickness: 4,
    size: 32,
  },
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    value: 50,
    bufferValue: 60,
    variant: 'determinate',
    circular: false,
    showLabel: false,
  },
};

export const Primary: Story = {
  args: {
    value: 50,
    bufferValue: 60,
    variant: 'determinate',
    color: 'primary',
    circular: false,
    showLabel: false,
  },
};

export const WithLabel: Story = {
  args: {
    value: 50,
    showLabel: true,
  },
};

export const Secondary: Story = {
  args: {
    value: 50,
    color: 'secondary',
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
    value: 50,
    bufferValue: 70,
    variant: 'buffer',
  },
};

export const BufferWithLabel: Story = {
  args: {
    value: 50,
    bufferValue: 70,
    variant: 'buffer',
    showLabel: true,
  },
};

export const Circular: Story = {
  args: {
    value: 50,
    circular: true,
  },
};

export const CircularPrimary: Story = {
  args: {
    value: 50,
    circular: true,
    color: 'primary',
  },
};

export const CircularIndeterminate: Story = {
  args: {
    value: 50,
    variant: 'indeterminate',
    circular: true,
  },
};

export const CircularWithLabel: Story = {
  args: {
    value: 100,
    variant: 'determinate',
    circular: true,
    showLabel: true,
  },
};

export default meta;
