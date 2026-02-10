import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { TimeAccuracy } from '@/consts/time-accuracy';
import preview from '~/.storybook/preview';
import RuiTimePicker from './RuiTimePicker.vue';

function render(args: ComponentPropsAndSlots<typeof RuiTimePicker>) {
  return {
    components: { RuiTimePicker },
    setup() {
      return { args };
    },
    template: `
      <div class='flex gap-4'>
        <RuiTimePicker v-bind="args" v-model='args.modelValue' />
        <div class='text-rui-text'>{{ args.modelValue !== undefined ? new Date(args.modelValue).toISOString(): '-' }}</div>
      </div>
    `,
  };
}

const meta = preview.meta({
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
});

export const Default = meta.story({
  args: {
    accuracy: TimeAccuracy.MINUTE,
    modelValue: new Date(),
  },
});

export const WithSecondsAccuracy = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
  },
});

export const WithMillisecondsAccuracy = meta.story({
  args: {
    accuracy: TimeAccuracy.MILLISECOND,
    modelValue: new Date(),
  },
});

export const WithEmptyValue = meta.story({
  args: {
    modelValue: undefined,
  },
});

export default meta;
