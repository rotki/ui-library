import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiColorPicker from '@/components/color-picker/RuiColorPicker.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiColorPicker>) {
  return {
    components: { RuiCard, RuiColorPicker },
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
    template: `<RuiCard class='!w-[300px]'><RuiColorPicker v-model="modelValue" v-bind="args" /></RuiCard>`,
  };
}

const meta = preview.meta({
  argTypes: {
    modelValue: { control: 'text' },
  },
  component: RuiColorPicker,
  parameters: {
    docs: {
      controls: { exclude: ['default'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/ColorPicker',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'FF5733');
    await expect(input).toHaveValue('FF5733');
  },
});

export const PreDefinedValue = meta.story({
  args: {
    modelValue: '45858a',
  },
});

export default meta;
