import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import * as Icons from '@/icons';
import { default as Alert, type Props } from './Alert.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Alert },
  setup() {
    return { args };
  },
  template: `<Alert v-bind="args" class="w-[400px]" />`,
});

const meta: Meta<Props> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  render,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    type: { control: 'select', options: contextColors },
    icon: {
      control: 'select',
      options: Object.values(Icons).map(({ name }) => name.slice(3)),
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
    actionText: { control: 'text' },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    title: 'Title',
    description: 'Description',
  },
};

export const Error: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
  },
};

export const Warning: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'warning',
  },
};

export const Info: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'info',
  },
};

export const Success: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'success',
  },
};

export const Filled: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    variant: 'outlined',
  },
};

export const WithActionButton: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    actionText: 'Action',
  },
};

export default meta;
