import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiCard from '@/components/cards/RuiCard.vue';
import RuiColorPicker, { type Props } from '@/components/color-picker/RuiColorPicker.vue';

const render: StoryFn<Props> = args => ({
  components: { RuiCard, RuiColorPicker },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    return { args, modelValue };
  },
  template: `<RuiCard class='!w-[300px]'><RuiColorPicker v-model="modelValue" v-bind="args" /></RuiCard>`,
});

const meta: Meta<Props> = {
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
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const PreDefinedValue: Story = {
  args: {
    modelValue: '45858a',
  },
};

export default meta;
