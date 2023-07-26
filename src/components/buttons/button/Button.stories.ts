import { type Meta, type StoryFn, type StoryObj } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import { default as Button, type Props } from './Button.vue';

type PropsAndLabel = Props & { label: string };

const render: StoryFn<PropsAndLabel> = (args) => ({
  components: { Button },
  setup() {
    const clicks = ref(0);
    return { clicks, args };
  },
  template: `
    <Button v-bind="args" @click="clicks++">
      <template #prepend></template>
      {{ args.label }}
      <template #append></template>
    </Button>
    <div class='mt-4 text-rui-text'>Clicked: {{ clicks }} times</div>
  `,
});

const meta: Meta<PropsAndLabel> = {
  title: 'Components/Button/Button',
  component: Button,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    color: { control: 'select', options: contextColors },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text', 'fab'],
      table: { category: 'Shape' },
    },
    rounded: { control: 'boolean', table: { category: 'Shape' } },
    elevation: { control: 'number', table: { category: 'Shape' } },
    icon: { control: 'boolean', table: { category: 'Shape' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    disabled: { control: 'boolean', table: { category: 'State' } },
    loading: { control: 'boolean', table: { category: 'State' } },
  },
  parameters: {
    docs: {
      controls: { exclude: ['prepend', 'append', 'default'] },
    },
  },
};

type Story = StoryObj<PropsAndLabel>;

export const Default: Story = {
  args: {
    label: 'Default',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    label: 'Medium',
  },
};

export const PrimaryText: Story = {
  args: {
    color: 'primary',
    label: 'Large',
    variant: 'text',
  },
};

export const PrimaryRounded: Story = {
  args: {
    color: 'primary',
    label: 'Medium',
    rounded: true,
  },
};

export const PrimarySmall: Story = {
  args: {
    color: 'primary',
    label: 'Small',
    size: 'sm',
  },
};

export const PrimaryLarge: Story = {
  args: {
    color: 'primary',
    label: 'Large',
    size: 'lg',
  },
};

export const PrimaryLargeRounded: Story = {
  args: {
    color: 'primary',
    label: 'Large',
    rounded: true,
    size: 'lg',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    color: 'primary',
    label: 'Medium',
    disabled: true,
  },
};

export const PrimaryOutlined: Story = {
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
  },
};

export const PrimaryLoading: Story = {
  args: {
    color: 'primary',
    label: 'Primary Loading',
    loading: true,
  },
};

export const PrimaryOutlinedWithElevation: Story = {
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
    elevation: 4,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    color: 'secondary',
  },
};

export const SecondaryText: Story = {
  args: {
    label: 'Secondary Button',
    color: 'secondary',
    variant: 'text',
    size: 'lg',
  },
};

export const SecondaryOutlined: Story = {
  args: {
    label: 'Outlined Button',
    color: 'secondary',
    variant: 'outlined',
  },
};

export const ErrorButton: Story = {
  args: {
    label: 'Error Button',
    color: 'error',
  },
};

export const ErrorButtonText: Story = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'text',
    size: 'lg',
  },
};

export const ErrorOutlined: Story = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'outlined',
  },
};

export const ErrorOutlinedDisabled: Story = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'outlined',
    disabled: true,
  },
};

export const FloatingActionButton: Story = {
  args: {
    label: 'Floating Action Button',
    color: 'primary',
    variant: 'fab',
  },
};

export default meta;
