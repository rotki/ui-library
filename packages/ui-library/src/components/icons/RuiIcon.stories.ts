import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiIcon, { type Props } from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';

const render: StoryFn<Props> = args => ({
  components: { RuiIcon },
  setup() {
    return { args };
  },
  template: '<RuiIcon v-bind="args" />',
});

const meta: Meta<Props> = {
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
};

type Story = StoryObj<Props>;

export const Primary: Story = {
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 24,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    name: 'lu-arrow-down',
    size: 24,
  },
};

export const PrimaryLarge: Story = {
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 48,
  },
};

export default meta;
