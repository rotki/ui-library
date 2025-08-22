import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { objectOmit } from '@vueuse/shared';
import RuiButton, { type Props as ButtonProps } from '@/components/buttons/button/RuiButton.vue';
import RuiCard, { type Props as CardProps } from '@/components/cards/RuiCard.vue';

type Props = CardProps & {
  image?: string;
  header?: string;
  customHeader?: string;
  subheader?: string;
  content?: string;
  prepend?: string;
  actions?: (ButtonProps & { text: string })[];
};

const render: StoryFn<Props> = args => ({
  components: { RuiButton, RuiCard },
  setup: () => {
    const cardArgs = computed(() =>
      objectOmit(args, ['header', 'subheader', 'content', 'actions']),
    );

    return { args, cardArgs };
  },
  template: `
      <div>
        <RuiCard v-bind="cardArgs">
          <template v-if="args.image" #image><img :src="args.image" alt="card image" /></template>
          <template v-if="args.prepend" #prepend>{{ args.prepend }}</template>
          <template v-if="args.header" #header>{{ args.header }}</template>
          <template v-if="args.customHeader" #custom-header><h5 class="p-4 text-rui-error text-h5">
            {{ args.customHeader }}</h5></template>
          <template v-if="args.subheader" #subheader>
            {{ args.subheader }}
          </template>
          <p v-if="args.content">{{ args.content }}</p>
          <template v-if="args.actions" #footer>
            <RuiButton
                v-for="(action, i) in args.actions"
                v-bind="action"
                :key="i"
            >
              {{ action.text }}
            </RuiButton>
          </template>
        </RuiCard>
      </div>`,
});

const meta: Meta<Props> = {
  args: {
    customHeader: '',
    dense: false,
    divide: false,
    elevation: 0,
    header: '',
    image: '',
    prepend: '',
    rounded: 'md',
    subheader: '',
    variant: 'outlined',
  },
  argTypes: {
    content: { control: 'text' },
    customHeader: { control: 'text' },
    dense: { control: 'boolean' },
    divide: { control: 'boolean' },
    elevation: { control: 'number', max: 24, min: 1 },
    header: { control: 'text' },
    image: { control: 'text' },
    prepend: { control: 'text' },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    subheader: { control: 'text' },
    variant: {
      control: 'select',
      options: ['flat', 'outlined'],
    },
  },
  component: RuiCard,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'footer'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Card',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const NoActions: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(50),
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const DividedNoActions: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(50),
    divide: true,
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const Divided: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    divide: true,
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const DividedPrepend: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    divide: true,
    header: 'Card header',
    prepend: 'OP',
    subheader: 'Card subheader',
  },
};

export const WithImage: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    image: 'https://placehold.co/960x320',
    subheader: 'Card subheader',
  },
};

export const DividedWithImage: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    divide: true,
    header: 'Card header',
    image: 'https://placehold.co/960x320',
    subheader: 'Card subheader',
  },
};

export const Dense: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'sm', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'sm', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    dense: true,
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const DenseFlat: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        disabled: true,
        size: 'sm',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        disabled: true,
        loading: true,
        size: 'sm',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    dense: true,
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
};

export const DenseDivide: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        size: 'sm',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        size: 'sm',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    dense: true,
    divide: true,
    header: 'Card header',
    subheader: 'Card subheader',
  },
};

export const Elevated: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    elevation: 1,
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
};

export const HighElevation: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    elevation: 4,
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
};

export const CustomHeader: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    customHeader: 'Custom header',
    elevation: 4,
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
};

export default meta;
