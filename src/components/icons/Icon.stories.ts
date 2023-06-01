import { type Meta, type StoryFn } from '@storybook/vue3';
import Icon from './Icon.vue';
import * as Icons from '~/all-icons';

const render: StoryFn<typeof Icon> = (_, { argTypes }) => ({
  components: { Icon },
  props: Object.keys(argTypes),
  template: '<Icon v-bind="$props" class="text-rui-primary" />',
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
  },
};

export const Primary = {
  args: {
    name: 'arrow-down-circle-fill',
    size: 24,
  },
};

export default meta;
