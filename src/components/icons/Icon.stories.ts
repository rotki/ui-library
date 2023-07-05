import { type Meta, type StoryFn } from '@storybook/vue3';
import * as Icons from '@/all-icons';
import { contextColors } from '@/consts/colors';
import Icon from './Icon.vue';

const render: StoryFn<typeof Icon> = (_, { argTypes }) => ({
  components: { Icon },
  props: Object.keys(argTypes),
  template: '<Icon v-bind="$props" />',
});

const meta: Meta<typeof Icon> = {
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

export const Primary = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 24,
    color: 'primary',
  },
};

export const PrimaryLarge = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 48,
    color: 'primary',
  },
};

export const Secondary = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 24,
    color: 'secondary',
  },
};

export const SecondaryTiny = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 14,
    color: 'secondary',
  },
};

export default meta;
