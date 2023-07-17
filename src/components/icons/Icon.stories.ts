import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import * as Icons from '@/all-icons';
import { contextColors } from '@/consts/colors';
import { default as Icon, type Props } from './Icon.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Icon },
  setup() {
    return { args };
  },
  template: '<Icon v-bind="args" />',
});

const meta: Meta<Props> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'All icons can be seen here: <a target="_blank" href="https://remixicon.com/">https://remixicon.com/</a>. Use it <b>without</b> prefix `ri-`',
      },
    },
  },
  tags: ['autodocs'],
  render,
  argTypes: {
    name: {
      control: 'select',
      options: Object.values(Icons).map(({ name }) => name.slice(3)),
    },
    size: {
      control: 'number',
    },
    color: { control: 'select', options: contextColors },
  },
};

type Story = StoryObj<Props>;

export const Primary: Story = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 24,
    color: 'primary',
  },
};

export const PrimaryLarge: Story = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 48,
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 24,
    color: 'secondary',
  },
};

export const SecondaryTiny: Story = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 14,
    color: 'secondary',
  },
};

export default meta;
