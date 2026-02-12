import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiNotification from '@/components/overlays/notification/RuiNotification.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiNotification>) {
  return {
    components: { RuiButton, RuiNotification },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
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
  };
}

const meta = preview.meta({
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
});

export const Default = meta.story({
  args: {
    modelValue: false,
    timeout: 0,
  },
  async play({ canvas, userEvent }) {
    const button = canvas.getByRole('button', { name: 'Click' });
    await userEvent.click(button);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('alert')).toBeVisible());
    // Dismiss notification by clicking it
    await userEvent.click(body.getByRole('alert'));
    await waitFor(() => expect(body.queryByRole('alert')).toBeNull());
  },
});

export const NonPersistent = meta.story({
  args: {
    modelValue: false,
    timeout: 5000,
  },
});

export const Light = meta.story({
  args: {
    modelValue: false,
    theme: 'light',
    timeout: 5000,
  },
});

export const Dark = meta.story({
  args: {
    modelValue: false,
    theme: 'dark',
    timeout: 5000,
  },
});

export const Persistent = meta.story({
  args: {
    modelValue: false,
    timeout: -1,
  },
});

export default meta;
