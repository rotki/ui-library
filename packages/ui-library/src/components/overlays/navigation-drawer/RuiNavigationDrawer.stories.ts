import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiNavigationDrawer from '@/components/overlays/navigation-drawer/RuiNavigationDrawer.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiNavigationDrawer>) {
  return {
    components: { RuiButton, RuiIcon, RuiNavigationDrawer },
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
      <RuiNavigationDrawer v-bind="args" v-model='modelValue'>
        <template #activator="{ attrs }">
          <RuiButton v-bind="attrs">
            Click me!
          </RuiButton>
        </template>
        <nav class="flex flex-col gap-1 p-2">
          <RuiButton variant="text" class="!justify-start gap-3">
            <RuiIcon name="lu-home" />
            <span v-if="!args.miniVariant || modelValue">Home</span>
          </RuiButton>
          <RuiButton variant="text" class="!justify-start gap-3">
            <RuiIcon name="lu-settings" />
            <span v-if="!args.miniVariant || modelValue">Settings</span>
          </RuiButton>
          <RuiButton variant="text" class="!justify-start gap-3">
            <RuiIcon name="lu-user" />
            <span v-if="!args.miniVariant || modelValue">Profile</span>
          </RuiButton>
        </nav>
      </RuiNavigationDrawer>
    `,
  };
}

const meta = preview.meta({
  args: {
    modelValue: false,
  },
  argTypes: {
    miniVariant: { control: 'boolean' },
    overlay: { control: 'boolean' },
    position: {
      control: 'select',
      options: ['left', 'right'],
      table: { category: 'State' },
    },
    temporary: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: RuiNavigationDrawer,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/NavigationDrawer',
});

export const Default = meta.story({
  args: {
    temporary: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Home')).toBeVisible());
    // Close by clicking the activator (toggles the drawer)
    await userEvent.click(activator);
    await waitFor(() => expect(body.queryByText('Home')).toBeNull());
  },
});

export const Right = meta.story({
  args: {
    position: 'right',
    temporary: true,
  },
});

export const Persistent = meta.story({
  args: {},
});

export const MiniVariant = meta.story({
  args: {
    miniVariant: true,
  },
  async play({ canvas, userEvent }) {
    // Mini variant is always visible (collapsed)
    const drawer = document.querySelector('aside[data-id=drawer-content]');
    expect(drawer).toBeTruthy();
    expect(drawer).toHaveAttribute('data-mini');
    expect(drawer).not.toHaveAttribute('data-visible');
    // Expand to full width
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    await waitFor(() => expect(drawer).toHaveAttribute('data-visible'));
    // Collapse back
    await userEvent.click(activator);
    await waitFor(() => expect(drawer).not.toHaveAttribute('data-visible'));
  },
});

export const WithOverlay = meta.story({
  args: {
    overlay: true,
    temporary: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Home')).toBeVisible());
    // Overlay should be visible
    const overlay = document.querySelector('[data-id=overlay]');
    expect(overlay).toBeTruthy();
  },
});

export default meta;
