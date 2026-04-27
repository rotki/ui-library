import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiAvatar from '@/components/avatars/RuiAvatar.vue';
import RuiAvatarGroup from '@/components/avatars/RuiAvatarGroup.vue';
import preview from '~/.storybook/preview';

type AvatarGroupStoryArgs = ComponentPropsAndSlots<typeof RuiAvatarGroup>;

function render(args: AvatarGroupStoryArgs) {
  return {
    components: { RuiAvatar, RuiAvatarGroup },
    setup: () => ({ args }),
    template: `
      <div class="p-8">
        <RuiAvatarGroup v-bind="args">
          <RuiAvatar text="Ada Lovelace" />
          <RuiAvatar text="Grace Hopper" color="primary" />
          <RuiAvatar text="Linus Torvalds" color="secondary" />
          <RuiAvatar text="Margaret Hamilton" color="success" />
          <RuiAvatar text="Donald Knuth" color="warning" />
        </RuiAvatarGroup>
      </div>`,
  };
}

const meta = preview.meta({
  args: {
    max: undefined,
    size: 'md',
    spacing: 'md',
    total: undefined,
    variant: 'circular',
  },
  argTypes: {
    max: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    spacing: { control: 'select', options: ['sm', 'md', 'lg'] },
    total: { control: 'number' },
    variant: { control: 'select', options: ['circular', 'rounded', 'square'] },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Avatars/AvatarGroup',
});

export const Basic = meta.story({
  args: {},
});

export const WithMax = meta.story({
  args: { max: 3 },
});

export const WithTotal = meta.story({
  args: { max: 3, total: 42 },
});

export const LargerSize = meta.story({
  args: { size: 'lg' },
});

export const SquareVariant = meta.story({
  args: { variant: 'rounded' },
});

export const SpacingOptions = meta.story({
  render(args: AvatarGroupStoryArgs) {
    return {
      components: { RuiAvatar, RuiAvatarGroup },
      setup: () => ({ args, spacings: ['sm', 'md', 'lg'] as const }),
      template: `
        <div class="flex flex-col gap-6 p-8">
          <div v-for="s in spacings" :key="s" class="flex items-center gap-4">
            <span class="w-16 text-sm">{{ s }}</span>
            <RuiAvatarGroup :spacing="s" :max="3">
              <RuiAvatar text="AB" color="primary" />
              <RuiAvatar text="CD" color="secondary" />
              <RuiAvatar text="EF" color="success" />
              <RuiAvatar text="GH" color="warning" />
              <RuiAvatar text="IJ" color="error" />
            </RuiAvatarGroup>
          </div>
        </div>`,
    };
  },
});

export const SurplusSlot = meta.story({
  render(args: AvatarGroupStoryArgs) {
    return {
      components: { RuiAvatar, RuiAvatarGroup },
      setup: () => ({ args }),
      template: `
        <div class="p-8">
          <RuiAvatarGroup :max="2">
            <RuiAvatar text="AB" color="primary" />
            <RuiAvatar text="CD" color="secondary" />
            <RuiAvatar text="EF" color="success" />
            <RuiAvatar text="GH" color="warning" />
            <template #surplus="{ count }">
              <RuiAvatar :text="'...'" color="info" :alt="'and ' + count + ' more'" />
            </template>
          </RuiAvatarGroup>
        </div>`,
    };
  },
});

export default meta;
