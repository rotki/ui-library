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
  title: 'Data Display/Badge',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText('1')).toBeVisible();
    const button = canvas.getByRole('button', { name: 'Badge' });
    // Toggle off and back on, so the story ends with the badge showing
    await userEvent.click(button);
    await userEvent.click(button);
    await expect(canvas.getByText('1')).toBeVisible();
    button.blur();
  },
});

export const Dot = meta.story({
  args: { dot: true },
});

/** Every placement on either side, as a count and as a dot. */
export const Placements = meta.story({
  render: () => ({
    components: { RuiBadge, RuiButton },
    setup() {
      const placements = ['top', 'center', 'bottom'] as const;
      return { placements };
    },
    template: `
      <div class="flex flex-col gap-10 p-8">
        <div v-for="dot in [false, true]" :key="String(dot)" class="flex flex-wrap gap-12">
          <template v-for="placement in placements" :key="placement">
            <RuiBadge v-for="left in [false, true]" :key="String(left)" :placement="placement" :left="left" :dot="dot" text="1">
              <RuiButton>{{ placement }}{{ left ? ' left' : '' }}</RuiButton>
            </RuiBadge>
          </template>
        </div>
      </div>`,
  }),
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
          <RuiBadge v-for="r in options" :key="r" :rounded="r" text="99+">
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
