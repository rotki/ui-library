import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { TimeAccuracy } from '@/consts/time-accuracy';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

const render: StoryFn<typeof RuiDateTimePicker> = args => ({
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
});

const meta: Meta<typeof RuiDateTimePicker> = {
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

export const Optional: Story = {
  args: {
    accuracy: TimeAccuracy.SECOND,
    allowEmpty: true,
    modelValue: undefined,
    variant: 'outlined',
  },
};

export default meta;
