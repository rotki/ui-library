import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
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
  title: 'Components/Icon',
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
          'When the `size` prop is omitted, the icon falls back to `w-6 h-6` classes. Parents can override via CSS (e.g. wrapping in `<div class="w-4 h-4">` or applying `[&_svg]:w-5` on an ancestor).',
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

export default meta;
