import { objectOmit } from '@vueuse/shared';
import Button, { type Props as ButtonProps } from '@/components/buttons/button/Button.vue';
import Dialog, { type Props as DialogProps } from './Dialog.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = DialogProps & {
  title?: string;
  description?: string;
  content?: string;
  actions?: (ButtonProps & { text: string })[];
};

const render: StoryFn<Props> = args => ({
  components: { Button, Dialog },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    const dialogArgs = computed(() =>
      objectOmit(args, ['title', 'description', 'content', 'actions']),
    );

    return { args, dialogArgs, modelValue };
  },
  template: `
  <div>
    <Button @click="modelValue = true">Toggle Modal</Button>
    <Dialog v-bind="dialogArgs" v-model="modelValue">
      <template v-if="args.description" #description>
        {{ args.description }}
      </template>
      <template v-if="args.title" #title>{{ args.title }}</template>
      <p v-if="args.content">{{ args.content }}</p>
      <template v-if="args.actions" #actions>
        <Button
          v-for="(action, i) in args.actions"
          v-bind="action"
          :key="i"
          @click="modelValue = false"
        >
          {{ action.text }}
        </Button>
      </template>
    </Dialog>
  </div>`,
});

const meta: Meta<Props> = {
  args: {
    dismissible: false,
    modelValue: false,
  },
  argTypes: {
    content: { control: 'text' },
    description: { control: 'text' },
    modelValue: { control: 'boolean' },
    size: {
      control: 'select',
      defaultValue: undefined,
      options: ['sm', 'md', 'lg'],
    },
    title: { control: 'text' },
  },
  component: Dialog,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value', 'default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Dialog',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    size: 'lg',
    title: 'Dialog title',
  },
};

export const Dismissible: Story = {
  args: {
    actions: [
      { color: 'secondary', size: 'lg', text: 'Action 1', variant: 'text' },
      { color: 'primary', size: 'lg', text: 'Action 2', variant: 'text' },
    ],
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    dismissible: true,
    size: 'lg',
    title: 'Dialog title',
  },
};

export const Loading: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        disabled: true,
        size: 'lg',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        disabled: true,
        loading: true,
        size: 'lg',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    dismissible: true,
    size: 'lg',
    title: 'Dialog title',
  },
};

export const SmallSized: Story = {
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
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    dismissible: true,
    size: 'sm',
    title: 'Dialog title',
  },
};

export const DefaultSized: Story = {
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
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    dismissible: true,
    title: 'Dialog title',
  },
};

export const LargeSized: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        size: 'lg',
        text: 'Action 1',
        variant: 'text',
      },
      {
        color: 'primary',
        size: 'lg',
        text: 'Action 2',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet',
    description: 'Dialog description',
    dismissible: true,
    size: 'lg',
    title: 'Dialog title',
  },
};

export const Persistent: Story = {
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
    content: 'Can only be dismissed via action buttons',
    description: 'Dialog description',
    persistent: true,
    size: 'sm',
    title: 'Dialog title',
  },
};

export const Scrollable: Story = {
  args: {
    actions: [
      {
        color: 'secondary',
        size: 'lg',
        text: 'Disagree',
        variant: 'text',
      },
      {
        color: 'primary',
        size: 'lg',
        text: 'Agree',
        variant: 'text',
      },
    ],
    content: 'Lorem ipsum dolor sit amet consecteur '.repeat(1000),
    description: 'agree to proceed',
    persistent: true,
    size: 'lg',
    title: 'Terms and Conditions',
  },
};

export default meta;
