import { objectOmit } from '@vueuse/shared';
import Button, {
  type Props as ButtonProps,
} from '@/components/buttons/button/Button.vue';
import Dialog, { type Props as DialogProps } from './Dialog.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

type Props = DialogProps & {
  title?: string;
  description?: string;
  content?: string;
  actions?: (ButtonProps & { text: string })[];
};

const render: StoryFn<Props> = (args) => ({
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

    return { modelValue, args, dialogArgs };
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
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  render,
  argTypes: {
    modelValue: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    content: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: undefined,
    },
  },
  args: {
    modelValue: false,
    dismissible: false,
  },
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value', 'default'] },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'lg',
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const Dismissible: Story = {
  args: {
    dismissible: true,
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'lg',
    actions: [
      { size: 'lg', variant: 'text', text: 'Action 1', color: 'secondary' },
      { size: 'lg', variant: 'text', text: 'Action 2', color: 'primary' },
    ],
  },
};

export const Loading: Story = {
  args: {
    dismissible: true,
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'lg',
    actions: [
      {
        size: 'lg',
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
        disabled: true,
      },
      {
        size: 'lg',
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
        disabled: true,
        loading: true,
      },
    ],
  },
};

export const SmallSized: Story = {
  args: {
    dismissible: true,
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'sm',
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

export const DefaultSized: Story = {
  args: {
    dismissible: true,
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
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

export const LargeSized: Story = {
  args: {
    dismissible: true,
    content: 'Lorem ipsum dolor sit amet',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'lg',
    actions: [
      {
        size: 'lg',
        variant: 'text',
        text: 'Action 1',
        color: 'secondary',
      },
      {
        size: 'lg',
        variant: 'text',
        text: 'Action 2',
        color: 'primary',
      },
    ],
  },
};

export const Persistent: Story = {
  args: {
    persistent: true,
    content: 'Can only be dismissed via action buttons',
    title: 'Dialog title',
    description: 'Dialog description',
    size: 'sm',
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

export const Scrollable: Story = {
  args: {
    persistent: true,
    content: 'Lorem ipsum dolor sit amet consecteur '.repeat(1000),
    title: 'Terms and Conditions',
    description: 'agree to proceed',
    size: 'lg',
    actions: [
      {
        size: 'lg',
        variant: 'text',
        text: 'Disagree',
        color: 'secondary',
      },
      {
        size: 'lg',
        variant: 'text',
        text: 'Agree',
        color: 'primary',
      },
    ],
  },
};

export default meta;
