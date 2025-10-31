import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiChip, { type Props as ChipProps } from '@/components/chips/RuiChip.vue';
import { contextColors } from '@/consts/colors';

type Props = ChipProps & { prepend: string; children: string };

const render: StoryFn<Props> = args => ({
  components: { RuiChip },
  setup() {
    const show = ref(true);
    const hideShow = () => {
      set(show, false);
      setTimeout(() => {
        set(show, true);
      }, 2000);
    };
    return { args, hideShow, show };
  },
  template: `
    <div>
    <RuiChip v-if="show" v-bind="args" @remove="hideShow()">
      <template #prepend v-if="args.prepend">{{ args.prepend }}</template>
      {{ args.children }}
    </RuiChip>
    </div>`,
});

const meta: Meta<Props> = {
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
  component: RuiChip,
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
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const Tile: Story = {
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    tile: true,
    variant: 'filled',
  },
};

export const Clickable: Story = {
  args: {
    children: 'Chip',
    clickable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const Dismissible: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const DismissiblePrefix: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    prepend: 'BTC',
    size: 'md',
    variant: 'filled',
  },
};

export const SmallDismissible: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
};

export const SmallDismissiblePrefix: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    prepend: 'BTC',
    size: 'sm',
    variant: 'filled',
  },
};

export const Primary: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const PrimarySmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
};

export const PrimarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const SecondarySmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
};

export const SecondarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
};

export const Error: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'md',
    variant: 'filled',
  },
};

export const ErrorSmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'sm',
    variant: 'filled',
  },
};

export const ErrorSmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    size: 'sm',
    variant: 'filled',
  },
};

export const OutlinedDefault: Story = {
  args: {
    children: 'Chip',
    closeable: false,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedDismissible: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedSmallDismissible: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'grey',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedPrimary: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedPrimarySmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedPrimarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'primary',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedSecondary: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedSecondarySmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedSecondarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'secondary',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedError: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedErrorPrefix: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    prepend: 'BTC',
    size: 'md',
    variant: 'outlined',
  },
};

export const OutlinedErrorSmall: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: false,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedErrorSmallDisabled: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    size: 'sm',
    variant: 'outlined',
  },
};

export const OutlinedErrorSmallDisabledPrefixed: Story = {
  args: {
    children: 'Chip',
    closeable: true,
    color: 'error',
    disabled: true,
    prepend: 'BTC',
    size: 'sm',
    variant: 'outlined',
  },
};

export default meta;
