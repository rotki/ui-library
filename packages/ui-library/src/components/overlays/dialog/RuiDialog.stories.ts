import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiNotification from '@/components/overlays/notification/RuiNotification.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiDialog>) {
  return {
    components: { RuiButton, RuiCard, RuiDialog },
    setup() {
      return { args };
    },
    template: `
      <RuiDialog v-bind="args">
        <template #activator="{ attrs }">
          <RuiButton v-bind="attrs">
            Click me!
          </RuiButton>
        </template>
        <template #default="{ close }">
          <RuiCard no-padding>
            <template #header>
              Header
            </template>
            <template #subheader>
              Subheader
            </template>

            <div class="p-4 pb-0">
              <div class="h-[300px]">
                Contents
              </div>

              <div class="border-t border-rui-divider py-4">
                <div class="flex gap-2 w-full justify-end">
                  <RuiButton
                    variant="outlined"
                    color="primary"
                    @click="close()"
                  >
                    Close
                  </RuiButton>
                </div>
              </div>
            </div>
          </RuiCard>
        </template>
      </RuiDialog>
    `,
  };
}

const meta = preview.meta({
  args: {
    persistent: false,
    size: 'md',
    width: '98%',
  },
  argTypes: {
    bottomSheet: { control: 'boolean' },
    maxWidth: { control: 'text' },
    persistent: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
    width: { control: 'text' },
  },
  component: RuiDialog,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Overlays/Dialog',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    // Dialog content teleports to document body, query outside canvas
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Contents')).toBeVisible());
    const closeButton = body.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);
    // Verify dialog closed
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
});

export const Persistent = meta.story({
  args: {
    persistent: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Contents')).toBeVisible());
    // Escape should not close a persistent dialog
    await userEvent.keyboard('{Escape}');
    await expect(body.getByText('Contents')).toBeVisible();
    // Close button should still work
    const closeButton = body.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
});

export const BottomSheet = meta.story({
  args: {
    bottomSheet: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Contents')).toBeVisible());
    // Verify bottom sheet positioning via data attribute
    const content = document.querySelector('[data-id=content]');
    expect(content).toHaveAttribute('data-bottom-sheet', 'true');
    const closeButton = body.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
});

/** The width presets, 400 to 1000px, which `--rui-dialog-*` can retune. */
export const Sizes = meta.story({
  render: args => ({
    components: { RuiButton, RuiCard, RuiDialog },
    setup() {
      const sizes = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
      return { args, sizes };
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <RuiDialog v-for="size in sizes" :key="size" v-bind="args" :size="size">
          <template #activator="{ attrs }">
            <RuiButton v-bind="attrs">{{ size }}</RuiButton>
          </template>
          <template #default="{ close }">
            <RuiCard>
              <template #header>size="{{ size }}"</template>
              <p class="text-sm text-rui-text-secondary">A dialog at the {{ size }} preset width.</p>
              <template #footer>
                <RuiButton class="ml-auto" variant="outlined" color="primary" @click="close()">Close</RuiButton>
              </template>
            </RuiCard>
          </template>
        </RuiDialog>
      </div>
    `,
  }),
  async play({ canvas, userEvent }) {
    await userEvent.click(canvas.getByRole('button', { name: 'lg' }));
    const content = await waitFor(() => {
      const element = document.querySelector('[data-id=content]');
      expect(element).not.toBeNull();
      return element;
    });
    // the lg preset resolves through --rui-dialog-lg
    await expect(content).toHaveStyle({ maxWidth: '600px' });
    await userEvent.keyboard('{Escape}');
  },
});

/** An explicit `maxWidth` overrides the preset. */
export const CustomMaxWidth = meta.story({
  args: {
    maxWidth: '720px',
  },
});

/**
 * Popups opened from a dialog sit above it with no `z-index` of their own: the dialog is on the
 * `dialog` layer, its menu on `menu` and the toast on `toast` (see Foundations/Tokens).
 */
export const Stacking = meta.story({
  render: args => ({
    components: { RuiButton, RuiCard, RuiDialog, RuiMenu, RuiNotification },
    setup() {
      const saved = ref<boolean>(false);
      const currency = ref<string>('USD');
      const currencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY'];
      return { args, currencies, currency, saved };
    },
    template: `
      <RuiDialog v-bind="args" size="md">
        <template #activator="{ attrs }">
          <RuiButton v-bind="attrs">Open settings</RuiButton>
        </template>
        <template #default="{ close }">
          <RuiCard>
            <template #header>Display settings</template>
            <div class="flex items-center justify-between gap-4">
              <span class="text-body-2">Main currency</span>
              <RuiMenu close-on-content-click>
                <template #activator="{ attrs }">
                  <RuiButton v-bind="attrs" variant="outlined">{{ currency }}</RuiButton>
                </template>
                <div class="py-1 min-w-32">
                  <RuiButton
                    v-for="option in currencies"
                    :key="option"
                    variant="list"
                    @click="currency = option"
                  >
                    {{ option }}
                  </RuiButton>
                </div>
              </RuiMenu>
            </div>
            <template #footer>
              <div class="flex gap-2 ml-auto">
                <RuiButton variant="text" @click="close()">Cancel</RuiButton>
                <RuiButton color="primary" @click="saved = true">Save</RuiButton>
              </div>
            </template>
          </RuiCard>
        </template>
      </RuiDialog>
      <RuiNotification v-model="saved" :timeout="3000">
        <div class="px-4 py-3 text-body-2">Settings saved</div>
      </RuiNotification>
    `,
  }),
  async play({ canvas, userEvent }) {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }));
    await waitFor(() => expect(body.getByText('Display settings')).toBeVisible());

    // the menu's options are the topmost element where they are drawn
    await userEvent.click(body.getByRole('button', { name: 'USD' }));
    const option = await waitFor(() => body.getByRole('button', { name: 'EUR' }));
    const box = option.getBoundingClientRect();
    await expect(option.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))).toBe(true);
    await userEvent.click(option);

    await userEvent.click(body.getByRole('button', { name: 'Save' }));
    const toast = await waitFor(() => body.getByRole('alert'));
    const toastBox = toast.getBoundingClientRect();
    await expect(toast.contains(document.elementFromPoint(toastBox.x + toastBox.width / 2, toastBox.y + toastBox.height / 2))).toBe(true);
    await userEvent.keyboard('{Escape}');
  },
});

export default meta;
