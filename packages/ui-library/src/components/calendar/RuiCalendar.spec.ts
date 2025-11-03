import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import { assert } from '@/utils/assert';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiCalendar>,
): VueWrapper<InstanceType<typeof RuiCalendar>> {
  return mount(RuiCalendar, {
    global: {
      stubs: {
        Teleport: {
          template: '<div data-id="teleport"><slot /></div>',
        },
      },
    },
    ...options,
  });
}

describe('components/calendar/RuiCalendar.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiCalendar>>;

  const testDate = new Date(2023, 0, 15); // January 15, 2023
  let originalDate: typeof Date;

  beforeEach(() => {
    originalDate = Date;
    vi.useFakeTimers();
    vi.setSystemTime(testDate);
  });

  afterEach(() => {
    wrapper?.unmount();

    vi.useRealTimers();
    // eslint-disable-next-line no-restricted-globals
    global.Date = originalDate;
  });

  describe('component Rendering', () => {
    it('should render properly with default props', () => {
      wrapper = createWrapper();

      expect(wrapper.find('.rui-calendar').exists()).toBeTruthy();
      expect(wrapper.find('.rui-calendar').classes()).toContain('bordered');
      expect(wrapper.find('.rui-calendar').classes()).not.toContain('dark');
    });

    it('should render borderless when prop is set', () => {
      wrapper = createWrapper({
        props: {
          borderless: true,
        },
      });

      expect(wrapper.find('.rui-calendar').classes()).not.toContain('bordered');
    });

    it('should render with initial model value', () => {
      const selectedDate = new Date(2023, 0, 20); // January 20, 2023
      wrapper = createWrapper({
        props: {
          modelValue: selectedDate,
        },
      });

      expect(wrapper.find('button[class*="bg-rui-primary"]').exists()).toBeTruthy();
    });

    it('should render correct month title', () => {
      wrapper = createWrapper({
        props: {
          modelValue: testDate,
        },
      });

      expect(wrapper.text()).toContain('January 2023');
    });
  });

  describe('date Selection', () => {
    it('should select a date when clicked', async () => {
      wrapper = createWrapper();
      const targetDate = new Date(2023, 0, 10);

      // Find the button for January 10, 2023
      const paddedMonth = (targetDate.getMonth() + 1).toString().padStart(2, '0');
      const paddedDay = targetDate.getDate().toString().padStart(2, '0');
      const dayButton = wrapper.find(`button[data-id="${targetDate.getFullYear()}-${paddedMonth}-${paddedDay}"]`);

      await dayButton.trigger('click');

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      const emittedFirst = emitted![0];
      assert(emittedFirst);
      const emittedValue = emittedFirst[0] as Date;
      expect(emittedValue.getDate()).toBe(10);
      expect(emittedValue.getMonth()).toBe(0);
      expect(emittedValue.getFullYear()).toBe(2023);
    });

    it('should update selected date when model value changes externally', async () => {
      const initialDate = new Date(2023, 0, 10);
      const newDate = new Date(2023, 0, 20);

      wrapper = createWrapper({
        props: {
          modelValue: initialDate,
        },
      });

      await wrapper.setProps({ modelValue: newDate });
      await nextTick();

      // Check that the new date is visually selected
      expect(wrapper.find('button[class*="bg-rui-primary"]').exists()).toBeTruthy();
    });

    it('should clear selection when allowEmpty is true and selected date is clicked', async () => {
      const selectedDate = new Date(2023, 0, 15);
      wrapper = createWrapper({
        props: {
          allowEmpty: true,
          modelValue: selectedDate,
        },
      });

      const selectedButton = wrapper.find('button[class*="bg-rui-primary"]');
      await selectedButton.trigger('click');

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      const emittedFirst = emitted![0];
      assert(emittedFirst);
      const emittedValue = emittedFirst[0];
      expect(emittedValue).toBeUndefined();
    });

    it('should not clear selection when allowEmpty is false', async () => {
      const selectedDate = new Date(2023, 0, 15);
      wrapper = createWrapper({
        props: {
          allowEmpty: false,
          modelValue: selectedDate,
        },
      });

      const selectedButton = wrapper.find('button[class*="bg-rui-primary"]');
      await selectedButton.trigger('click');

      // Should not emit undefined when allowEmpty is false
      const emissions = wrapper.emitted('update:modelValue') || [];
      const lastEmission = emissions.at(-1)?.[0];
      expect(lastEmission).not.toBeUndefined();
    });
  });

  describe('navigation', () => {
    it('should navigate to previous month', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(2023, 1, 15), // February 15, 2023
        },
      });

      const prevButton = wrapper.findAll('button[class*="nav-button"]')[0];
      await prevButton?.trigger('click');

      expect(wrapper.text()).toContain('January 2023');
      expect(wrapper.emitted('update:pages')).toBeTruthy();
    });

    it('should navigate to next month', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(2023, 0, 15), // January 15, 2023
        },
      });

      const nextButton = wrapper.findAll('button[class*="nav-button"]')[1];
      await nextButton?.trigger('click');

      expect(wrapper.text()).toContain('February 2023');
      expect(wrapper.emitted('update:pages')).toBeTruthy();
    });

    it('should handle year boundaries correctly', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(2023, 11, 15), // December 15, 2023
        },
      });

      // Navigate to next month (should go to January 2024)
      const nextButton = wrapper.findAll('button[class*="nav-button"]')[1];
      await nextButton?.trigger('click');

      expect(wrapper.text()).toContain('January 2024');
    });

    it('should emit update:pages event when navigating', async () => {
      wrapper = createWrapper();

      const nextButton = wrapper.findAll('button[class*="nav-button"]')[1];
      await nextButton?.trigger('click');

      const pagesEmission = wrapper.emitted('update:pages');
      expect(pagesEmission).toBeTruthy();
      const pagesFirst = pagesEmission![0];
      assert(pagesFirst);
      expect(pagesFirst[0]).toEqual([{ title: 'February 2023' }]);
    });
  });

  describe('month/Year Selection Menu', () => {
    it('should open month/year selection menu when title is clicked', async () => {
      wrapper = createWrapper();

      const titleElement = wrapper.find('.header-title');
      await titleElement.trigger('click');

      const emitted = wrapper.emitted('update:menu-open');
      expect(emitted).toBeTruthy();
      const emittedFirst = emitted![0];
      assert(emittedFirst);
      const menuOpenValue = emittedFirst[0];
      expect(menuOpenValue).toBe(true);
    });

    it('should handle month selection from menu', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(2023, 0, 15), // January 15, 2023
        },
      });

      // Simulate month selection event
      const calendarHeader = wrapper.findComponent({ name: 'RuiCalendarHeader' });
      await calendarHeader.vm.$emit('select-month', { month: 5, year: 2023 }); // June 2023

      await nextTick();
      expect(wrapper.text()).toContain('June 2023');
    });

    it('should allow returning to max date year when navigating years', async () => {
      const maxDate = new Date(2025, 11, 31); // December 31, 2025
      wrapper = createWrapper({
        props: {
          maxDate,
          modelValue: new Date(2023, 0, 15), // January 15, 2023
        },
      });

      // Open the month/year selection menu
      const titleElement = wrapper.find('.header-title');
      await titleElement.trigger('click');
      await nextTick();

      // Find the calendar menu component
      const calendarMenu = wrapper.findComponent({ name: 'RuiCalendarMenu' });
      expect(calendarMenu.exists()).toBeTruthy();

      // Simulate switching to year view and navigating to max year
      await calendarMenu.vm.$emit('select', { month: 0, year: 2025 }); // January 2025

      await nextTick();
      expect(wrapper.text()).toContain('January 2025');
    });
  });

  describe('date Constraints', () => {
    it('should disable dates before minDate', () => {
      const minDate = new Date(2023, 0, 10);
      wrapper = createWrapper({
        props: {
          minDate,
        },
      });

      // Date before minDate should be disabled
      const disabledButton = wrapper.find('button[disabled]');
      expect(disabledButton.exists()).toBeTruthy();
    });

    it('should disable dates after maxDate', () => {
      const maxDate = new Date(2023, 0, 20);
      wrapper = createWrapper({
        props: {
          maxDate,
        },
      });

      // Find buttons and check that some are disabled
      const buttons = wrapper.findAll('button[type="button"]');
      const disabledButtons = buttons.filter(button => button.attributes('disabled') !== undefined);
      expect(disabledButtons.length).toBeGreaterThan(0);
    });

    it('should allow selection within date range', async () => {
      const minDate = new Date(2023, 0, 10);
      const maxDate = new Date(2023, 0, 20);
      wrapper = createWrapper({
        props: {
          maxDate,
          minDate,
        },
      });

      // Try to select a date within range
      const dayButtons = wrapper.findAll('button[type="button"]');
      const targetButton = dayButtons.find(button => button.text() === '15' && !button.attributes('disabled'));

      if (targetButton) {
        await targetButton.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      }
    });

    it('should handle number-based minDate and maxDate', () => {
      const minTimestamp = new Date(2023, 0, 10).getTime();
      const maxTimestamp = new Date(2023, 0, 20).getTime();

      wrapper = createWrapper({
        props: {
          maxDate: maxTimestamp,
          minDate: minTimestamp,
        },
      });

      expect(wrapper.exists()).toBeTruthy();
      // Verify that dates are properly constrained
      const disabledButtons = wrapper.findAll('button[disabled]');
      expect(disabledButtons.length).toBeGreaterThan(0);
    });
  });

  describe('today Indicator', () => {
    it('should show today indicator on current date', () => {
      wrapper = createWrapper();

      // Look for today's date with special styling
      const todayButton = wrapper.find('button[class*="today-indicator"]');
      expect(todayButton.exists()).toBeTruthy();
    });

    it('should not show today indicator when today is selected', () => {
      wrapper = createWrapper({
        props: {
          modelValue: testDate, // Today's date
        },
      });

      // When today is selected, it should have selected styling, not today indicator
      const selectedButton = wrapper.find('button[class*="bg-rui-primary"]');
      expect(selectedButton.exists()).toBeTruthy();

      // Should not have both selected and today indicator classes
      const todayIndicator = wrapper.find('button[class*="today-indicator"]');
      expect(todayIndicator.exists()).toBeFalsy();
    });
  });

  describe('previous/Next Month Days', () => {
    it('should show grayed out days from previous and next months', () => {
      wrapper = createWrapper();

      // Look for days that are not in current month (should be grayed out)
      const grayedDays = wrapper.findAll('button[class*="text-gray-400"]');
      expect(grayedDays.length).toBeGreaterThan(0);
    });

    it('should allow selection of previous/next month days when in range', async () => {
      wrapper = createWrapper({
        props: {
          maxDate: new Date(2023, 1, 5), // February 5, 2023
          minDate: new Date(2022, 11, 25), // December 25, 2022
        },
      });

      // Find a day from previous month that should be selectable
      const prevMonthDays = wrapper.findAll('button[class*="text-gray-400"]:not([disabled])');

      if (prevMonthDays.length > 0) {
        const firstPrevMonthDay = prevMonthDays[0];
        assert(firstPrevMonthDay);
        await firstPrevMonthDay.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      }
    });
  });

  describe('exposed Methods', () => {
    it('should expose move method for programmatic navigation', async () => {
      wrapper = createWrapper();
      const component = wrapper.vm;

      // Test that move method exists and can be called
      expect(typeof component.move).toBe('function');

      // Test moving to a specific date
      const targetDate = new Date(2023, 5, 15); // June 15, 2023
      component.move(targetDate);

      await nextTick();
      expect(wrapper.text()).toContain('June 2023');
    });

    it('should handle move method with timestamp', async () => {
      wrapper = createWrapper();
      const component = wrapper.vm;

      const targetTimestamp = new Date(2023, 7, 10).getTime(); // August 10, 2023
      component.move(targetTimestamp);

      await nextTick();
      expect(wrapper.text()).toContain('August 2023');
    });
  });

  describe('menu State Management', () => {
    it('should manage menu-open model correctly', async () => {
      wrapper = createWrapper({
        props: {
          menuOpen: false,
        },
      });

      // Simulate opening the menu
      await wrapper.setProps({ menuOpen: true });

      // The component should react to the prop change
      expect(wrapper.props('menuOpen')).toBe(true);
    });

    it('should emit menu-open updates', async () => {
      wrapper = createWrapper();

      const calendarHeader = wrapper.findComponent({ name: 'RuiCalendarHeader' });
      await calendarHeader.vm.$emit('update:menu-open', true);

      const emitted = wrapper.emitted('update:menu-open');
      expect(emitted).toBeTruthy();
      const emittedFirst = emitted![0];
      assert(emittedFirst);
      expect(emittedFirst[0]).toBe(true);
    });
  });

  describe('view Synchronization', () => {
    it('should update view when model value changes to different month', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(2023, 0, 15), // January 15, 2023
        },
      });

      expect(wrapper.text()).toContain('January 2023');

      // Change to a different month
      await wrapper.setProps({
        modelValue: new Date(2023, 5, 20), // June 20, 2023
      });

      await nextTick();
      expect(wrapper.text()).toContain('June 2023');
    });

    it('should maintain view when clearing selection', async () => {
      wrapper = createWrapper({
        props: {
          allowEmpty: true,
          modelValue: new Date(2023, 3, 15), // April 15, 2023
        },
      });

      expect(wrapper.text()).toContain('April 2023');

      // Clear selection
      await wrapper.setProps({ modelValue: undefined });
      await nextTick();

      // View should remain on April
      expect(wrapper.text()).toContain('April 2023');
    });
  });

  describe('edge Cases', () => {
    it('should handle undefined initial model value', () => {
      wrapper = createWrapper({
        props: {
          modelValue: undefined,
        },
      });

      expect(wrapper.exists()).toBeTruthy();
      // Should default to current date's month/year
      expect(wrapper.text()).toContain('January 2023');
    });

    it('should handle rapid navigation clicks', async () => {
      wrapper = createWrapper();

      const nextButton = wrapper.findAll('button[class*="nav-button"]')[1];

      // Rapidly click next button
      await nextButton?.trigger('click');
      await nextButton?.trigger('click');
      await nextButton?.trigger('click');

      await nextTick();
      expect(wrapper.text()).toContain('April 2023');
    });

    it('should preserve time when selecting dates', async () => {
      const initialDate = new Date(2023, 0, 15, 14, 30, 45); // January 15, 2023 2:30:45 PM
      wrapper = createWrapper({
        props: {
          modelValue: initialDate,
        },
      });

      // Select a different date
      const dayButtons = wrapper.findAll('button[type="button"]');
      const targetButton = dayButtons.find(button => button.text() === '20' && !button.attributes('disabled'));

      if (targetButton) {
        await targetButton.trigger('click');

        const emitted = wrapper.emitted('update:modelValue');
        assert(emitted);
        const emittedFirst = emitted[0];
        assert(emittedFirst);
        const emittedValue = emittedFirst[0] as Date;
        expect(emittedValue.getHours()).toBe(14);
        expect(emittedValue.getMinutes()).toBe(30);
        expect(emittedValue.getSeconds()).toBe(45);
      }
    });
  });
});
