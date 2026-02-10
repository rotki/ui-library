import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
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
