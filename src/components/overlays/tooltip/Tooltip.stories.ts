import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';
import Tooltip, { type Props } from './Tooltip.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = args => ({
  components: { Tooltip },
  setup() {
    return { args };
  },
  template: `
    <div class="text-center p-4">
      <Tooltip v-bind="args">
        <template #activator>
          <span class="text-rui-primary"> Tooltip </span>
        </template>
        {{ args.text }}
      </Tooltip>
    </div>`,
});

const meta: Meta<Props> = {
  args: {
    closeDelay: 500,
    disabled: false,
    hideArrow: false,
    openDelay: 0,
    popper: {
      ...DEFAULT_POPPER_OPTIONS,
    },
    text: 'My Tooltip',
  },
  argTypes: {
    closeDelay: {
      control: 'number',
    },
    disabled: { control: 'boolean' },
    hideArrow: { control: 'boolean' },
    openDelay: { control: 'number' },
    popper: { control: 'object' },
    text: {
      control: 'text',
    },
    tooltipClass: { control: 'text' },
  },
  component: Tooltip,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Tooltip',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
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

export const NoArrow: Story = {
  args: {
    hideArrow: true,
  },
};

export const NoArrowTop: Story = {
  args: {
    hideArrow: true,
    popper: {
      placement: 'top',
    },
  },
};

export const NoArrowRight: Story = {
  args: {
    hideArrow: true,
    popper: {
      placement: 'right',
    },
  },
};

export const NoArrowLeft: Story = {
  args: {
    hideArrow: true,
    popper: {
      placement: 'left',
    },
  },
};

export const WithCustomSizeFromTooltipClass: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tooltipClass: 'max-w-[20rem]',
  },
};

export const TooltipDisabled: Story = {
  args: {
    disabled: true,
  },
};

export default meta;
