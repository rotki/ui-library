import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiDivider, { type Props } from '@/components/divider/RuiDivider.vue';

const render: StoryFn<Props> = args => ({
  components: { RuiDivider },
  setup() {
    return { args };
  },
  template: `
    <RuiDivider :class="args.vertical ? 'h-96 mx-4' : 'w-96 my-4'" v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    vertical: { control: 'boolean' },
  },
  component: RuiDivider,
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
