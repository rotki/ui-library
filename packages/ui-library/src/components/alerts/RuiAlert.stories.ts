import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
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
  title: 'Feedback/Alert',
});

export const Default = meta.story({
  args: {
    description: 'Description',
    title: 'Title',
  },
});

/** The four status types in each variant. */
export const Variants = meta.story({
  render: () => ({
    components: { RuiAlert },
    setup() {
      const types = ['error', 'warning', 'info', 'success'] as const;
      const variants = ['default', 'filled', 'outlined'] as const;
      return { types, variants };
    },
    template: `
      <div class="grid gap-3 md:grid-cols-3">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-3">
          <span class="text-sm text-rui-text-secondary">{{ variant }}</span>
          <RuiAlert v-for="type in types" :key="type" :type="type" :variant="variant" :title="type" description="What happened, and what to do next." />
        </div>
      </div>`,
  }),
});

export const WithActionButton = meta.story({
  args: {
    actionText: 'Action',
    description: 'Description',
    title: 'Title',
    type: 'error',
  },
  async play({ canvas }) {
    await expect(canvas.getByText('Title')).toBeVisible();
    await expect(canvas.getByText('Description')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Action' })).toBeVisible();
  },
});

export default meta;
