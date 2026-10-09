import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof RuiCalendar>) {
  return {
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
  };
}

const meta = preview.meta({
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
  title: 'Date & Time/Calendar',
});

export const Default = meta.story({
  args: {},
  async play({ canvas, userEvent }) {
    await expect(canvas.getByText('15')).toBeVisible(); // day 15 is in every month

    await userEvent.click(canvas.getByText('15'));
    // the click leaves the day focused; drop it so the story rests without a focus ring
    canvas.getByText('15').closest('button')?.blur();
  },
});

export const AllowEmpty = meta.story({
  args: {
    allowEmpty: true,
  },
});

/**
 * A day in the month the calendar opens on, so a bound falls inside the shown month.
 *
 * @param day - the day of the current month
 * @returns that date
 */
function dayOfThisMonth(day: number): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), day);
}

export const WithMinDate = meta.story({
  args: {
    minDate: dayOfThisMonth(10),
  },
});

export const WithMaxDate = meta.story({
  args: {
    maxDate: dayOfThisMonth(20),
  },
});

export default meta;
