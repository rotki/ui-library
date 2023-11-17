import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import {
  default as Skeleton,
  type Props as SkeletonProps,
} from './Skeleton.vue';

type Props = SkeletonProps & {
  class: string;
};

const render: StoryFn<Props> = (args) => ({
  components: { Skeleton },
  setup() {
    return { args };
  },
  template: '<Skeleton v-bind="args" />',
});

const meta: Meta<Props> = {
  title: 'Components/Loaders/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  render,
  argTypes: {
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
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    class: {
      control: 'text',
    },
  },
  args: {
    type: 'text',
  },
  parameters: {
    docs: {
      controls: { exclude: [] },
    },
  },
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
  args: { type: 'custom', class: 'w-20 h-20', rounded: 'lg' },
};

export const CustomFullRound: Story = {
  args: { type: 'custom', class: 'w-20 h-20', rounded: 'full' },
};

export default meta;
