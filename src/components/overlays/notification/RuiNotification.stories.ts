import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiNotification, { type NotificationProps } from '@/components/overlays/notification/RuiNotification.vue';

const render: StoryFn<NotificationProps> = args => ({
  components: { RuiButton, RuiNotification },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    return { args, modelValue };
  },
  template: `
    <div>
      <RuiButton @click="modelValue = !modelValue"> Click </RuiButton>
      <RuiNotification v-bind="args" v-model='modelValue'>
        <div class='m-4'>I am a notification</div>
      </RuiNotification>
    </div>
  `,
});

const meta: Meta<NotificationProps> = {
  args: {
    timeout: 0,
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    timeout: { control: 'number' },
    width: { control: 'text' },
  },
  component: RuiNotification,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Notification',
};

type Story = StoryObj<NotificationProps>;

export const Default: Story = {
  args: {
    modelValue: false,
    timeout: 0,
  },
};

export const NonPersistent: Story = {
  args: {
    modelValue: false,
    timeout: 5000,
  },
};

export const Light: Story = {
  args: {
    modelValue: false,
    theme: 'light',
    timeout: 5000,
  },
};

export const Dark: Story = {
  args: {
    modelValue: false,
    theme: 'dark',
    timeout: 5000,
  },
};

export const Persistent: Story = {
  args: {
    modelValue: false,
    timeout: -1,
  },
};

export default meta;
