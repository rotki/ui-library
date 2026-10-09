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

export default meta;
