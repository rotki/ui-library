import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiSkeletonLoader from '@/components/loaders/RuiSkeletonLoader.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiSkeletonLoader>) {
  return {
    components: { RuiSkeletonLoader },
    setup() {
      return { args };
    },
    template: '<RuiSkeletonLoader v-bind="args" />',
  };
}

const meta = preview.meta({
  args: {
    type: 'text',
  },
  argTypes: {
    class: {
      control: 'text',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    type: {
      control: 'select',
      options: [
        'text',
        'paragraph',
        'heading',
        'article',
        'button',
        'icon',
        'avatar',
        'thumbnail',
        'custom',
      ],
      selected: 'text',
    },
  },
  component: RuiSkeletonLoader,
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Loaders/Skeleton',
});

export const Default = meta.story({
  args: {},
});

export const Paragraph = meta.story({
  args: { type: 'paragraph' },
});

export const Heading = meta.story({
  args: { type: 'heading' },
});

export const Article = meta.story({
  args: { type: 'article' },
});

export const Button = meta.story({
  args: { type: 'button' },
});

export const Icon = meta.story({
  args: { type: 'icon' },
});

export const Avatar = meta.story({
  args: { type: 'avatar' },
});

export const Thumbnail = meta.story({
  args: { type: 'thumbnail' },
});

export const Custom = meta.story({
  args: { class: 'w-20 h-20', rounded: 'lg', type: 'custom' },
});

export const CustomFullRound = meta.story({
  args: { class: 'w-20 h-20', rounded: 'full', type: 'custom' },
});

export default meta;
