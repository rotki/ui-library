import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiDialog, { type DialogProps } from '@/components/overlays/dialog/RuiDialog.vue';

const render: StoryFn<DialogProps> = args => ({
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
});

const meta: Meta<DialogProps> = {
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
};

type Story = StoryObj<DialogProps>;

export const Default: Story = {
  args: {},
};

export const Persistent: Story = {
  args: {
    persistent: true,
  },
};

export const CustomMaxWidth: Story = {
  args: {
    maxWidth: '1000px',
  },
};

export default meta;
