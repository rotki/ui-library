import IconBrowser from '@/components/icons/IconBrowser.vue';
import preview from '~/.storybook/preview';

const meta = preview.meta({
  component: IconBrowser,
  parameters: {
    docs: {
      description: {
        component: 'Browse all available icons. Click on an icon to copy its name to clipboard.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'References/Icons',
});

export const Default = meta.story({});

export default meta;
