import { objectOmit } from '@vueuse/shared';
import Button, {
  type Props as ButtonProps,
} from '@/components/buttons/button/Button.vue';
import Card, { type Props as CardProps } from './Card.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = CardProps & {
  image?: string;
  header?: string;
  customHeader?: string;
  subheader?: string;
  content?: string;
  prepend?: string;
  actions?: (ButtonProps & { text: string })[];
};

const render: StoryFn<Props> = (args) => ({
  components: { Button, Card },
  setup: () => {
    const cardArgs = computed(() =>
      objectOmit(args, ['header', 'subheader', 'content', 'actions']),
    );

    return { cardArgs, args };
  },
  template: `
  <div>
    <Card v-bind="cardArgs">
      <template v-if="args.image" #image><img :src="args.image" alt="card image" /></template>
      <template v-if="args.prepend" #prepend>{{ args.prepend }}</template>
      <template v-if="args.header" #header>{{ args.header }}</template>
      <template v-if="args.customHeader" #custom-header><h5 class="p-4 text-rui-error text-h5">{{ args.customHeader }}</h5></template>
      <template v-if="args.subheader" #subheader>
        {{ args.subheader }}
      </template>
      <p v-if="args.content">{{ args.content }}</p>
      <template v-if="args.actions" #footer>
        <Button
          v-for="(action, i) in args.actions"
          v-bind="action"
          :key="i"
        >
          {{ action.text }}
        </Button>
      </template>
    </Card>
  </div>`,
});

const meta: Meta<Props> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  render,
  argTypes: {
    dense: { control: 'boolean' },
    divide: { control: 'boolean' },
    header: { control: 'text' },
    image: { control: 'text' },
    prepend: { control: 'text' },
    elevation: { control: 'number', max: 24, min: 1 },
    subheader: { control: 'text' },
    content: { control: 'text' },
    customHeader: { control: 'text' },
    variant: {
      control: 'select',
      options: ['flat', 'outlined'],
      defaultValue: 'outlined',
    },
  },
  args: {
    dense: false,
    divide: false,
    variant: 'outlined',
    elevation: 0,
    header: '',
    subheader: '',
    image: '',
    prepend: '',
    customHeader: '',
  },
  parameters: {
    docs: {
      controls: { exclude: ['default', 'footer'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
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
    header: 'Card header',
    subheader: 'Card subheader',
    divide: true,
  },
};

export const Divided: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    divide: true,
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const DividedPrepend: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    prepend: 'OP',
    divide: true,
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const WithImage: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    image: 'https://placehold.co/960x320',
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const DividedWithImage: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    image: 'https://placehold.co/960x320',
    divide: true,
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    actions: [
      { size: 'sm', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'sm', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const DenseFlat: Story = {
  args: {
    dense: true,
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
    actions: [
      {
        size: 'sm',
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
        disabled: true,
      },
      {
        size: 'sm',
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
        disabled: true,
        loading: true,
      },
    ],
  },
};

export const DenseDivide: Story = {
  args: {
    dense: true,
    divide: true,
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    actions: [
      {
        size: 'sm',
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
      },
      {
        size: 'sm',
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
      },
    ],
  },
};

export const Elevated: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
    elevation: 1,
    actions: [
      {
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
      },
      {
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
      },
    ],
  },
};

export const HighElevation: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
    elevation: 4,
    actions: [
      {
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
      },
      {
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
      },
    ],
  },
};

export const CustomHeader: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
    customHeader: 'Custom header',
    variant: 'flat',
    elevation: 4,
    actions: [
      {
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
      },
      {
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
      },
    ],
  },
};

export default meta;
