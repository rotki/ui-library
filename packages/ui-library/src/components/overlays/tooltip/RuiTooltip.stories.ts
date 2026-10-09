import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { DEFAULT_FLOATING_OPTIONS } from '@/composables/floating';
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
    options: {
      ...DEFAULT_FLOATING_OPTIONS,
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
    options: { control: 'object' },
    text: {
      control: 'text',
    },
  },
  component: RuiTooltip,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Overlays/Tooltip',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const activator = canvas.getByText('Tooltip');
    await userEvent.hover(activator);
    // Tooltip teleports to document body
    const body = within(document.body);
    await expect(body.getByRole('tooltip')).toBeVisible();
    await userEvent.unhover(activator);
    await waitFor(() => expect(body.queryByRole('tooltip')).toBeNull());
  },
});

/** Hover any activator: the four placements, with the arrow and without. */
export const Placements = meta.story({
  render: () => ({
    components: { RuiTooltip },
    setup() {
      const placements = ['top', 'right', 'bottom', 'left'] as const;
      return { placements };
    },
    template: `
      <div class="flex flex-col items-center gap-10 p-16">
        <div v-for="hideArrow in [false, true]" :key="String(hideArrow)" class="flex gap-12">
          <RuiTooltip v-for="placement in placements" :key="placement" :options="{ placement }" :hide-arrow="hideArrow">
            <template #activator>
              <span class="text-rui-primary">{{ placement }}{{ hideArrow ? ', no arrow' : '' }}</span>
            </template>
            Placed {{ placement }}
          </RuiTooltip>
        </div>
      </div>`,
  }),
  async play({ canvas, userEvent }) {
    await userEvent.hover(canvas.getByText('left'));
    const tooltip = await waitFor(() => within(document.body).getByRole('tooltip'));
    await expect(tooltip).toHaveAttribute('data-placement', 'left');
  },
});

const longText = 'The balance includes staked and pending amounts, converted at the latest price from your preferred oracle. Prices older than an hour are refreshed when you open the asset.';

/** A long tooltip wraps at `--rui-tooltip-max-width` (20rem) without any class. */
export const LongText = meta.story({
  args: {
    text: longText,
  },
});

/** A `max-w-*` in `classNames.tooltip` replaces the default width. */
export const CustomMaxWidth = meta.story({
  args: {
    text: longText,
    classNames: { tooltip: 'max-w-48' },
  },
});

export const TooltipDisabled = meta.story({
  args: {
    disabled: true,
  },
  async play({ canvas, userEvent }) {
    const activator = canvas.getByText('Tooltip');
    await userEvent.hover(activator);
    const body = within(document.body);
    // Disabled tooltip should not appear
    await expect(body.queryByRole('tooltip')).toBeNull();
    await userEvent.unhover(activator);
  },
});

export default meta;
