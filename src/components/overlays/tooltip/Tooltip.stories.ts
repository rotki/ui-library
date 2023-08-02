import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';
import Tooltip, { type Props } from './Tooltip.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<Props> = (args) => ({
  components: { Tooltip },
  setup() {
    return { args };
  },
  template:
    '<div class="text-center p-4"><Tooltip v-bind="args"><span class="text-rui-primary"> Tooltip </span></Tooltip></div>',
});

const meta: Meta<Props> = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  render,
  argTypes: {
    closeDelay: {
      control: 'number',
    },
    text: {
      control: 'text',
    },
    openDelay: { control: 'number' },
    hideArrow: { control: 'boolean' },
    disabled: { control: 'boolean' },
    popper: { control: 'object' },
  },
  args: {
    text: 'My Tooltip',
    closeDelay: 500,
    openDelay: 0,
    disabled: false,
    hideArrow: false,
    popper: {
      ...DEFAULT_POPPER_OPTIONS,
    },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
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

export const TooltipDisabled: Story = {
  args: {
    disabled: true,
  },
};

export default meta;
