import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import Chip, { type Props as ChipProps } from '@/components/chips/Chip.vue';
import { contextColors } from '@/consts/colors';

type Props = ChipProps & { prepend: string; children: string };

const render: StoryFn<Props> = (args) => ({
  components: { Chip },
  setup() {
    const show = ref(true);
    const hideShow = () => {
      set(show, false);
      setTimeout(() => {
        set(show, true);
      }, 2000);
    };
    return { args, show, hideShow };
  },
  template: `
    <div>
    <Chip v-if="show" v-bind="args" @remove="hideShow()">
      <template #prepend v-if="args.prepend">{{ args.prepend }}</template>
      {{ args.children }}
    </Chip>
    </div>`,
});

const meta: Meta<Props> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  render,
  argTypes: {
    tile: { control: 'boolean' },
    children: { control: 'string' },
    prepend: { control: 'text' },
    clickable: { control: 'boolean' },
    closeable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    color: {
      control: 'select',
      options: ['grey', ...contextColors],
    },
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
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const Tile: Story = {
  args: {
    children: 'Chip',
    tile: true,
    variant: 'filled',
    closeable: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const Clickable: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    clickable: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const Dismissible: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const DismissiblePrefix: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'grey',
    prepend: 'BTC',
  },
};

export const SmallDismissible: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
  },
};

export const SmallDismissiblePrefix: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
    prepend: 'BTC',
  },
};

export const Primary: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'primary',
  },
};

export const PrimarySmall: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'primary',
  },
};

export const PrimarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'secondary',
  },
};

export const SecondarySmall: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'secondary',
  },
};

export const SecondarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'secondary',
  },
};

export const Error: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'error',
  },
};

export const ErrorSmall: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'error',
  },
};

export const ErrorSmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'filled',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedDefault: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const OutlinedDismissible: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const OutlinedSmallDismissible: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
  },
};

export const OutlinedPrimary: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'primary',
  },
};

export const OutlinedPrimarySmall: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'primary',
  },
};

export const OutlinedPrimarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'primary',
  },
};

export const OutlinedSecondary: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'secondary',
  },
};

export const OutlinedSecondarySmall: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'secondary',
  },
};

export const OutlinedSecondarySmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'secondary',
  },
};

export const OutlinedError: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'error',
  },
};

export const OutlinedErrorPrefix: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'md',
    color: 'error',
    prepend: 'BTC',
  },
};

export const OutlinedErrorSmall: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: false,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedErrorSmallDisabled: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedErrorSmallDisabledPrefixed: Story = {
  args: {
    children: 'Chip',
    variant: 'outlined',
    closeable: true,
    disabled: true,
    size: 'sm',
    color: 'error',
    prepend: 'BTC',
  },
};

export default meta;
