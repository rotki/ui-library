import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import RuiFooterStepper from '@/components/steppers/RuiFooterStepper.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiFooterStepper>) {
  return {
    components: { RuiFooterStepper },
    setup() {
      const modelValue = computed({
        get() {
          return args.modelValue;
        },
        set(val) {
          // @ts-expect-error Storybook args are mutable but Vue extracts readonly props
          args.modelValue = val;
        },
      });

      return { args, modelValue };
    },
    template: `<RuiFooterStepper v-model="modelValue" v-bind="args" />`,
  };
}

const meta = preview.meta({
  argTypes: {
    arrowButtons: { control: 'boolean', table: { category: 'State' } },
    hideButtons: { control: 'boolean', table: { category: 'State' } },
    modelValue: {
      control: 'number',
      table: { category: 'State' },
    },
    pages: { control: 'number', table: { category: 'State' } },
    variant: {
      control: 'select',
      options: ['numeric', 'bullet', 'progress', 'pill'],
      table: { category: 'State' },
    },
  },
  component: RuiFooterStepper,
  parameters: {
    docs: {
      controls: { exclude: ['update:modelValue'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/FooterStepper',
});

export const Default = meta.story({
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'numeric',
  },
});

export const DefaultWithoutButtons = meta.story({
  args: {
    arrowButtons: false,
    hideButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'numeric',
  },
});

export const Bullet = meta.story({
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'bullet',
  },
});

export const BulletWithoutButtons = meta.story({
  args: {
    arrowButtons: false,
    hideButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'bullet',
  },
});

export const Progress = meta.story({
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'progress',
  },
});

export const ProgressWithoutButtons = meta.story({
  args: {
    arrowButtons: false,
    hideButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'progress',
  },
});

export const Pills = meta.story({
  args: {
    arrowButtons: false,
    modelValue: 1,
    pages: 5,
    variant: 'pill',
  },
});

export const ArrowButtons = meta.story({
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'numeric',
  },
});

export const BulletWithArrows = meta.story({
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'bullet',
  },
});

export const ProgressWithArrows = meta.story({
  args: {
    arrowButtons: true,
    modelValue: 1,
    pages: 5,
    variant: 'progress',
  },
});

export default meta;
