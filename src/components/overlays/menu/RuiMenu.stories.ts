import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu, { type MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';

const render: StoryFn<MenuProps> = args => ({
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
});

const meta: Meta<MenuProps> = {
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
};

type Story = StoryObj<MenuProps>;

export const Default: Story = {
  args: {},
};

export const OpenOnHover: Story = {
  args: {
    closeDelay: 200,
    openOnHover: true,
  },
};

export const CloseOnContentClick: Story = {
  args: {
    closeOnContentClick: true,
  },
};

export const Top: Story = {
  args: {
    popper: {
      placement: 'top',
    },
  },
};

export const Right: Story = {
  args: {
    popper: {
      placement: 'right',
    },
  },
};

export const Left: Story = {
  args: {
    popper: {
      placement: 'left',
    },
  },
};

export const MenuDisabled: Story = {
  args: {
    disabled: true,
  },
};

export const PersistentMenu: Story = {
  args: {
    persistent: true,
  },
};

export default meta;
