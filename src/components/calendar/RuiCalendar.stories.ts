import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';

const render: StoryFn<typeof RuiCalendar> = args => ({
  components: { RuiCalendar },
  name: 'RuiCalendarStory',
  setup() {
    const iso = computed<string>(() => {
      if (args.modelValue) {
        return new Date(args.modelValue).toISOString();
      }
      return '-';
    });
    return { args, iso };
  },
  template: `
    <div class="flex gap-4">
      <RuiCalendar v-model="args.modelValue" v-bind="args" />
      <div class="text-rui-text">{{ iso }}</div>
    </div>
  `,
});

const meta: Meta<typeof RuiCalendar> = {
  argTypes: {
    'allowEmpty': { control: 'boolean' },
    'maxDate': { control: 'date' },
    'minDate': { control: 'date' },
    'modelValue': {
      control: 'date',
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
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

type Story = StoryObj<typeof RuiCalendar>;

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

export default meta;
