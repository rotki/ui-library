import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { DEFAULT_FLOATING_OPTIONS } from '@/composables/floating';
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
    classNames: { menu: 'max-w-[20rem]' },
    openDelay: 0,
    openOnHover: false,
    options: {
      ...DEFAULT_FLOATING_OPTIONS,
    },
  },
  argTypes: {
    closeDelay: {
      control: 'number',
    },
    closeOnContentClick: { control: 'boolean' },
    disabled: { control: 'boolean' },
    openDelay: { control: 'number' },
    openOnHover: { control: 'boolean' },
    persistOnActivatorClick: { control: 'boolean' },
    lazy: { control: 'boolean' },
    options: { control: 'object' },
    role: {
      control: 'select',
      options: ['menu', 'listbox', 'tree', 'grid', 'dialog'],
    },
  },
  component: RuiMenu,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Overlays/Menu',
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

/** Open any of them: the menu on each side of its activator. */
export const Placements = meta.story({
  render: () => ({
    components: { RuiButton, RuiMenu },
    setup() {
      const placements = ['top', 'right', 'bottom', 'left'] as const;
      return { placements };
    },
    template: `
      <div class="flex justify-center gap-6 p-24">
        <RuiMenu v-for="placement in placements" :key="placement" :options="{ placement }">
          <template #activator="{ attrs }">
            <RuiButton v-bind="attrs">{{ placement }}</RuiButton>
          </template>
          <div class="px-4 py-3">Placed {{ placement }}</div>
        </RuiMenu>
      </div>`,
  }),
});

/**
 * A menu on every row of a long list. With `lazy` each row renders only its
 * activator until the pointer, focus or a click reaches it, so the list mounts
 * without setting up two hundred popovers.
 */
export const LazyRows = meta.story({
  render: () => ({
    components: { RuiButton, RuiMenu },
    setup() {
      const rows = Array.from({ length: 200 }, (_, index) => index + 1);
      return { rows };
    },
    template: `
      <div class="flex flex-col gap-1 p-4 max-w-md">
        <div v-for="row in rows" :key="row" class="flex items-center justify-between">
          <span>Row {{ row }}</span>
          <RuiMenu lazy>
            <template #activator="{ attrs }">
              <RuiButton v-bind="attrs" size="sm">Actions {{ row }}</RuiButton>
            </template>
            <div class="px-4 py-3">Actions for row {{ row }}</div>
          </RuiMenu>
        </div>
      </div>`,
  }),
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Actions 3' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await waitFor(() => expect(body.getByText('Actions for row 3')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await expect(activator).toHaveFocus();
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
    // Simulate click outside: the persistent menu should stay open
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await expect(body.getByRole('menu')).toBeVisible();
    // Close via activator toggle
    await userEvent.click(activator);
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  },
});

export default meta;
