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

      const items = [
        { icon: 'lu-house', id: 'home', label: 'Home' },
        { icon: 'lu-chart-line', id: 'reports', label: 'Reports' },
        { icon: 'lu-wallet', id: 'accounts', label: 'Accounts' },
        { icon: 'lu-settings', id: 'settings', label: 'Settings' },
      ] as const;
      const active = ref<string>('home');
      const expanded = computed<boolean>(() => !args.miniVariant || !!get(modelValue));

      return { active, args, expanded, items, modelValue };
    },
    /*
     * List buttons with 10px padding make 40px squares, which fill a 56px mini drawer, so each icon
     * stays put as the drawer expands and the label slides in beside it. The activator keeps clear of
     * a docked drawer on either side.
     */
    template: `
      <RuiNavigationDrawer v-bind="args" v-model='modelValue' aria-label="Main">
        <template #activator="{ attrs }">
          <div class="px-16">
            <RuiButton v-bind="attrs">
              Click me!
            </RuiButton>
          </div>
        </template>
        <nav class="flex flex-col gap-0.5 p-2">
          <RuiButton
            v-for="item in items"
            :key="item.id"
            variant="list"
            :color="active === item.id ? 'primary' : undefined"
            class="p-2.5 gap-3"
            :active="active === item.id"
            :aria-current="active === item.id ? 'page' : undefined"
            :aria-label="expanded ? undefined : item.label"
            @click="active = item.id"
          >
            <template #prepend>
              <RuiIcon :name="item.icon" size="20" class="shrink-0" />
            </template>
            <template v-if="expanded" #default>
              <span class="truncate">{{ item.label }}</span>
            </template>
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
      // the drawer is fixed to the viewport, so on the docs page each story gets its own frame to sit in
      story: { height: '360px', inline: false },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Navigation/Navigation Drawer',
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
    // Open it again, so the story rests on a visible drawer, without a focus ring on the activator
    await userEvent.click(activator);
    await waitFor(() => expect(body.getByText('Home')).toBeVisible());
    activator.blur();
  },
});

export const Right = meta.story({
  args: {
    modelValue: true,
    position: 'right',
    temporary: true,
  },
});

export const Persistent = meta.story({
  args: {
    modelValue: true,
  },
});

export const MiniVariant = meta.story({
  args: {
    miniVariant: true,
  },
  async play({ canvas, userEvent }) {
    const drawer = document.querySelector('aside[data-id=drawer-content]'); // the mini variant stays on screen, collapsed
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
    activator.blur();
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
