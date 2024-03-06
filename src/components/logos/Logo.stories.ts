import { default as Logo, type Props } from './Logo.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Logo },
  setup() {
    return { args };
  },
  template: `<Logo v-bind="args" />`,
});

const meta: Meta<Props> = {
  argTypes: {
    text: { control: 'boolean' },
  },
  component: Logo,
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
    customSrc:
      'https://raw.githubusercontent.com/rotki/data/hohoho/assets/icons/drawer_logo.png',
  },
};

export const WithCustomSrcAndFallback: Story = {
  args: {
    customSrc:
      'notfoundurl',
  },
};

export default meta;
