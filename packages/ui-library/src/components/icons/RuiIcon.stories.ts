import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiIcon>) {
  return {
    components: { RuiIcon },
    setup() {
      return { args };
    },
    template: '<RuiIcon v-bind="args" />',
  };
}

const meta = preview.meta({
  argTypes: {
    color: { control: 'select', options: contextColors },
    name: {
      control: 'select',
      options: RuiIcons,
    },
    size: {
      control: 'number',
    },
  },
  component: RuiIcon,
  parameters: {
    docs: {
      description: {
        component:
          'We provide icons from <a target="_blank" href="https://lucide.dev/icons">Lucide icons</a>. To use it, you need to add prefix `lu-` (eg: lu-arrow-down).',
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Icon',
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 24,
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    name: 'lu-arrow-down',
    size: 24,
  },
});

export const PrimaryLarge = meta.story({
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 48,
  },
});

export default meta;
