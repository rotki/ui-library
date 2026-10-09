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
      '<div class="text-rui-text"><Progress v-bind="args" /></div>',
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
  title: 'Feedback/Progress',
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

export const WithLabel = meta.story({
  args: {
    showLabel: true,
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
    value: 75,
    variant: 'determinate',
  },
});

export const CircularWithLabelSizes = meta.story({
  parameters: {
    docs: {
      description: {
        story: 'The label scales with the ring. A ring too small for a legible label drops it, keeping its size, and shows the value on hover instead.',
      },
    },
  },
  render(args) {
    return {
      components: { Progress: RuiProgress },
      setup: () => ({ args, sizes: [24, 32, 40, 64, 100], thicknesses: [2, 4] }),
      template: `
        <div class="flex flex-col gap-8 p-4 text-rui-text">
          <div v-for="thickness in thicknesses" :key="thickness" class="flex flex-wrap items-end gap-8">
            <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-2">
              <Progress circular show-label color="primary" :value="72" :size="size" :thickness="thickness" />
              <span class="text-xs text-rui-text-secondary">{{ size }}px, {{ thickness }}px stroke</span>            </div>
          </div>
        </div>`,
    };
  },
});

export const Colors = meta.story({
  render(args) {
    return {
      components: { Progress: RuiProgress },
      setup: () => ({ args, colors: ['inherit', ...contextColors] }),
      template: `
        <div class="flex flex-col gap-4 p-4 text-rui-text">
          <div v-for="color in colors" :key="color" class="flex items-center gap-4">
            <span class="w-20 text-sm">{{ color }}</span>
            <Progress :color="color" :value="60" class="flex-1" />
          </div>
        </div>`,
    };
  },
});

export const CircularColors = meta.story({
  render(args) {
    return {
      components: { Progress: RuiProgress },
      setup: () => ({ args, colors: ['inherit', ...contextColors] }),
      template: `
        <div class="flex flex-wrap gap-6 p-4 text-rui-text">
          <div v-for="color in colors" :key="color" class="flex flex-col items-center gap-2">
            <Progress circular :color="color" :value="60" />
            <span class="text-xs">{{ color }}</span>
          </div>
        </div>`,
    };
  },
});

export default meta;
