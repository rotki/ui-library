import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import { TimeAccuracy } from '@/consts/time-accuracy';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

const render: StoryFn<typeof RuiDateTimePicker> = args => ({
  components: { RuiDateTimePicker },
  setup() {
    return { args };
  },
  template: `<RuiDateTimePicker v-bind="args" />`,
});

const meta: Meta<typeof RuiDateTimePicker> = {
  argTypes: {
    'accuracy': {
      control: 'select',
      options: [TimeAccuracy.SECOND, TimeAccuracy.MINUTE, TimeAccuracy.MILLISECOND],
      table: {
        defaultValue: {
          summary: TimeAccuracy.MINUTE,
        },
      },
    },
    'modelValue': {
      control: 'date',
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
    },
  },
  component: RuiDateTimePicker,
  render,
  tags: ['autodocs'],
  title: 'Components/DateTimePicker',
};

type Story = StoryObj<typeof RuiDateTimePicker>;

export const Default: Story = {
  args: {
    modelValue: new Date(),
  },
};

export const Outlined: Story = {
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
    variant: 'outlined',
  },
};

export default meta;
