import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconBrowser from '@/components/icons/IconBrowser.vue';

const meta: Meta<typeof IconBrowser> = {
  component: IconBrowser,
  tags: ['autodocs'],
  title: 'References/Icons',
  parameters: {
    docs: {
      description: {
        component: 'Browse all available icons. Click on an icon to copy its name to clipboard.',
      },
    },
  },
};

type Story = StoryObj<typeof IconBrowser>;

export const Default: Story = {};

export default meta;
