import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import RuiLogo, { type Props } from '@/components/logos/RuiLogo.vue';

const render: StoryFn<Props> = args => ({
  components: { RuiLogo },
  setup() {
    return { args };
  },
  template: `<RuiLogo v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    branch: { control: 'text' },
    logo: { control: 'text' },
    size: { control: 'text' },
    text: { control: 'boolean' },
  },
  component: RuiLogo,
  render,
  tags: ['autodocs'],
  title: 'Components/Logo',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const WithText: Story = {
  args: {
    text: true,
  },
};

export const WithCustomSrc: Story = {
  args: {
    logo: 'drawer_logo',
  },
};

export const WithCustomSrcAndFallback: Story = {
  args: {
    logo: 'notfoundkey',
  },
};

export default meta;
