import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiDialog>) {
  return {
    components: { RuiButton, RuiCard, RuiDialog },
    setup() {
      return { args };
    },
    template: `
      <RuiDialog
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
              <div class="h-[300px]">
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
      </RuiDialog>
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
  component: RuiDialog,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Dialog',
});

export const Default = meta.story({
  args: {},
});

export const Persistent = meta.story({
  args: {
    persistent: true,
  },
});

export const CustomMaxWidth = meta.story({
  args: {
    maxWidth: '1000px',
  },
});

export default meta;
