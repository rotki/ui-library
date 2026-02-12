import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiButtonGroup from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { contextColors } from '@/consts/colors';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiButtonGroup<string | number>>) {
  return {
    components: { RuiButton, RuiButtonGroup, RuiIcon },
    setup() {
      const count = ref(0);
      return { args, count };
    },
    template: `
    <div v-if="'modelValue' in args">
      <RuiButtonGroup v-bind="args" v-model="args.modelValue">
        <RuiButton>
          <RuiIcon name="lu-align-start-horizontal" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-center-horizontal" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-end-horizontal" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-align-horizontal-justify-center" />
        </RuiButton>
      </RuiButtonGroup>
      <div v-if="args.required" class="mt-4 text-rui-error">required: *</div>
    </div>
    <div v-else>
      <RuiButtonGroup v-bind="args">
        <RuiButton @click="count--">Decrease</RuiButton>
        <RuiButton @click="count++">Increase</RuiButton>
        <RuiButton @click="count++">
          <RuiIcon name="lu-plus"></RuiIcon>
        </RuiButton>
      </RuiButtonGroup>
      <div class="mt-4 text-rui-text">Count: {{ count }}</div>
    </div>
  `,
  };
}

const meta = preview.meta({
  argTypes: {
    activeColor: { control: 'select', options: contextColors },
    color: { control: 'select', options: contextColors },
    gap: { control: 'select', options: ['md', 'sm', 'lg'] },
    size: { control: 'select', options: ['md', 'sm', 'lg'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'text'],
      table: { category: 'Shape' },
    },
    vertical: { control: 'boolean' },
  },
  component: RuiButtonGroup<string | number>,
  render,
  tags: ['autodocs'],
  title: 'Components/Button/ButtonGroup',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText('Count: 0')).toBeVisible();
    const increaseButton = canvas.getByRole('button', { name: 'Increase' });
    await userEvent.click(increaseButton);
    await expect(canvas.getByText('Count: 1')).toBeVisible();
  },
});

export const Vertical = meta.story({
  args: {
    vertical: true,
  },
});

export const Primary = meta.story({
  args: {
    color: 'primary',
  },
});

export const SmallGap = meta.story({
  args: {
    gap: 'sm',
  },
});

export const Outlined = meta.story({
  args: {
    variant: 'outlined',
  },
});

export const Text = meta.story({
  args: {
    variant: 'text',
  },
});

export const DefaultToggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
  },
});

export const ToggleRequired = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
    required: true,
  },
});

export const VerticalToggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
    vertical: true,
  },
});

export const Toggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
  },
});

export const OutlinedToggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
    variant: 'outlined',
  },
});

export const TextToggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
    variant: 'text',
  },
});

export const ActiveColorToggle = meta.story({
  args: {
    activeColor: 'warning',
    color: 'primary',
    modelValue: 0,
    variant: 'text',
  },
});

export const DefaultToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
  },
});

export const ToggleMultipleRequired = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
    required: true,
  },
});

export const VerticalToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
    vertical: true,
  },
});

export const ToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
  },
});

export const OutlinedToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
    variant: 'outlined',
  },
});

export const TextToggleMultiple = meta.story({
  args: {
    color: 'primary',
    modelValue: [0],
    variant: 'text',
  },
});

export const ActiveColorMultiple = meta.story({
  args: {
    activeColor: 'warning',
    color: 'primary',
    modelValue: [0],
    variant: 'text',
  },
});

export default meta;
