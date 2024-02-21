import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';
import Button from '@/components/buttons/button/Button.vue';
import Menu, { type Props } from './Menu.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Button, Menu },
  setup() {
    return { args };
  },
  template: `
    <div class="text-center p-4">
      <Menu v-bind="args">
        <template #activator="{ on }">
          <Button v-on="on">Click Me!</Button>
        </template>
        <div class="px-4 py-3">
          This is menu
        </div>
      </Menu>
    </div>`,
});

const meta: Meta<Props> = {
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
    popper: { control: 'object' },
  },
  component: Menu,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Menu',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const OpenOnHover: Story = {
  args: {
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

export default meta;
