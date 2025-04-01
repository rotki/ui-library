import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import RuiCalendar, { type CalendarProps } from '@/components/calendar/RuiCalendar.vue';

type Props = CalendarProps & { modelValue?: Date | null };

const render: StoryFn<Props> = args => ({
  components: { RuiCalendar },
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
    <div class="flex gap-4">
      <RuiCalendar v-model="modelValue" v-bind="args" />
      <div class="text-rui-text">{{ modelValue }}</div>
    </div>
  `,
});

const meta: Meta<Props> = {
  argTypes: {
    allowEmpty: { control: 'boolean' },
    maxDate: { control: 'date' },
    minDate: { control: 'date' },
    mode: {
      control: 'select',
      options: ['date', 'dateTime'],
    },
    timeAccuracy: {
      control: 'select',
      options: [1, 2, 3, 4],
    },
  },
  component: RuiCalendar,
  parameters: {
    docs: {
      controls: { exclude: ['default', 'as'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Calendar',
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {},
};

export const AllowEmpty: Story = {
  args: {
    allowEmpty: true,
  },
};

export const WithMinDate: Story = {
  args: {
    minDate: new Date(2025, 1, 10),
  },
};

export const WithMaxDate: Story = {
  args: {
    maxDate: new Date(2025, 3, 1),
  },
};

export const ModeDateTime: Story = {
  args: {
    mode: 'datetime',
  },
};

export const AccuracyMilliseconds: Story = {
  args: {
    mode: 'datetime',
    timeAccuracy: 4,
  },
};

export default meta;
