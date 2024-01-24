import { default as Divider, type Props } from './Divider.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Divider },
  setup() {
    return { args };
  },
  template: `
    <Divider :class="args.vertical ? 'h-96 mx-4' : 'w-96 my-4'" v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    vertical: { control: 'boolean' },
  },
  component: Divider,
  render,
  tags: ['autodocs'],
  title: 'Components/Divider',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
};

export default meta;
