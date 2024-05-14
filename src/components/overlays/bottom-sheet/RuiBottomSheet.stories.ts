import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiBottomSheet, { type BottomSheetProps } from '@/components/overlays/bottom-sheet/RuiBottomSheet.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<BottomSheetProps> = args => ({
  components: { RuiBottomSheet, RuiButton, RuiCard },
  setup() {
    return { args };
  },
  template: `
    <RuiBottomSheet
      v-bind="args"
      width="900px"
    >
      <template #activator="{ on }">
        <RuiButton v-on="on">
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
});

const meta: Meta<BottomSheetProps> = {
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
};

type Story = StoryObj<BottomSheetProps>;

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
