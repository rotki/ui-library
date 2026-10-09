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
        <RuiButton aria-label="Align start">
          <RuiIcon name="lu-align-start-horizontal" />
        </RuiButton>
        <RuiButton aria-label="Align center">
          <RuiIcon name="lu-align-center-horizontal" />
        </RuiButton>
        <RuiButton aria-label="Align end">
          <RuiIcon name="lu-align-end-horizontal" />
        </RuiButton>
        <RuiButton aria-label="Justify">
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
    size: { control: 'select', options: ['md', 'sm', 'lg', 'xl'] },
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
  title: 'Actions/Button Group',
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

/** The three variants: joined filled buttons, an outlined frame, and bare text buttons. */
export const Variants = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup },
    setup() {
      return { variants: ['default', 'outlined', 'text'] as const };
    },
    template: `
      <div class="flex flex-col gap-3">
        <RuiButtonGroup v-for="variant in variants" :key="variant" :variant="variant" color="primary">
          <RuiButton>Day</RuiButton>
          <RuiButton>Week</RuiButton>
          <RuiButton>Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

export const Sizes = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup },
    setup() {
      return { sizes: ['sm', undefined, 'lg', 'xl'] as const };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <RuiButtonGroup v-for="size in sizes" :key="size ?? 'md'" :size="size" color="primary">
          <RuiButton>{{ size ?? 'md' }}</RuiButton>
          <RuiButton>Week</RuiButton>
          <RuiButton>Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

/** A single-choice toggle: the bound value is the index of the pressed button. */
export const Toggle = meta.story({
  args: {
    color: 'primary',
    modelValue: 0,
  },
  async play({ canvas, userEvent }) {
    const center = canvas.getByRole('button', { name: 'Align center' });
    await userEvent.click(center);
    await expect(center).toHaveAttribute('data-active', 'true');
    await expect(canvas.getByRole('button', { name: 'Align start' })).not.toHaveAttribute('data-active');
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

/** The toggle in the outlined and text variants, and with a separate color for the pressed button. */
export const ToggleVariants = meta.story({
  render: () => ({
    components: { RuiButton, RuiButtonGroup, RuiIcon },
    setup() {
      const outlined = ref<number>(0);
      const text = ref<number>(1);
      const activeColor = ref<number>(2);
      return { activeColor, outlined, text };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <RuiButtonGroup v-model="outlined" variant="outlined" color="primary">
          <RuiButton>Day</RuiButton><RuiButton>Week</RuiButton><RuiButton>Month</RuiButton>
        </RuiButtonGroup>
        <RuiButtonGroup v-model="text" variant="text" color="primary">
          <RuiButton>Day</RuiButton><RuiButton>Week</RuiButton><RuiButton>Month</RuiButton>
        </RuiButtonGroup>
        <RuiButtonGroup v-model="activeColor" variant="text" color="primary" active-color="warning">
          <RuiButton>Day</RuiButton><RuiButton>Week</RuiButton><RuiButton>Month</RuiButton>
        </RuiButtonGroup>
      </div>`,
  }),
});

/** A multiple-choice toggle: the bound value is the list of pressed indices. */
export const ToggleMultiple = meta.story({
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

export default meta;
