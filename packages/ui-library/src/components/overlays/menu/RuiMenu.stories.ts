import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiMenu>) {
  return {
    components: { RuiButton, RuiMenu },
    setup() {
      return { args };
    },
    template: `
      <div class="text-center p-4">
        <RuiMenu v-bind="args">
          <template #activator="{ attrs }">
            <RuiButton v-bind='attrs'>Click Me!</RuiButton>
          </template>
          <div class="px-4 py-3">
            This is menu
          </div>
        </RuiMenu>
      </div>`,
  };
}

const meta = preview.meta({
  args: {
    closeDelay: 0,
    closeOnContentClick: false,
    disabled: false,
    menuClass: 'max-w-[20rem]',
    openDelay: 0,
    openOnHover: false,
    popper: {
      ...DEFAULT_POPPER_OPTIONS,
    },
  },
  argTypes: {
    closeDelay: {
      control: 'number',
    },
    closeOnContentClick: { control: 'boolean' },
    disabled: { control: 'boolean' },
    menuClass: { control: 'text' },
    openDelay: { control: 'number' },
    openOnHover: { control: 'boolean' },
    persistOnActivatorClick: { control: 'boolean' },
    popper: { control: 'object' },
  },
  component: RuiMenu,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Menu',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click Me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    // Close menu with Escape
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export const OpenOnHover = meta.story({
  args: {
    closeDelay: 200,
    openOnHover: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click Me!' });
    await userEvent.hover(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await userEvent.unhover(activator);
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export const CloseOnContentClick = meta.story({
  args: {
    closeOnContentClick: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click Me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    // Clicking menu content should close the menu
    await userEvent.click(body.getByText('This is menu'));
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export const Top = meta.story({
  args: {
    popper: {
      placement: 'top',
    },
  },
});

export const Right = meta.story({
  args: {
    popper: {
      placement: 'right',
    },
  },
});

export const Left = meta.story({
  args: {
    popper: {
      placement: 'left',
    },
  },
});

export const MenuDisabled = meta.story({
  args: {
    disabled: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click Me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    // Disabled menu should not open
    await expect(body.queryByRole('menu')).toBeNull();
  },
});

export const PersistentMenu = meta.story({
  args: {
    persistent: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click Me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    // Simulate click outside — persistent menu should stay open
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await expect(body.getByRole('menu')).toBeVisible();
    // Close via activator toggle
    await userEvent.click(activator);
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export default meta;
