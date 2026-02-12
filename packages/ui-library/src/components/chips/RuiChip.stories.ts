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
      <RuiChip v-if="show" v-bind="chipArgs" @remove="hideShow()">
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
      options: ['filled', 'outlined'],
    },
  },
  parameters: {
    docs: {
      controls: {
        exclude: ['remove'],
      },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Chip',
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
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.length).toBeGreaterThanOrEqual(2);
  },
});

export const DismissiblePrefix = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    prepend: 'BTC',
    size: 'md',
    variant: 'filled',
  },
});

export const SmallDismissible = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
});

export const SmallDismissiblePrefix = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    prepend: 'BTC',
    size: 'sm',
    variant: 'filled',
  },
});

export const Primary = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
});

export const PrimarySmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
});

export const PrimarySmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
});

export const Secondary = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
});

export const SecondarySmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
});

export const SecondarySmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
});

export const Error = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
});

export const ErrorSmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
});

export const ErrorSmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
});

export const OutlinedDefault = meta.story({
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedDismissible = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedSmallDismissible = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedPrimary = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedPrimarySmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedPrimarySmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedSecondary = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedSecondarySmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedSecondarySmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedError = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedErrorPrefix = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    prepend: 'BTC',
    size: 'md',
    variant: 'outlined',
  },
});

export const OutlinedErrorSmall = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedErrorSmallDisabled = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
});

export const OutlinedErrorSmallDisabledPrefixed = meta.story({
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    prepend: 'BTC',
    size: 'sm',
    variant: 'outlined',
  },
});

export default meta;
