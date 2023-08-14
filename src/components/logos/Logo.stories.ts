import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { default as Logo, type Props } from './Logo.vue';

const render: StoryFn<Props> = (args) => ({
  components: { Logo },
  setup() {
    return { args };
  },
  template: `<Logo v-bind="args" />`,
});

const meta: Meta<Props> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  render,
  argTypes: {
    text: { control: 'boolean' },
  },
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
    customSrc:
      'https://raw.githubusercontent.com/rotki/data/hohoho/assets/icons/drawer_logo.png',
  },
};

export default meta;
