import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { objectOmit } from '@vueuse/shared';
import { expect } from 'storybook/test';
import RuiChip from '@/components/chips/RuiChip.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

type ChipStoryArgs = ComponentPropsAndSlots<typeof RuiChip> & { children?: string; prepend?: string };

function render(args: ChipStoryArgs) {
  return {
    components: { RuiChip },
    setup() {
      const show = ref(true);
      const hideShow = () => {
        set(show, false);
        setTimeout(() => {
          set(show, true);
        }, 2000);
      };
      const chipArgs = computed(() => objectOmit(args, ['children', 'prepend']));
      return { args, chipArgs, hideShow, show };
    },
    template: `
      <div>
      <RuiChip v-if="show" v-bind="chipArgs" @click:close="hideShow()">
        <template #prepend v-if="args.prepend">{{ args.prepend }}</template>
        {{ args.children }}
      </RuiChip>
      </div>`,
  };
}
const meta = preview.meta({
  argTypes: {
    children: { control: 'text' },
    clickable: { control: 'boolean' },
    closeable: { control: 'boolean' },
    color: {
      control: 'select',
      options: ['grey', ...contextColors],
    },
    disabled: { control: 'boolean' },
    prepend: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    tile: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'tonal'],
    },
  },
  parameters: {
    docs: {
      controls: {
        exclude: ['click:close'],
      },
      description: {
        component: 'Use the `tonal` variant for status tags (`color="success" variant="tonal"`): a column of filled status chips is the loudest thing on a table. Keep `filled` for the few chips that should stand out. Only a `clickable` chip is a button and a tab stop.',
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Data Display/Chip',
});

export const Default = meta.story({
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
});

export const Tile = meta.story({
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    tile: true,
    variant: 'filled',
  },
});

export const Clickable = meta.story({
  args: {
    children: 'Chip',
    clickable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
});

export const Dismissible = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
  async play({ canvas }) {
    await expect(canvas.getByText('Chip')).toBeVisible();
    // a chip that is not clickable is not a button; only its close control is
    const buttons = canvas.getAllByRole('button');
    await expect(buttons).toHaveLength(1);
    await expect(buttons[0]).toHaveAttribute('type', 'button');
  },
});

/** The close button emits `click:close`, which the story answers by hiding the chip for two seconds. */
export const DismissibleHides = meta.story({
  args: {
    children: 'Dismiss me',
    closeable: true,
  },
  async play({ canvas, userEvent }) {
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.queryByText('Dismiss me')).toBeNull();
  },
});

export const DismissiblePrefix = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    prepend: 'B',
    size: 'md',
    variant: 'filled',
  },
});

/**
 * Every variant in every color at both sizes, with the prefix, close and disabled states: three
 * variants of seven colors at two sizes, plus four state chips per variant. The disabled chips are
 * left out of the accessibility check: WCAG exempts disabled controls from contrast, but a chip
 * that is not clickable has no role that can carry aria-disabled to tell axe so.
 */
export const Variants = meta.story({
  parameters: {
    a11y: { context: { exclude: ['[data-disabled]'], include: ['body'] } },
  },
  render: () => ({
    components: { RuiChip },
    setup() {
      const variants = ['filled', 'outlined', 'tonal'] as const;
      const colors = ['grey', ...contextColors] as const;
      const sizes = ['md', 'sm'] as const;
      return { colors, sizes, variants };
    },
    template: `
      <div class="flex flex-col gap-6">
        <section v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-rui-text-secondary">{{ variant }}</h3>
          <div v-for="size in sizes" :key="size" class="flex flex-wrap items-center gap-2">
            <RuiChip v-for="color in colors" :key="color" :variant="variant" :color="color" :size="size" closeable>{{ color }}</RuiChip>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <RuiChip :variant="variant" color="primary" closeable>
              <template #prepend>AL</template>
              Prefix
            </RuiChip>
            <RuiChip :variant="variant" color="primary" size="sm" closeable>
              <template #prepend>A</template>
              Prefix
            </RuiChip>
            <RuiChip :variant="variant" color="primary" closeable disabled>Disabled</RuiChip>
            <RuiChip :variant="variant" color="error" size="sm" closeable disabled>
              <template #prepend>A</template>
              Disabled
            </RuiChip>
          </div>
        </section>
      </div>`,
  }),
  async play({ canvas }) {
    await expect(canvas.getAllByText('primary')).toHaveLength(6);
    await expect(canvas.getAllByText('Disabled')).toHaveLength(6);
  },
});

export const StatusTags = meta.story({
  args: { size: 'sm', variant: 'tonal' },
  render: args => ({
    components: { RuiChip },
    setup() {
      const statuses = [
        { color: 'success', label: 'Synced' },
        { color: 'info', label: 'Queued' },
        { color: 'warning', label: 'Rate limited' },
        { color: 'error', label: 'Failed' },
        { color: 'grey', label: 'Skipped' },
      ] as const;
      return { args, statuses };
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <RuiChip v-for="status in statuses" :key="status.color" v-bind="args" :color="status.color">{{ status.label }}</RuiChip>
      </div>`,
  }),
});

export default meta;
