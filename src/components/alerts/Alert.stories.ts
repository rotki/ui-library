import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import * as Icons from '@/all-icons';
import Alert from './Alert.vue';

const render: StoryFn<typeof Alert> = (_, { argTypes }) => ({
  components: { Alert },
  props: Object.keys(argTypes),
  template: `<Alert v-bind="$props" class="w-[400px]" />`,
});

const meta: Meta<typeof Alert> = {
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

export const Default = {
  args: {
    title: 'Title',
    description: 'Description',
  },
};

export const Error = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
  },
};

export const Warning = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'warning',
  },
};

export const Info = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'info',
  },
};

export const Success = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'success',
  },
};

export const Filled = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    variant: 'filled',
  },
};

export const Outlined = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    variant: 'outlined',
  },
};

export const WithActionButton = {
  args: {
    title: 'Title',
    description: 'Description',
    type: 'error',
    actionText: 'Action',
  },
};

export default meta;
