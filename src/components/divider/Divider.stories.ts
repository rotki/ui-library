import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { default as Divider, type Props } from './Divider.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Divider },
  setup() {
    return { args };
  },
  template: `
    <Divider :class="args.vertical ? 'h-96 mx-4' : 'w-96 my-4'" v-bind="args" />`,
});

const meta: Meta<Props> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  render,
  argTypes: {
    vertical: { control: 'boolean' },
  },
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
