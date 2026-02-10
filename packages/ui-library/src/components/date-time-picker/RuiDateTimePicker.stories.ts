import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { TimeAccuracy } from '@/consts/time-accuracy';
import preview from '~/.storybook/preview';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

function render(args: ComponentPropsAndSlots<typeof RuiDateTimePicker>) {
  return {
    components: { RuiDateTimePicker },
    setup() {
      const iso = computed<string>(() => {
        if (args.modelValue) {
          return new Date(args.modelValue).toISOString();
        }
        return '-';
      });

      const epoch = computed<string>(() => {
        if (args.modelValue) {
          const epoch = new Date(args.modelValue).getTime();
          return epoch >= 0 ? epoch.toString() : '-';
        }
        return '-';
      });

      return { args, epoch, iso };
    },
    template: `<div>
      <RuiDateTimePicker v-bind="args" v-model="args.modelValue" />
      <div class="text-rui-text">
        <span class='font-medium'>Date:</span> {{ iso }}
      </div>
      <div class="text-rui-text">
        <span class='font-medium'>Epoch</span> {{ epoch }}
      </div>
    </div>`,
  };
}

const meta = preview.meta({
  argTypes: {
    accuracy: {
      control: 'select',
      options: [TimeAccuracy.SECOND, TimeAccuracy.MINUTE, TimeAccuracy.MILLISECOND],
      table: {
        defaultValue: {
          summary: TimeAccuracy.MINUTE,
        },
      },
    },
    modelValue: {
      control: 'date',
    },
    required: {
      control: 'boolean',
      table: { category: 'State' },
    },
  },
  component: RuiDateTimePicker,
  render,
  tags: ['autodocs'],
  title: 'Components/DateTimePicker',
});

export const Default = meta.story({
  args: {
    modelValue: new Date(),
  },
});

export const Outlined = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Optional = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    allowEmpty: true,
    modelValue: undefined,
    variant: 'outlined',
  },
});

export const WithMaxNow = meta.story({
  args: {
    accuracy: TimeAccuracy.SECOND,
    maxDate: 'now',
    modelValue: new Date(),
    variant: 'outlined',
  },
});

export const Required = meta.story({
  args: {
    modelValue: new Date(),
    required: true,
    variant: 'outlined',
  },
});

export default meta;
