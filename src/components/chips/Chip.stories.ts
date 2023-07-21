import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import Chip, { type Props } from '@/components/chips/Chip.vue';
import { contextColors } from '@/consts/colors';

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
    <Chip v-if="show" v-bind="args" @remove="hideShow()" />
    </div>`,
});

const meta: Meta<Props> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
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
  },
  parameters: {
    docs: {
      controls: {
        exclude: ['prepend', 'remove'],
      },
    },
  },
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    label: 'Chip',
    dismissible: false,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const Dismissible: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'grey',
  },
};

export const SmallDismissible: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'grey',
  },
};

export const Primary: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'primary',
  },
};

export const PrimarySmall: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'primary',
  },
};

export const PrimarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'secondary',
  },
};

export const SecondarySmall: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'secondary',
  },
};

export const SecondarySmallDisabled: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'secondary',
  },
};

export const Error: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'md',
    color: 'error',
  },
};

export const ErrorSmall: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: false,
    size: 'sm',
    color: 'error',
  },
};

export const ErrorSmallDisabled: Story = {
  args: {
    label: 'Chip',
    dismissible: true,
    disabled: true,
    size: 'sm',
    color: 'error',
  },
};

export default meta;
