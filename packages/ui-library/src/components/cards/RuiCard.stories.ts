import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { objectOmit } from '@vueuse/shared';
import RuiButton, { type Props as ButtonProps } from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import preview from '~/.storybook/preview';

type CardStoryArgs = ComponentPropsAndSlots<typeof RuiCard> & {
  content?: string;
  customHeader?: string;
  actions?: (ButtonProps & { text: string })[];
};

function render(args: CardStoryArgs) {
  return {
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
  };
}

const meta = preview.meta({
  args: {
    customHeader: '',
    dense: false,
    divide: false,
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
  parameters: {
    docs: {
      controls: { exclude: ['default', 'footer'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Data Display/Card',
});

export const Default = meta.story({
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet consect '.repeat(10),
    header: 'Card header',
    subheader: 'Card subheader',
  },
});

export const NoActions = meta.story({
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(50),
    header: 'Card header',
    subheader: 'Card subheader',
  },
});

export const DividedNoActions = meta.story({
  args: {
    content: 'Lorem ipsum dolor sit amet consect '.repeat(50),
    divide: true,
    header: 'Card header',
    subheader: 'Card subheader',
  },
});

export const Divided = meta.story({
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
});

export const DividedPrepend = meta.story({
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
});

export const WithImage = meta.story({
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
});

export const DividedWithImage = meta.story({
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
});

export const Dense = meta.story({
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
});

export const DenseFlat = meta.story({
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
});

export const DenseDivide = meta.story({
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
});

export const Flat = meta.story({
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
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
});

export const CustomHeader = meta.story({
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
    header: 'Card header',
    subheader: 'Card subheader',
    variant: 'flat',
  },
});

export default meta;
