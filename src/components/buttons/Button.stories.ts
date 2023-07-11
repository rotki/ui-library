import { type Meta, type StoryFn } from '@storybook/vue3';
import { contextColors } from '@/consts/colors';
import Button from './Button.vue';

const render: StoryFn<typeof Button> = (_, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: `<Button v-bind="$props">
    <template #prepend></template>
    {{ $props.label }}
    <template #append></template>
  </Button>`,
});

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
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
    sm: { control: 'boolean', table: { category: 'Size' } },
    lg: { control: 'boolean', table: { category: 'Size' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    loading: { control: 'boolean', table: { category: 'State' } },
  },
  parameters: {
    docs: {
      controls: { exclude: ['prepend', 'append', 'default'] },
    },
  },
};

export const Default = {
  args: {
    label: 'Default',
    variant: 'outlined',
  },
};

export const Primary = {
  args: {
    color: 'primary',
    label: 'Medium',
  },
};

export const PrimaryText = {
  args: {
    color: 'primary',
    label: 'Large',
    variant: 'text',
  },
};

export const PrimaryRounded = {
  args: {
    color: 'primary',
    label: 'Medium',
    rounded: true,
  },
};

export const PrimarySmall = {
  args: {
    color: 'primary',
    label: 'Small',
    size: 'sm',
  },
};

export const PrimaryLarge = {
  args: {
    color: 'primary',
    label: 'Large',
    size: 'lg',
  },
};

export const PrimaryLargeRounded = {
  args: {
    color: 'primary',
    label: 'Large',
    rounded: true,
    size: 'lg',
  },
};

export const PrimaryDisabled = {
  args: {
    color: 'primary',
    label: 'Medium',
    disabled: true,
  },
};

export const PrimaryOutlined = {
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
  },
};

export const PrimaryOutlinedWithElevation = {
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
    elevation: 4,
  },
};

export const Secondary = {
  args: {
    label: 'Secondary Button',
    color: 'secondary',
  },
};

export const SecondaryText = {
  args: {
    label: 'Secondary Button',
    color: 'secondary',
    variant: 'text',
    size: 'lg',
  },
};

export const SecondaryOutlined = {
  args: {
    label: 'Outlined Button',
    color: 'secondary',
    variant: 'outlined',
  },
};

export const ErrorButton = {
  args: {
    label: 'Error Button',
    color: 'error',
  },
};

export const ErrorButtonText = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'text',
    size: 'lg',
  },
};

export const ErrorOutlined = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'outlined',
  },
};

export const ErrorOutlinedDisabled = {
  args: {
    label: 'Error Button',
    color: 'error',
    variant: 'outlined',
    disabled: true,
  },
};

export const FloatingActionButton = {
  args: {
    label: 'Floating Action Button',
    color: 'primary',
    variant: 'fab',
  },
};

export default meta;
