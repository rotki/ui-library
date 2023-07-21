import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import Chip, { type Props as ChipProps } from '@/components/chips/Chip.vue';
import { contextColors } from '@/consts/colors';

type Props = ChipProps & { prepend: string };

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
    </Chip>
    </div>`,
});

const meta: Meta<Props> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    prepend: { control: 'text' },
    dismissible: { control: 'boolean' },
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
    label: 'Chip',
    variant: 'filled',
    dismissible: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const Dismissible: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const DismissiblePrefix: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'grey',
    prepend: 'BTC',
  },
};

export const SmallDismissible: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
  },
};

export const SmallDismissiblePrefix: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
    prepend: 'BTC',
  },
};

export const Primary: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'primary',
  },
};

export const PrimarySmall: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'primary',
  },
};

export const PrimarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'secondary',
  },
};

export const SecondarySmall: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'secondary',
  },
};

export const SecondarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'secondary',
  },
};

export const Error: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'error',
  },
};

export const ErrorSmall: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'error',
  },
};

export const ErrorSmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'filled',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedDefault: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const OutlinedDismissible: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const OutlinedSmallDismissible: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
  },
};

export const OutlinedPrimary: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'primary',
  },
};

export const OutlinedPrimarySmall: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'primary',
  },
};

export const OutlinedPrimarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'primary',
  },
};

export const OutlinedSecondary: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'secondary',
  },
};

export const OutlinedSecondarySmall: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'secondary',
  },
};

export const OutlinedSecondarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'secondary',
  },
};

export const OutlinedError: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'error',
  },
};

export const OutlinedErrorPrefix: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'error',
    prepend: 'BTC',
  },
};

export const OutlinedErrorSmall: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedErrorSmallDisabled: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'error',
  },
};

export const OutlinedErrorSmallDisabledPrefixed: Story = {
  args: {
    label: 'Chip',
    variant: 'outlined',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'error',
    prepend: 'BTC',
  },
};

export default meta;
