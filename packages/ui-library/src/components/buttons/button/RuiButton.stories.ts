import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiButton>) {
  return {
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
  };
}

const meta = preview.meta({
  argTypes: {
    color: { control: 'select', options: contextColors },
    disabled: { control: 'boolean', table: { category: 'State' } },
    elevation: { control: 'number', table: { category: 'Shape' } },
    hideFocusIndicator: { control: 'boolean' },
    icon: { control: 'boolean', table: { category: 'Shape' } },
    label: { control: 'text' },
    loading: { control: 'boolean', table: { category: 'State' } },
    rounded: { control: 'boolean', table: { category: 'Shape' } },
    size: { control: 'select', options: ['medium', 'sm', 'lg'] },
    type: { control: 'select', options: ['button', 'submit'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text', 'fab', 'list'],
      table: { category: 'Shape' },
    },
  },
  component: RuiButton,
  parameters: {
    docs: {
      controls: { exclude: ['prepend', 'append', 'default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Button/Button',
});

export const Default = meta.story({
  args: {
    label: 'Default',
  },
});

export const HideFocusIndicator = meta.story({
  args: {
    hideFocusIndicator: true,
    label: 'No focus outline',
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
    label: 'Medium',
  },
  async play({ canvas, userEvent }) {
    const button = canvas.getByRole('button');
    await expect(canvas.getByText('Clicked: 0 times')).toBeVisible();
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked: 1 times')).toBeVisible();
  },
});

export const PrimaryText = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    variant: 'text',
  },
});

export const PrimaryRounded = meta.story({
  args: {
    color: 'primary',
    label: 'Medium',
    rounded: true,
  },
});

export const PrimarySmall = meta.story({
  args: {
    color: 'primary',
    label: 'Small',
    size: 'sm',
  },
});

export const PrimaryLarge = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    size: 'lg',
  },
});

export const PrimaryLargeRounded = meta.story({
  args: {
    color: 'primary',
    label: 'Large',
    rounded: true,
    size: 'lg',
  },
});

export const PrimaryDisabled = meta.story({
  args: {
    color: 'primary',
    disabled: true,
    label: 'Medium',
  },
});

export const PrimaryOutlined = meta.story({
  args: {
    color: 'primary',
    label: 'Primary Outlined',
    variant: 'outlined',
  },
});

export const PrimaryLoading = meta.story({
  args: {
    color: 'primary',
    label: 'Primary Loading',
    loading: true,
  },
});

export const PrimaryOutlinedWithElevation = meta.story({
  args: {
    color: 'primary',
    elevation: 4,
    label: 'Primary Outlined',
    variant: 'outlined',
  },
});

export const Secondary = meta.story({
  args: {
    color: 'secondary',
    label: 'Secondary Button',
  },
});

export const SecondaryText = meta.story({
  args: {
    color: 'secondary',
    label: 'Secondary Button',
    size: 'lg',
    variant: 'text',
  },
});

export const SecondaryOutlined = meta.story({
  args: {
    color: 'secondary',
    label: 'Outlined Button',
    variant: 'outlined',
  },
});

export const ErrorButton = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
  },
});

export const ErrorButtonText = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
    size: 'lg',
    variant: 'text',
  },
});

export const ErrorOutlined = meta.story({
  args: {
    color: 'error',
    label: 'Error Button',
    variant: 'outlined',
  },
});

export const ErrorOutlinedDisabled = meta.story({
  args: {
    color: 'error',
    disabled: true,
    label: 'Error Button',
    variant: 'outlined',
  },
});

export const List = meta.story({
  args: {
    label: 'List',
    variant: 'list',
  },
});

export const FloatingActionButton = meta.story({
  args: {
    color: 'primary',
    label: 'Floating Action Button',
    variant: 'fab',
  },
});

export default meta;
