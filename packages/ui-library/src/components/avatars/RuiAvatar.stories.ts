import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiAvatar from '@/components/avatars/RuiAvatar.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';
import { contextColors } from '@/consts/colors';
import { RuiIcons } from '@/icons';
import preview from '~/.storybook/preview';

type AvatarStoryArgs = ComponentPropsAndSlots<typeof RuiAvatar>;

function render(args: AvatarStoryArgs) {
  return {
    components: { RuiAvatar },
    setup: () => ({ args }),
    template: `
      <div class="p-8">
        <RuiAvatar v-bind="args" />
      </div>`,
  };
}

const meta = preview.meta({
  args: {
    alt: 'Ada Lovelace',
    color: 'default',
    icon: null,
    loading: 'lazy',
    size: 'md',
    src: null,
    text: null,
    variant: 'circular',
  },
  argTypes: {
    color: { control: 'select', options: ['default', ...contextColors] },
    icon: { control: 'select', options: [null, ...RuiIcons] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    src: { control: 'text' },
    text: { control: 'text' },
    variant: { control: 'select', options: ['circular', 'rounded', 'square'] },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Avatars/Avatar',
});

export const Default = meta.story({
  args: {},
});

export const WithImage = meta.story({
  args: {
    alt: 'Vue logo',
    src: 'https://vuejs.org/images/logo.png',
  },
});

export const Initials = meta.story({
  args: {
    alt: 'Ada Lovelace',
    text: 'Ada Lovelace',
  },
});

export const WithIcon = meta.story({
  args: {
    alt: 'User icon',
    icon: 'lu-user',
  },
});

export const BrokenImage = meta.story({
  args: {
    alt: 'Falls back to initials',
    src: 'https://example.invalid/no-such-image.png',
    text: 'Ada Lovelace',
  },
});

export const Sizes = meta.story({
  render(args: AvatarStoryArgs) {
    return {
      components: { RuiAvatar },
      setup: () => ({ args, sizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const }),
      template: `
        <div class="flex items-center gap-4 p-8">
          <RuiAvatar v-for="s in sizes" :key="s" :size="s" text="AL" />
        </div>`,
    };
  },
});

export const Variants = meta.story({
  render(args: AvatarStoryArgs) {
    return {
      components: { RuiAvatar },
      setup: () => ({ args, variants: ['circular', 'rounded', 'square'] as const }),
      template: `
        <div class="flex items-center gap-4 p-8">
          <RuiAvatar v-for="v in variants" :key="v" :variant="v" text="AL" size="lg" />
        </div>`,
    };
  },
});

export const Colors = meta.story({
  render(args: AvatarStoryArgs) {
    return {
      components: { RuiAvatar },
      setup: () => ({ args, colors: ['default', ...contextColors] }),
      template: `
        <div class="flex flex-wrap items-center gap-4 p-8">
          <RuiAvatar v-for="c in colors" :key="c" :color="c" text="AL" />
        </div>`,
    };
  },
});

export const NumericSize = meta.story({
  args: {
    size: 56,
    text: 'AL',
  },
});

export const WithStatusBadge = meta.story({
  render(args: AvatarStoryArgs) {
    return {
      components: { RuiAvatar, RuiBadge },
      setup: () => ({ args }),
      template: `
        <div class="flex items-center gap-6 p-8">
          <RuiBadge dot color="success" placement="bottom" :offset-x="-2" :offset-y="-2">
            <RuiAvatar text="AL" size="lg" />
          </RuiBadge>
          <RuiBadge dot color="warning" placement="bottom" :offset-x="-2" :offset-y="-2">
            <RuiAvatar text="JS" size="lg" color="primary" />
          </RuiBadge>
          <RuiBadge dot color="error" placement="bottom" :offset-x="-2" :offset-y="-2">
            <RuiAvatar icon="lu-user" size="lg" color="secondary" />
          </RuiBadge>
        </div>`,
    };
  },
});

export default meta;
