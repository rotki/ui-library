import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiButton, { type Props } from '@/components/buttons/button/RuiButton.vue';
import { contextColors } from '@/consts/colors';

type PropsAndLabel = Props & {
  label: string;
};

const render: StoryFn<PropsAndLabel> = args => ({
  components: { RuiButton },
  setup() {
    const clicks = ref(0);
    return { args, clicks };
  },
  template: `
    <RuiButton v-bind="args" @click="clicks++">
      <template #prepend></template>
      {{ args.label }}
      <template #append></template>
    </RuiButton>
    <div class="mt-4 text-rui-text">Clicked: {{ clicks }} times</div>
  `,
});

const meta: Meta<PropsAndLabel> = {
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    elevation: { control: 'number', table: { category: 'Shape' } },
    icon: { control: 'boolean', table: { category: 'Shape' } },
    label: { control: 'text' },
    loading: { control: 'boolean', table: { category: 'State' } },
    noOutline: { control: 'boolean' },
    rounded: { control: 'boolean', table: { category: 'Shape' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    type: { control: 'select', options: ['button', 'submit'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text', 'fab', 'list'],
      table: { category: 'Shape' },
    },
  },
  component: RuiButton as any,
  parameters: {
    docs: {
      controls: { exclude: ['prepend', 'append', 'default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Button/Button',
};

type Story = StoryObj<PropsAndLabel>;

export const Default: Story = {
  args: {
    label: 'Default',
  },
};

export const NoOutline: Story = {
  args: {
    label: 'No focus outline',
    noOutline: true,
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
    disabled: true,
    label: 'Medium',
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
    elevation: 4,
    label: 'Primary Outlined',
    variant: 'outlined',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    label: 'Secondary Button',
  },
};

export const SecondaryText: Story = {
  args: {
    color: 'secondary',
    label: 'Secondary Button',
    size: 'lg',
    variant: 'text',
  },
};

export const SecondaryOutlined: Story = {
  args: {
    color: 'secondary',
    label: 'Outlined Button',
    variant: 'outlined',
  },
};

export const ErrorButton: Story = {
  args: {
    color: 'error',
    label: 'Error Button',
  },
};

export const ErrorButtonText: Story = {
  args: {
    color: 'error',
    label: 'Error Button',
    size: 'lg',
    variant: 'text',
  },
};

export const ErrorOutlined: Story = {
  args: {
    color: 'error',
    label: 'Error Button',
    variant: 'outlined',
  },
};

export const ErrorOutlinedDisabled: Story = {
  args: {
    color: 'error',
    disabled: true,
    label: 'Error Button',
    variant: 'outlined',
  },
};

export const List: Story = {
  args: {
    label: 'List',
    variant: 'list',
  },
};

export const FloatingActionButton: Story = {
  args: {
    color: 'primary',
    label: 'Floating Action Button',
    variant: 'fab',
  },
};

export default meta;
