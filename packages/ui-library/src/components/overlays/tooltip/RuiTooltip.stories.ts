import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { DEFAULT_POPPER_OPTIONS } from '@/composables/popper';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiTooltip>) {
  return {
    components: { RuiTooltip },
    setup() {
      return { args };
    },
    template: `
      <div class="text-center p-4">
        <RuiTooltip v-bind="args">
          <template #activator>
            <span class="text-rui-primary"> Tooltip </span>
          </template>
          {{ args.text }}
        </RuiTooltip>
      </div>`,
  };
}

const meta = preview.meta({
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
  component: RuiTooltip,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Tooltip',
});

export const Default = meta.story({
  args: {},
});

export const Top = meta.story({
  args: {
    popper: {
      placement: 'top',
    },
  },
});

export const Right = meta.story({
  args: {
    popper: {
      placement: 'right',
    },
  },
});

export const Left = meta.story({
  args: {
    popper: {
      placement: 'left',
    },
  },
});

export const NoArrow = meta.story({
  args: {
    hideArrow: true,
  },
});

export const NoArrowTop = meta.story({
  args: {
    hideArrow: true,
    popper: {
      placement: 'top',
    },
  },
});

export const NoArrowRight = meta.story({
  args: {
    hideArrow: true,
    popper: {
      placement: 'right',
    },
  },
});

export const NoArrowLeft = meta.story({
  args: {
    hideArrow: true,
    popper: {
      placement: 'left',
    },
  },
});

export const WithCustomSizeFromTooltipClass = meta.story({
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tooltipClass: 'max-w-[20rem]',
  },
});

export const TooltipDisabled = meta.story({
  args: {
    disabled: true,
  },
});

export default meta;
