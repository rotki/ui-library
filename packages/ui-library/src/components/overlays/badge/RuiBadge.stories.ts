import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { objectOmit } from '@vueuse/shared';
import { expect } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';
import preview from '~/.storybook/preview';

type BadgeStoryArgs = ComponentPropsAndSlots<typeof RuiBadge> & {
  buttonText?: string | null;
};

function render(args: BadgeStoryArgs) {
  return {
    components: { RuiBadge, RuiButton, RuiIcon },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      const badgeArgs = computed(() => objectOmit(args, ['buttonText']));

      return { args, badgeArgs, modelValue };
    },
    template: `
      <div class="text-center p-8">
        <RuiBadge v-bind="badgeArgs" v-model="modelValue">
          <template v-if="args.text" #badge>
            {{ args.text }}
          </template>
          <RuiButton @click="modelValue = !modelValue">
            {{ args.buttonText }}
          </RuiButton>
        </RuiBadge>
      </div>`,
  };
}

const meta = preview.meta({
  args: {
    buttonText: 'Badge',
    color: 'primary',
    dot: false,
    icon: null,
    left: false,
    modelValue: true,
    offsetX: 0,
    offsetY: 0,
    rounded: 'full',
    size: 'md',
    text: '1',
  },
  argTypes: {
    color: { control: 'select', options: ['default', ...contextColors] },
    icon: {
      control: 'select',
      options: [null, ...RuiIcons],
    },
    offsetX: {
      control: 'number',
    },
    offsetY: {
      control: 'number',
    },
    placement: { control: 'select', options: ['top', 'center', 'bottom'] },
    rounded: { control: 'select', options: ['full', 'sm', 'md', 'lg'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    text: {
      control: 'text',
    },
  },
  parameters: {
    docs: {
      controls: { exclude: ['default', 'badge'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Overlays/Badge',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText('1')).toBeVisible();
    const button = canvas.getByRole('button', { name: 'Badge' });
    await userEvent.click(button);
  },
});

export const Left = meta.story({
  args: {
    left: true,
  },
});

export const Center = meta.story({
  args: {
    placement: 'center',
  },
});

export const CenterLeft = meta.story({
  args: {
    left: true,
    placement: 'center',
  },
});

export const Bottom = meta.story({
  args: {
    placement: 'bottom',
  },
});

export const BottomLeft = meta.story({
  args: {
    left: true,
    placement: 'bottom',
  },
});

export const Dot = meta.story({
  args: { dot: true },
});

export const DotLeft = meta.story({
  args: { dot: true, left: true },
});

export const DotCenter = meta.story({
  args: {
    dot: true,
    placement: 'center',
  },
});

export const DotCenterLeft = meta.story({
  args: {
    dot: true,
    left: true,
    placement: 'center',
  },
});

export const DotBottom = meta.story({
  args: {
    dot: true,
    placement: 'bottom',
  },
});

export const DotBottomLeft = meta.story({
  args: {
    dot: true,
    left: true,
    placement: 'bottom',
  },
});

export const Colors = meta.story({
  render(args: BadgeStoryArgs) {
    return {
      components: { RuiBadge, RuiButton },
      setup: () => ({ args, colors: ['default', ...contextColors] }),
      template: `
        <div class="flex flex-wrap gap-8 p-8">
          <RuiBadge v-for="color in colors" :key="color" :color="color" text="1">
            <RuiButton>{{ color }}</RuiButton>
          </RuiBadge>
        </div>`,
    };
  },
});

export const Sizes = meta.story({
  render(args: BadgeStoryArgs) {
    return {
      components: { RuiBadge, RuiButton },
      setup: () => ({ args, sizes: ['sm', 'md', 'lg'] as const }),
      template: `
        <div class="flex flex-wrap gap-8 p-8">
          <RuiBadge v-for="size in sizes" :key="size" :size="size" text="1">
            <RuiButton>{{ size }}</RuiButton>
          </RuiBadge>
        </div>`,
    };
  },
});

export const Rounded = meta.story({
  render(args: BadgeStoryArgs) {
    return {
      components: { RuiBadge, RuiButton },
      setup: () => ({ args, options: ['full', 'sm', 'md', 'lg'] as const }),
      template: `
        <div class="flex flex-wrap gap-8 p-8">
          <RuiBadge v-for="r in options" :key="r" :rounded="r" text="1">
            <RuiButton>{{ r }}</RuiButton>
          </RuiBadge>
        </div>`,
    };
  },
});

export const WithIcon = meta.story({
  args: {
    icon: 'lu-star',
    text: null,
  },
});

export const WithIconAndText = meta.story({
  args: {
    icon: 'lu-star',
    text: 'New',
  },
});

export default meta;
