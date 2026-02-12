import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiBottomSheet from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiBottomSheet>) {
  return {
    components: { RuiBottomSheet, RuiButton, RuiCard },
    setup() {
      return { args };
    },
    template: `
      <RuiBottomSheet
        v-bind="args"
        width="900px"
      >
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
              <div class="h-[500px]">
                Contents
              </div>

              <div class="border-t border-default py-4">
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
      </RuiBottomSheet>
    `,
  };
}

const meta = preview.meta({
  args: {
    maxWidth: '500px',
    persistent: false,
    width: '98%',
  },
  argTypes: {
    maxWidth: { control: 'text' },
    persistent: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: RuiBottomSheet,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/BottomSheet',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const activator = canvas.getByRole('button', { name: 'Click me!' });
    await userEvent.click(activator);
    const body = within(document.body);
    await waitFor(() => expect(body.getByText('Contents')).toBeVisible());
    const closeButton = body.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);
    // Verify bottom sheet closed
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
    // Escape should not close a persistent bottom sheet
    await userEvent.keyboard('{Escape}');
    await expect(body.getByText('Contents')).toBeVisible();
    // Close button should still work
    const closeButton = body.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
});

export const CustomMaxWidth = meta.story({
  args: {
    maxWidth: '1000px',
  },
});

export default meta;
