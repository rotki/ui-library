import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiIcon>) {
  return {
    components: { RuiIcon },
    setup() {
      return { args };
    },
    template: '<RuiIcon v-bind="args" />',
  };
}

const meta = preview.meta({
  argTypes: {
    color: { control: 'select', options: contextColors },
    name: {
      control: 'select',
      options: RuiIcons,
    },
    size: {
      control: 'number',
    },
  },
  component: RuiIcon,
  parameters: {
    docs: {
      description: {
        component:
          'We provide icons from <a target="_blank" href="https://lucide.dev/icons">Lucide icons</a>. To use it, you need to add prefix `lu-` (eg: lu-arrow-down).',
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Data Display/Icon',
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 24,
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    name: 'lu-arrow-down',
    size: 24,
  },
});

export const PrimaryLarge = meta.story({
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: 48,
  },
});

export const CssSized = meta.story({
  args: {
    color: 'primary',
    name: 'lu-arrow-down',
    size: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the `size` prop is omitted, the icon resolves its width/height through `var(--rui-icon-size, 1.5rem)`. A parent (like `RuiButton`) can shrink every icon it contains by setting `--rui-icon-size`; supplying `size` on the icon instead stamps an inline style on the svg, which wins for that icon specifically.',
      },
    },
  },
  render: args => ({
    components: { RuiIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-1">
          <RuiIcon v-bind="args" />
          <span class="text-xs">default (24px)</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="w-4 h-4"><RuiIcon v-bind="args" class="w-full h-full" /></div>
          <span class="text-xs">wrapper w-4 h-4</span>
        </div>
        <div class="flex flex-col items-center gap-1 [&_svg]:w-5 [&_svg]:h-5">
          <RuiIcon v-bind="args" />
          <span class="text-xs">ancestor [&_svg]:w-5</span>
        </div>
      </div>
    `,
  }),
});

/**
 * Icons draw with a 1.75 stroke, a touch lighter than Lucide's 2, so they sit level with Inter's
 * text weight. Set `--rui-icon-stroke` on any ancestor to change it for everything inside, for
 * example `[--rui-icon-stroke:2]` on a toolbar that needs bolder icons.
 */
export const Stroke = meta.story({
  render: () => ({
    components: { RuiIcon },
    setup() {
      const strokes = [
        { label: '1.5', value: '[--rui-icon-stroke:1.5]' },
        { label: '1.75, the default', value: '' },
        { label: '2, Lucide\'s own', value: '[--rui-icon-stroke:2]' },
      ];
      const icons = ['lu-house', 'lu-wallet', 'lu-chart-line', 'lu-settings', 'lu-arrow-down'] as const;
      const sizes = [16, 20, 24];
      return { icons, sizes, strokes };
    },
    template: `
      <div class="flex flex-col gap-6">
        <div v-for="stroke in strokes" :key="stroke.label" :class="stroke.value" :data-stroke="stroke.label" class="flex flex-col gap-2">
          <span class="text-caption text-rui-text-secondary">{{ stroke.label }}</span>
          <div class="flex items-center gap-8">
            <div v-for="size in sizes" :key="size" class="flex items-center gap-3 text-rui-text">
              <RuiIcon v-for="icon in icons" :key="icon" :name="icon" :size="size" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  async play({ canvasElement }) {
    const strokeOf = (label: string): string | undefined => {
      const svg = canvasElement.querySelector(`[data-stroke^="${label}"] svg`);
      return svg ? getComputedStyle(svg).strokeWidth : undefined;
    };
    await expect(strokeOf('1.75')).toBe('1.75px');
    await expect(strokeOf('2')).toBe('2px');
  },
});

/** Every SVG in `src/custom-icons/`, by icon name. */
const customIconNames: string[] = Object.keys(import.meta.glob('../../custom-icons/*.svg'))
  .map(file => file.slice(file.lastIndexOf('/') + 1, -'.svg'.length))
  .sort();

const customIconNeighbours: Record<string, string> = {
  'lu-balances': 'lu-wallet',
  'lu-bitcoin-accounts': 'lu-wallet',
  'lu-blockchain': 'lu-network',
  'lu-cloud-download-2': 'lu-cloud-download',
  'lu-cloud-sync-auto': 'lu-cloud',
  'lu-cloud-upload-2': 'lu-cloud-upload',
  'lu-coins-exchange': 'lu-arrow-right-left',
  'lu-custom-assets': 'lu-database',
  'lu-deposits': 'lu-log-in',
  'lu-dogecoin-accounts': 'lu-wallet',
  'lu-droplet-fill': 'lu-droplet',
  'lu-droplet-half-fill': 'lu-droplet',
  'lu-droplet-trending-down': 'lu-droplet',
  'lu-evm-accounts': 'lu-wallet',
  'lu-folder-shrink-1': 'lu-folder',
  'lu-folder-shrink-2': 'lu-folder',
  'lu-historic-prices': 'lu-receipt',
  'lu-history-events': 'lu-square',
  'lu-latest-prices': 'lu-receipt',
  'lu-layers-in': 'lu-layers-2',
  'lu-layers-out': 'lu-layers-2',
  'lu-liabilities': 'lu-log-out',
  'lu-manage-assets': 'lu-database',
  'lu-manage-prices': 'lu-receipt',
  'lu-more-assets': 'lu-database',
  'lu-onchain': 'lu-box',
  'lu-radio-checked': 'lu-circle-dot',
  'lu-refund': 'lu-rotate-ccw',
  'lu-solana-accounts': 'lu-wallet',
  'lu-substrate-accounts': 'lu-wallet',
  'lu-tag-manager': 'lu-tag',
};

/**
 * The custom icons beside the lucide icon each one is drawn to match. Use it to check a new or
 * edited SVG in `src/custom-icons/` against its family before shipping it. The play function checks
 * that every SVG is listed and generated into something drawable.
 */
export const CustomIcons = meta.story({
  render: () => ({
    components: { RuiIcon },
    setup() {
      const rows = customIconNames.map(name => ({ name, neighbour: customIconNeighbours[name] }));
      const sizes = [16, 20, 24, 40];
      return { rows, sizes };
    },
    template: `
      <table class="text-rui-text">
        <tr class="text-caption text-rui-text-secondary text-left">
          <th class="pr-6 pb-2 font-medium">icon</th>
          <th class="pr-6 pb-2 font-medium">custom</th>
          <th class="pb-2 font-medium">lucide neighbour</th>
        </tr>
        <tr v-for="row in rows" :key="row.name" :data-icon="row.name" class="between:border-t border-rui-divider">
          <td class="pr-6 py-1.5 text-caption font-mono">{{ row.name }}</td>
          <td class="pr-6 py-1.5"><div class="flex items-center gap-3"><RuiIcon v-for="size in sizes" :key="size" :name="row.name" :size="size" /></div></td>
          <td class="py-1.5"><div v-if="row.neighbour" class="flex items-center gap-3">
            <RuiIcon v-for="size in sizes" :key="size" :name="row.neighbour" :size="size" />
            <span class="text-caption font-mono text-rui-text-secondary">{{ row.neighbour }}</span>
          </div></td>
        </tr>
      </table>
    `,
  }),
  async play({ canvasElement }) {
    await expect(canvasElement.querySelectorAll('[data-icon]')).toHaveLength(customIconNames.length);
    for (const row of canvasElement.querySelectorAll('[data-icon]'))
      await expect(row.querySelector('td:nth-child(2) svg > *')).not.toBeNull();
  },
});

export default meta;
