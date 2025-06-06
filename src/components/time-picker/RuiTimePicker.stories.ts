import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { TimeAccuracy } from '@/consts/time-accuracy';
import RuiTimePicker from './RuiTimePicker.vue';

const render: StoryFn<typeof RuiTimePicker> = args => ({
  components: { RuiTimePicker },
  setup() {
    return { args };
  },
  template: `
    <div class='flex gap-4'>
      <RuiTimePicker v-bind="args" v-model='args.modelValue' />
      <div class='text-rui-text'>{{ new Date(args.modelValue).toISOString() }}</div>
    </div>
  `,
});

const meta: Meta<typeof RuiTimePicker> = {
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
  component: RuiTimePicker,
  render,
  tags: ['autodocs'],
  title: 'Components/TimePicker',
};

type Story = StoryObj<typeof RuiTimePicker>;

export const Default: Story = {
  args: {
    accuracy: TimeAccuracy.MINUTE,
    modelValue: new Date(),
  },
};

export const WithSecondsAccuracy: Story = {
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
  },
};

export const WithMillisecondsAccuracy: Story = {
  args: {
    accuracy: TimeAccuracy.MILLISECOND,
    modelValue: new Date(),
  },
};

export default meta;
