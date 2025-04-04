import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import type { ExtractPropTypes } from 'vue';
import { TimeAccuracy } from '@/components/calendar/state';
import RuiTimePicker from './RuiTimePicker.vue';

type RuiTimePickerProps = ExtractPropTypes<typeof RuiTimePicker['props']>;

const render: StoryFn<RuiTimePickerProps> = args => ({
  components: { RuiTimePicker },
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
  template: `
    <div class='flex gap-4'>
      <RuiTimePicker v-bind="args" v-model='modelValue' />
      <div class='text-rui-text'>{{ modelValue }}</div>
    </div>
  `,
});

const meta: Meta<RuiTimePickerProps> = {
  argTypes: {},
  component: RuiTimePicker,
  render,
  tags: ['autodocs'],
  title: 'Components/TimePicker',
};

type Story = StoryObj<RuiTimePickerProps>;

export const Default: Story = {
  args: {
    modelValue: new Date(),
  },
};

export const WithSecondsAccuracy: Story = {
  args: {
    accuracy: TimeAccuracy.SECONDS,
    modelValue: new Date(),
  },
};

export const WithMillisecondsAccuracy: Story = {
  args: {
    accuracy: TimeAccuracy.MILLISECONDS,
    modelValue: new Date(),
  },
};

export default meta;
