import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
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
          'We provide icons from <a target="_blank" href="https://remixicon.com/">Remix icons</a> and <a target="_blank" href="https://lucide.dev/icons">Lucide icons</a>. For remix icons use it without prefix `ri-` (eg: arrow-down-circle-fill), while for lucide icon, you need to add prefix `lu-` (eg: lu-arrow-down).',
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
    name: 'arrow-down-circle-fill',
    size: 24,
  },
};

export const PrimaryLarge: Story = {
  args: {
    color: 'primary',
    name: 'arrow-down-circle-fill',
    size: 48,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    name: 'arrow-down-circle-fill',
    size: 24,
  },
};

export const SecondaryTiny: Story = {
  args: {
    color: 'secondary',
    name: 'arrow-down-circle-fill',
    size: 14,
  },
};

export const LucideIconPrimary: Story = {
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 24,
  },
};

export const LucideIconPrimaryLarge: Story = {
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 48,
  },
};

export default meta;
