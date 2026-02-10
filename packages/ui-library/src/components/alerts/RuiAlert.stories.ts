import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiAlert from '@/components/alerts/RuiAlert.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiAlert>) {
  return {
    components: { RuiAlert },
    setup() {
      return { args };
    },
    template: `
      <RuiAlert v-bind="args" class="w-[400px]" />`,
  };
}

const meta = preview.meta({
  argTypes: {
    actionText: { control: 'text' },
    description: { control: 'text' },
    icon: {
      control: 'select',
      options: RuiIcons,
    },
    title: { control: 'text' },
    type: { control: 'select', options: contextColors },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: { category: 'State' },
    },
  },
  component: RuiAlert,
  render,
  tags: ['autodocs'],
  title: 'Components/Alert',
});

export const Default = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
  },
});

export const Error = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'error',
  },
});

export const Warning = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'warning',
  },
});

export const Info = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'info',
  },
});

export const Success = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'success',
  },
});

export const Filled = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'error',
    variant: 'filled',
  },
});

export const Outlined = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
    type: 'error',
    variant: 'outlined',
  },
});

export const WithActionButton = meta.story({
  args: {
    actionText: 'Action',
    description: 'Description',
    title: 'Title',
    type: 'error',
  },
});

export default meta;
