import { type StoryFn } from '@storybook/vue';
import Button from './Button.vue';

const render: StoryFn<typeof Button> = (_, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props" />'
});

export default {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  render,
  argTypes: {
    color: { control: 'color' },
    outlined: { control: 'boolean' }
  }
};

export const Primary = {
  args: {
    label: 'Button'
  }
};

export const Outlined = {
  args: {
    label: 'Outlined Button',
    outlined: true
  }
};
