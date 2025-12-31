import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import RuiDateTimePickerMenu from './RuiDateTimePickerMenu.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiDateTimePickerMenu>) {
  return mount(RuiDateTimePickerMenu, {
    global: {
      stubs: ['RuiCalendar', 'RuiTimePicker', 'RuiAutoComplete', 'RuiButton', 'RuiIcon'],
    },
    props: {
      accuracy: TimeAccuracy.MINUTE,
      calendarMenuOpen: false,
      selectedDate: undefined,
      selectedHour: undefined,
      selectedMillisecond: undefined,
      selectedMinute: undefined,
      selectedSecond: undefined,
      selectedTime: undefined,
      selectedTimezone: 'UTC',
      timeSelection: 'hour',
    },
    ...options,
  });
}

describe('ruiDateTimePickerMenu', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders RuiCalendar stub', () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent({ name: 'RuiCalendar' }).exists()).toBe(true);
  });

  it('renders RuiTimePicker stub', () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent({ name: 'RuiTimePicker' }).exists()).toBe(true);
  });

  it('renders set-now button', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('[data-id=set-now]').exists()).toBe(true);
  });

  it('renders timezone autocomplete', () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent({ name: 'RuiAutoComplete' }).exists()).toBe(true);
  });

  describe('props', () => {
    it('should accept accuracy prop', () => {
      const wrapper = createWrapper({
        props: {
          accuracy: TimeAccuracy.SECOND,
          calendarMenuOpen: false,
          selectedDate: undefined,
          selectedHour: undefined,
          selectedMillisecond: undefined,
          selectedMinute: undefined,
          selectedSecond: undefined,
          selectedTime: undefined,
          selectedTimezone: 'UTC',
          timeSelection: 'hour',
        },
      });
      expect(wrapper.props('accuracy')).toBe(TimeAccuracy.SECOND);
    });

    it('should accept minDate prop', () => {
      const minDate = new Date(2023, 0, 1);
      const wrapper = createWrapper({
        props: {
          accuracy: TimeAccuracy.MINUTE,
          calendarMenuOpen: false,
          minDate,
          selectedDate: undefined,
          selectedHour: undefined,
          selectedMillisecond: undefined,
          selectedMinute: undefined,
          selectedSecond: undefined,
          selectedTime: undefined,
          selectedTimezone: 'UTC',
          timeSelection: 'hour',
        },
      });
      expect(wrapper.props('minDate')).toEqual(minDate);
    });

    it('should accept maxDate prop', () => {
      const maxDate = new Date(2023, 11, 31);
      const wrapper = createWrapper({
        props: {
          accuracy: TimeAccuracy.MINUTE,
          calendarMenuOpen: false,
          maxDate,
          selectedDate: undefined,
          selectedHour: undefined,
          selectedMillisecond: undefined,
          selectedMinute: undefined,
          selectedSecond: undefined,
          selectedTime: undefined,
          selectedTimezone: 'UTC',
          timeSelection: 'hour',
        },
      });
      expect(wrapper.props('maxDate')).toEqual(maxDate);
    });
  });

  describe('v-model bindings', () => {
    it('should emit update:selectedDate when calendar date changes', async () => {
      const wrapper = createWrapper();
      const newDate = new Date(2023, 5, 15);

      await wrapper.findComponent({ name: 'RuiCalendar' }).vm.$emit('update:modelValue', newDate);

      expect(wrapper.emitted('update:selectedDate')).toBeTruthy();
      expect(wrapper.emitted('update:selectedDate')?.[0]).toEqual([newDate]);
    });

    it('should emit update:selectedTime when time picker changes', async () => {
      const wrapper = createWrapper();
      const newTime = new Date(2023, 5, 15, 14, 30);

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:modelValue', newTime);

      expect(wrapper.emitted('update:selectedTime')).toBeTruthy();
      expect(wrapper.emitted('update:selectedTime')?.[0]).toEqual([newTime]);
    });

    it('should emit update:selectedHour when hour changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:hour', 14);

      expect(wrapper.emitted('update:selectedHour')).toBeTruthy();
      expect(wrapper.emitted('update:selectedHour')?.[0]).toEqual([14]);
    });

    it('should emit update:selectedMinute when minute changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:minute', 30);

      expect(wrapper.emitted('update:selectedMinute')).toBeTruthy();
      expect(wrapper.emitted('update:selectedMinute')?.[0]).toEqual([30]);
    });

    it('should emit update:selectedSecond when second changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:second', 45);

      expect(wrapper.emitted('update:selectedSecond')).toBeTruthy();
      expect(wrapper.emitted('update:selectedSecond')?.[0]).toEqual([45]);
    });

    it('should emit update:selectedMillisecond when millisecond changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:millisecond', 123);

      expect(wrapper.emitted('update:selectedMillisecond')).toBeTruthy();
      expect(wrapper.emitted('update:selectedMillisecond')?.[0]).toEqual([123]);
    });

    it('should emit update:calendarMenuOpen when calendar menu state changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiCalendar' }).vm.$emit('update:menuOpen', true);

      expect(wrapper.emitted('update:calendarMenuOpen')).toBeTruthy();
      expect(wrapper.emitted('update:calendarMenuOpen')?.[0]).toEqual([true]);
    });

    it('should emit update:selectedTimezone when timezone changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiAutoComplete' }).vm.$emit('update:modelValue', 'America/New_York');

      expect(wrapper.emitted('update:selectedTimezone')).toBeTruthy();
      expect(wrapper.emitted('update:selectedTimezone')?.[0]).toEqual(['America/New_York']);
    });

    it('should emit update:timeSelection when time selection changes', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent({ name: 'RuiTimePicker' }).vm.$emit('update:selection', 'minute');

      expect(wrapper.emitted('update:timeSelection')).toBeTruthy();
      expect(wrapper.emitted('update:timeSelection')?.[0]).toEqual(['minute']);
    });
  });

  describe('set-now button', () => {
    it('should emit set-now event when clicked', async () => {
      const wrapper = createWrapper();

      await wrapper.find('[data-id=set-now]').trigger('click');

      expect(wrapper.emitted('set-now')).toBeTruthy();
      expect(wrapper.emitted('set-now')?.length).toBe(1);
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = createWrapper({
        slots: {
          default: '<div class="custom-slot-content">Custom Content</div>',
        },
      });

      expect(wrapper.find('.custom-slot-content').exists()).toBe(true);
      expect(wrapper.find('.custom-slot-content').text()).toBe('Custom Content');
    });
  });

  describe('layout', () => {
    it('should render the expected structure', () => {
      const wrapper = createWrapper();
      // Verify the component renders without errors
      expect(wrapper.exists()).toBe(true);
      // Verify the calendar and time picker are rendered
      expect(wrapper.findComponent({ name: 'RuiCalendar' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'RuiTimePicker' }).exists()).toBe(true);
    });
  });
});
