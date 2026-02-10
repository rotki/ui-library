import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiProgress>) {
  return {
    components: { Progress: RuiProgress },
    setup() {
      return { args };
    },
    template:
      '<div class="text-black dark:text-white"><Progress v-bind="args" /></div>',
  };
}

const meta = preview.meta({
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
  component: RuiProgress,
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Progress',
});

export const Default = meta.story({
  args: {
    bufferValue: 60,
    circular: false,
    showLabel: false,
    value: 50,
    variant: 'determinate',
  },
});

export const Primary = meta.story({
  args: {
    bufferValue: 60,
    circular: false,
    color: 'primary',
    showLabel: false,
    value: 50,
    variant: 'determinate',
  },
});

export const WithLabel = meta.story({
  args: {
    showLabel: true,
    value: 50,
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    value: 50,
  },
});

export const Indeterminate = meta.story({
  args: {
    value: 50,
    variant: 'indeterminate',
  },
});

export const Buffer = meta.story({
  args: {
    bufferValue: 70,
    value: 50,
    variant: 'buffer',
  },
});

export const BufferWithLabel = meta.story({
  args: {
    bufferValue: 70,
    showLabel: true,
    value: 50,
    variant: 'buffer',
  },
});

export const Circular = meta.story({
  args: {
    circular: true,
    value: 50,
  },
});

export const CircularPrimary = meta.story({
  args: {
    circular: true,
    color: 'primary',
    value: 50,
  },
});

export const CircularIndeterminate = meta.story({
  args: {
    circular: true,
    value: 50,
    variant: 'indeterminate',
  },
});

export const CircularWithLabel = meta.story({
  args: {
    circular: true,
    showLabel: true,
    value: 100,
    variant: 'determinate',
  },
});

export default meta;
