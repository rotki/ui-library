import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect, waitFor, within } from 'storybook/test';
import RuiButtonGroup from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiButtonGroup<string | number>>) {
  return {
    components: { RuiButton, RuiButtonGroup, RuiIcon },
    setup() {
      const count = ref(0);
      return { args, count };
    },
    template: `
    <div v-if="'modelValue' in args">
      <RuiButtonGroup v-bind="args" v-model="args.modelValue">
        <RuiButton model-value="start" aria-label="Align start">
          <RuiIcon name="lu-align-start-horizontal" />
        </RuiButton>
        <RuiButton model-value="center" aria-label="Align center">
          <RuiIcon name="lu-align-center-horizontal" />
        </RuiButton>
        <RuiButton model-value="end" aria-label="Align end">
          <RuiIcon name="lu-align-end-horizontal" />
        </RuiButton>
        <RuiButton model-value="justify" aria-label="Justify">
          <RuiIcon name="lu-align-horizontal-justify-center" />
        </RuiButton>
      </RuiButtonGroup>
      <div v-if="args.required" class="mt-4 text-rui-error">required: *</div>
    </div>
    <div v-else>
      <RuiButtonGroup v-bind="args">
        <RuiButton @click="count--">Decrease</RuiButton>
        <RuiButton @click="count++">Increase</RuiButton>
        <RuiButton aria-label="Add one" @click="count++">
          <RuiIcon name="lu-plus"></RuiIcon>
        </RuiButton>
      </RuiButtonGroup>
      <div class="mt-4 text-rui-text">Count: {{ count }}</div>
    </div>
  `,
  };
}

const meta = preview.meta({
  argTypes: {
    activeColor: { control: 'select', options: contextColors },
    color: { control: 'select', options: contextColors },
    gap: { control: 'select', options: ['md', 'sm', 'lg'] },
    size: { control: 'select', options: ['md', 'sm', 'lg', 'xl'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text', 'segmented'],
      table: { category: 'Shape' },
    },
    vertical: { control: 'boolean' },
  },
  component: RuiButtonGroup<string | number>,
  render,
  tags: ['autodocs'],
  title: 'Actions/Button Group',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText('Count: 0')).toBeVisible();
    const increaseButton = canvas.getByRole('button', { name: 'Increase' });
    await userEvent.click(increaseButton);
    await expect(canvas.getByText('Count: 1')).toBeVisible();
  },
});

export const Vertical = meta.story({
  args: {
    vertical: true,
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
  },
});

export const SmallGap = meta.story({
  args: {
    gap: 'sm',
  },
});

/** The three variants: joined filled buttons, an outlined frame, and bare text buttons. */
export const Variants = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup },
    setup() {
      return { variants: ['default', 'outlined', 'text'] as const };
    },
    template: `
      <div class="flex flex-col gap-3">
        <RuiButtonGroup v-for="variant in variants" :key="variant" :variant="variant" color="primary">
          <RuiButton>Day</RuiButton>
          <RuiButton>Week</RuiButton>
          <RuiButton>Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

export const Sizes = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup },
    setup() {
      return { sizes: ['sm', undefined, 'lg', 'xl'] as const };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <RuiButtonGroup v-for="size in sizes" :key="size ?? 'md'" :size="size" color="primary">
          <RuiButton>{{ size ?? 'md' }}</RuiButton>
          <RuiButton>Week</RuiButton>
          <RuiButton>Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

/** A single-choice toggle: the bound value is the `model-value` of the pressed button. */
export const Toggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 'start',
  },
  async play({ canvas, userEvent }) {
    const center = canvas.getByRole('button', { name: 'Align center' });
    await userEvent.click(center);
    await expect(center).toHaveAttribute('data-active', 'true');
    await expect(canvas.getByRole('button', { name: 'Align start' })).not.toHaveAttribute('data-active');
  },
});

export const ToggleRequired = meta.story({
  args: {
    color: 'primary',
    modelValue: 'start',
    required: true,
  },
});

export const VerticalToggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 'start',
    vertical: true,
  },
});

/** The toggle in the outlined and text variants, and with a separate color for the pressed button. */
export const ToggleVariants = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup, RuiIcon },
    setup() {
      const outlined = ref<string>('day');
      const text = ref<string>('week');
      const activeColor = ref<string>('month');
      return { activeColor, outlined, text };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <RuiButtonGroup v-model="outlined" variant="outlined" color="primary">
          <RuiButton model-value="day">Day</RuiButton><RuiButton model-value="week">Week</RuiButton><RuiButton model-value="month">Month</RuiButton>
        </RuiButtonGroup>
        <RuiButtonGroup v-model="text" variant="text" color="primary">
          <RuiButton model-value="day">Day</RuiButton><RuiButton model-value="week">Week</RuiButton><RuiButton model-value="month">Month</RuiButton>
        </RuiButtonGroup>
        <RuiButtonGroup v-model="activeColor" variant="text" color="primary" active-color="warning">
          <RuiButton model-value="day">Day</RuiButton><RuiButton model-value="week">Week</RuiButton><RuiButton model-value="month">Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

/**
 * A segmented control built from buttons, drawn like `RuiTabs variant="segmented"`. Reach for it when
 * the options switch a setting or a filter; when they switch the view below, use the segmented tabs,
 * which bring the tab roles and arrow-key navigation. It is neutral, so `color` has no effect.
 */
export const Segmented = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup, RuiIcon },
    setup() {
      const range = ref<string>('1W');
      const ranges = ['1D', '1W', '1M', '1Y', 'All'];
      const layout = ref<string>('list');
      return { layout, range, ranges };
    },
    template: `
      <div class="flex flex-col items-start gap-4">
        <RuiButtonGroup v-model="range" variant="segmented" required>
          <RuiButton v-for="option in ranges" :key="option" :model-value="option">{{ option }}</RuiButton>
        </RuiButtonGroup>
        <RuiButtonGroup v-model="layout" variant="segmented" required>
          <RuiButton model-value="list" aria-label="List view"><RuiIcon name="lu-list" size="16" /></RuiButton>
          <RuiButton model-value="grid" aria-label="Grid view"><RuiIcon name="lu-layout-grid" size="16" /></RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
  async play({ canvas, userEvent }) {
    const month = canvas.getByRole('button', { name: '1M' });
    await userEvent.click(month);
    await expect(month).toHaveAttribute('data-active', 'true');
    await expect(canvas.getByRole('button', { name: '1W' })).not.toHaveAttribute('data-active');
  },
});

/** A multiple-choice toggle: the bound value is the list of pressed buttons' `model-value`s. */
export const ToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: ['start'],
  },
});

export const ToggleMultipleRequired = meta.story({
  args: {
    color: 'primary',
    modelValue: ['start'],
    required: true,
  },
});

/**
 * A split button: an action with a tooltip and a chevron that opens a menu. The group reaches a
 * RuiButton at any depth, so the wrapped buttons join it without corner or border overrides, while the
 * buttons inside the menu stay plain.
 */
export const SplitButton = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup, RuiIcon, RuiMenu, RuiTooltip },
    template: `
      <RuiButtonGroup color="primary">
        <RuiTooltip :open-delay="400">
          <template #activator>
            <RuiButton>Refresh</RuiButton>
          </template>
          Refresh all balances
        </RuiTooltip>
        <RuiMenu>
          <template #activator="{ attrs }">
            <RuiButton icon aria-label="More refresh options" v-bind="attrs">
              <RuiIcon name="lu-chevron-down" />
            </RuiButton>
          </template>
          <div class="py-1">
            <RuiButton variant="list">Refresh prices</RuiButton>
            <RuiButton variant="list">Refresh accounts</RuiButton>
          </div>
        </RuiMenu>
      </RuiButtonGroup>`,
  }),
  async play({ canvas, userEvent }) {
    const refresh = canvas.getByRole('button', { name: 'Refresh' });
    const more = canvas.getByRole('button', { name: 'More refresh options' });
    await expect(refresh).toHaveAttribute('data-color', 'primary');
    await expect(more).toHaveAttribute('data-color', 'primary');
    await userEvent.click(more);
    const option = within(document.body).getByRole('button', { name: 'Refresh prices' });
    await expect(option).not.toHaveAttribute('data-color');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('menu')).toBeNull());
  },
});

export default meta;
