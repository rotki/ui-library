import { type Meta, type StoryFn } from '@storybook/vue';
import { contextColors } from '@/consts/colors';
import Button from './Button.vue';

const render: StoryFn<typeof Button> = (_, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props">{{ $props.label }}</Button>',
});

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  render,
  argTypes: {
    label: { control: 'text' },
    color: { control: 'select', options: contextColors },
    outlined: { control: 'boolean', table: { category: 'Style' } },
    tile: { control: 'boolean', table: { category: 'Shape' } },
    elevated: { control: 'boolean', table: { category: 'Shape' } },
    text: { control: 'boolean', table: { category: 'Style' } },
    sm: { control: 'boolean', table: { category: 'Size' } },
    lg: { control: 'boolean', table: { category: 'Size' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    loading: { control: 'boolean', table: { category: 'State' } },
  },
  parameters: {
    docs: {
      controls: { exclude: ['prefix', 'suffix', 'click'] },
    },
  },
};

export const Primary = {
  args: {
    label: 'Medium',
  },
};

export const PrimaryText = {
  args: {
    label: 'Large',
    text: true,
    lg: true,
  },
};

export const PrimarySquare = {
  args: {
    label: 'Medium',
    tile: true,
  },
};

export const PrimarySmall = {
  args: {
    label: 'Small',
    sm: true,
  },
};

export const PrimaryLarge = {
  args: {
    label: 'Large',
    lg: true,
    elevated: true,
  },
};

export const PrimaryLargeSquare = {
  args: {
    label: 'Large',
    tile: true,
    lg: true,
    elevated: true,
  },
};

export const PrimaryDisabled = {
  args: {
    label: 'Medium',
    disabled: true,
  },
};

export const PrimaryOutlined = {
  args: {
    label: 'Outlined Button',
    outlined: true,
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
    text: true,
    lg: true,
  },
};

export const SecondaryOutlined = {
  args: {
    label: 'Outlined Button',
    color: 'secondary',
    outlined: true,
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
    text: true,
    lg: true,
  },
};

export const ErrorOutlined = {
  args: {
    label: 'Error Button',
    color: 'error',
    outlined: true,
  },
};

export const ErrorOutlinedDisabled = {
  args: {
    label: 'Error Button',
    color: 'error',
    outlined: true,
    disabled: true,
  },
};

export default meta;
