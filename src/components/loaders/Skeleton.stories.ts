import {
  default as Skeleton,
  type Props as SkeletonProps,
} from './Skeleton.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = SkeletonProps & {
  class: string;
};

const render: StoryFn<Props> = args => ({
  components: { Skeleton },
  setup() {
    return { args };
  },
  template: '<Skeleton v-bind="args" />',
});

const meta: Meta<Props> = {
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
  component: Skeleton,
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Loaders/Skeleton',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Paragraph: Story = {
  args: { type: 'paragraph' },
};

export const Heading: Story = {
  args: { type: 'heading' },
};

export const Article: Story = {
  args: { type: 'article' },
};

export const Button: Story = {
  args: { type: 'button' },
};

export const Icon: Story = {
  args: { type: 'icon' },
};

export const Avatar: Story = {
  args: { type: 'avatar' },
};

export const Thumbnail: Story = {
  args: { type: 'thumbnail' },
};

export const Custom: Story = {
  args: { class: 'w-20 h-20', rounded: 'lg', type: 'custom' },
};

export const CustomFullRound: Story = {
  args: { class: 'w-20 h-20', rounded: 'full', type: 'custom' },
};

export default meta;
