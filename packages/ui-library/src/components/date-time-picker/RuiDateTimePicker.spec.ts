import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TransitionGroupStub } from '@/__test__/transition-group-stub';
import { assert } from '@/utils/assert';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

vi.mock('@/components/date-time-picker/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/date-time-picker/utils')>();
  return {
    ...actual,
    guessTimezone: () => 'UTC',
  };
});

function createWrapper(
  options: ComponentMountingOptions<typeof RuiDateTimePicker>,
): VueWrapper<InstanceType<typeof RuiDateTimePicker>> {
  return mount(RuiDateTimePicker, {
    global: {
      stubs: {
        Teleport: {
          template: '<div data-id="teleport"><slot /></div>',
        },
        TransitionGroup: TransitionGroupStub,
      },
    },
    ...options,
  });
}

describe('components/date-time-picker/RuiDateTimePicker.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiDateTimePicker>>;

  const fixedDate = new Date(2023, 0, 15, 10, 30, 45, 500);
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        type: 'date',
      },
    });

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });

  it('should render the default label', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        type: 'date',
        variant: 'outlined',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('[data-id="label"]').text()).toBe('Pick a date');

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY HH:mm');
  });

  it('should render with custom label', async () => {
    const customLabel = 'Custom Date Label';
    wrapper = createWrapper({
      props: {
        label: customLabel,
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('[data-id="label"]').text()).toBe(customLabel);
  });

  it('should apply disabled state correctly', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        modelValue: new Date(),
      },
    });

    const activator = wrapper.find('[data-id="activator"]');
    expect(activator.attributes('tabindex')).toBe('-1');

    const input = wrapper.find('input');
    expect(input.attributes('disabled')).toBeDefined();
  });

  it('should apply readonly state correctly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        readonly: true,
      },
    });

    const activator = wrapper.find('[data-id="activator"]');
    expect(activator.attributes('tabindex')).toBe('-1');

    const input = wrapper.find('input');
    expect(input.attributes('readonly')).toBeDefined();
  });

  it('should apply dense state correctly', () => {
    wrapper = createWrapper({
      props: {
        dense: true,
        modelValue: new Date(),
      },
    });

    // Dense mode should render without errors and the component should exist
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });

  it('should apply outlined variant correctly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    // Outlined variant should render without errors
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });

  it('should show error messages correctly', () => {
    const errorMessage = 'This is an error message';
    wrapper = createWrapper({
      props: {
        errorMessages: errorMessage,
        modelValue: new Date(),
      },
    });

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('should show success messages correctly', () => {
    const successMessage = 'This is a success message';
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        successMessages: successMessage,
      },
    });

    expect(wrapper.text()).toContain(successMessage);
  });

  it('should use month-first format correctly', () => {
    wrapper = createWrapper({
      props: {
        format: 'month-first',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('MM/DD/YYYY HH:mm');
  });

  it('should use year-first format correctly', () => {
    wrapper = createWrapper({
      props: {
        format: 'year-first',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('YYYY/MM/DD HH:mm');
  });

  it('should use second accuracy correctly', () => {
    wrapper = createWrapper({
      props: {
        accuracy: 'second',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY HH:mm:ss');
  });

  it('should use millisecond accuracy correctly', () => {
    wrapper = createWrapper({
      props: {
        accuracy: 'millisecond',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY HH:mm:ss.SSS');
  });

  it('should initialize with current date when allowEmpty is false', async () => {
    wrapper = createWrapper({
      props: {
        allowEmpty: false,
        modelValue: new Date(),
      },
    });

    await vi.runOnlyPendingTimersAsync();

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeFalsy();

    const input = wrapper.find('input');
    expect(input.element.value).not.toBe('');
  });

  it('should initialize empty when allowEmpty is true', () => {
    wrapper = createWrapper({
      props: {
        allowEmpty: true,
        modelValue: undefined,
      },
    });

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeFalsy();
  });

  it('should handle date model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);

    wrapper = createWrapper({
      props: {
        modelValue: testDate,
        type: 'date',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    const input = wrapper.find('input');
    expect(input.element.value).toContain('15/06/2023');
    expect(input.element.value).toContain('14:30');
  });

  it('should handle epoch-ms model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);
    const epochMs = testDate.getTime();

    wrapper = createWrapper({
      props: {
        modelValue: epochMs,
        type: 'epoch-ms',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    const input = wrapper.find('input');
    expect(input.element.value).toContain('15/06/2023');
    expect(input.element.value).toContain('14:30');

    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=set-now]').trigger('click');

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    const target = dayjs(fixedDate).set('second', 0).set('millisecond', 0);
    expect(lastEmittedValue).toBe(target.valueOf());
  });

  it('should handle epoch model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);
    const epoch = Math.floor(testDate.getTime() / 1000);

    wrapper = createWrapper({
      props: {
        modelValue: epoch,
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    const input = wrapper.find('input');
    expect(input.element.value).toContain('15/06/2023');
    expect(input.element.value).toContain('14:30');

    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=set-now]').trigger('click');

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    const target = dayjs(fixedDate).set('second', 0).set('millisecond', 0);
    expect(lastEmittedValue).toBe(target.valueOf() / 1000);
  });

  it('should respect min date constraint', async () => {
    const minDate = new Date(2023, 0, 10);

    wrapper = createWrapper({
      props: {
        minDate,
        modelValue: new Date(2023, 0, 5), // Date before minDate
      },
    });

    await vi.runOnlyPendingTimersAsync();

    await wrapper.find('[data-id="activator"]').trigger('click');

    const menu = wrapper.find('[data-menu-disabled="false"]');
    expect(menu.exists()).toBeTruthy();

    // Verify the constraint is enforced by checking the error message
    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${minDate.toLocaleDateString()}`);
  });

  it('should respect max date constraint', async () => {
    const maxDate = new Date(2023, 0, 20);

    wrapper = createWrapper({
      props: {
        maxDate,
        modelValue: new Date(2023, 0, 25), // Date after maxDate
      },
    });

    await vi.runOnlyPendingTimersAsync();

    await wrapper.find('[data-id="activator"]').trigger('click');

    const menu = wrapper.find('[data-menu-disabled="false"]');
    expect(menu.exists()).toBeTruthy();

    // Verify the constraint is enforced by checking the error message
    expect(wrapper.find('.details').text()).toContain(`Date cannot be after ${maxDate.toLocaleDateString()}`);
  });

  it('should show error message when date is below minAllowedDate', async () => {
    const minDate = new Date(2023, 0, 10);
    const belowMinDate = new Date(2023, 0, 5); // Date before minDate

    wrapper = createWrapper({
      props: {
        minDate,
        modelValue: belowMinDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${minDate.toLocaleDateString()}`);
  });

  it('should show error message when date is above maxAllowedDate', async () => {
    const maxDate = new Date(2023, 0, 20);
    const aboveMaxDate = new Date(2023, 0, 25);

    wrapper = createWrapper({
      props: {
        maxDate,
        modelValue: aboveMaxDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('.details').text()).toContain(`Date cannot be after ${maxDate.toLocaleDateString()}`);
  });

  it('should show an error when now is used as mas an the date is in the future', async () => {
    const aboveMaxDate = new Date(2023, 0, 25);

    wrapper = createWrapper({
      props: {
        maxDate: 'now',
        modelValue: aboveMaxDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('.details').text()).toContain('The selected date cannot be in the future');
  });

  it('should handle "now" as maxDate correctly', async () => {
    // Set model value to the current time (fixedDate) which should be valid
    wrapper = createWrapper({
      props: {
        maxDate: 'now',
        modelValue: fixedDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();

    // With maxDate="now" and modelValue=fixedDate, there should be no error
    expect(wrapper.find('.details').text()).not.toContain('cannot be in the future');

    // Now change to a future date and verify the error appears
    const futureDate = new Date(2023, 0, 25);
    await wrapper.setProps({ modelValue: futureDate });
    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain('The selected date cannot be in the future');
  });

  it('should respect min date constraint with epoch type', async () => {
    const testDate = new Date(2023, 0, 10);
    const minDateEpoch = Math.floor(testDate.getTime() / 1000);

    wrapper = createWrapper({
      props: {
        minDate: minDateEpoch,
        modelValue: new Date(2023, 0, 5), // Date before minDate
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    // Verify the constraint works by checking the error message
    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${testDate.toLocaleDateString()}`);
  });

  it('should respect max date constraint with epoch type', async () => {
    const testDate = new Date(2023, 0, 20);
    const maxDateEpoch = Math.floor(testDate.getTime() / 1000);

    wrapper = createWrapper({
      props: {
        maxDate: maxDateEpoch,
        modelValue: new Date(2023, 0, 25), // Date after maxDate
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    // Verify the constraint works by checking the error message
    expect(wrapper.find('.details').text()).toContain(`Date cannot be after ${testDate.toLocaleDateString()}`);
  });

  it('should show error message when date is below minAllowedDate with epoch type', async () => {
    const testDate = new Date(2023, 0, 10);
    const minDateEpoch = Math.floor(testDate.getTime() / 1000);
    const belowMinDate = new Date(2023, 0, 5); // Date before minDate

    wrapper = createWrapper({
      props: {
        minDate: minDateEpoch,
        modelValue: belowMinDate,
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${testDate.toLocaleDateString()}`);
  });

  it('should show error message when date is above maxAllowedDate with epoch type', async () => {
    const testDate = new Date(2023, 0, 20);
    const maxDateEpoch = Math.floor(testDate.getTime() / 1000);
    const aboveMaxDate = new Date(2023, 0, 25); // Date after maxDate

    wrapper = createWrapper({
      props: {
        maxDate: maxDateEpoch,
        modelValue: aboveMaxDate,
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be after ${testDate.toLocaleDateString()}`);
  });

  it('should clear the value when clear button is clicked', async () => {
    wrapper = createWrapper({
      props: {
        allowEmpty: true,
        modelValue: new Date(2023, 0, 15),
      },
    });

    await vi.runOnlyPendingTimersAsync();

    // Verify initial value is set
    const input = wrapper.find('input');
    expect(input.element.value).toBeTruthy();

    // Find and click the clear button
    const clearButton = wrapper.find('[data-id="clear-button"]');
    expect(clearButton.exists()).toBe(true);
    await clearButton.trigger('click');

    await vi.runOnlyPendingTimersAsync();

    // Check that the model value was emitted as undefined
    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();
    const emittedFirst = modelValue?.[0];
    assert(emittedFirst);
    expect(emittedFirst[0]).toBeUndefined();
  });

  it('should set current date and time when "now" button is clicked', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2022, 0, 1), // Old date
        type: 'date',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=activator]').trigger('click');
    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('[data-id=set-now]').trigger('click');

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];

    assert(lastEmittedValue instanceof Date);
    expect(lastEmittedValue.getFullYear()).toBe(fixedDate.getFullYear());
    expect(lastEmittedValue.getMonth()).toBe(fixedDate.getMonth());
    expect(lastEmittedValue.getDate()).toBe(fixedDate.getDate());
  });

  it('should update the date if the user updates using the keyboard arrows', async () => {
    const date = dayjs('2022-01-01 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    for (let i = 0; i < 5; i++) {
      if (i % 2 !== 0) {
        await inputField.trigger('keydown.ArrowUp');
      }
      else {
        await inputField.trigger('keydown.ArrowDown');
      }

      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
    }

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();
    expect(modelValue).toHaveLength(5);

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue && lastEmittedValue instanceof Date);
    expect(dayjs(lastEmittedValue).isSame(dayjs('2021-03-03 10:08')), 'the emitted date was not the expected')
      .toBeTruthy();
  });

  it('should clear the field on delete and allow the user to type a new date', async () => {
    const date = dayjs('2022-01-01 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    for (let i = 0; i < 2; i++) {
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
    }

    await inputField.trigger('keydown.Delete');
    await vi.runOnlyPendingTimersAsync();

    await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
    await inputField.trigger('keydown', { code: 'Digit5', key: '5' });

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();
    expect(modelValue).toHaveLength(1);

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue && lastEmittedValue instanceof Date);
    expect(dayjs(lastEmittedValue).isSame(dayjs('2025-01-01 09:09')), 'the emitted date was not the expected')
      .toBeTruthy();
  });

  it('should remove the last field on backspace and allow the user fill', async () => {
    const date = dayjs('2022-01-01 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    for (let i = 0; i < 2; i++) {
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
    }

    await inputField.trigger('keydown.Backspace');
    await vi.runOnlyPendingTimersAsync();

    await inputField.trigger('keydown', { code: 'Digit5', key: '5' });

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();
    expect(modelValue).toHaveLength(1);

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue && lastEmittedValue instanceof Date);
    expect(dayjs(lastEmittedValue).isSame(dayjs('2025-01-01 09:09')), 'the emitted date was not the expected')
      .toBeTruthy();
  });

  it('should be able to type a full date following the pattern', async () => {
    const date = dayjs('2022-01-01 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
    await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
    await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
    await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
    await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
    await vi.runOnlyPendingTimersAsync();

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue && lastEmittedValue instanceof Date);
    expect(dayjs(lastEmittedValue).isSame(dayjs('2000-12-12 10:05')), 'the emitted date was not the expected')
      .toBeTruthy();
  });

  it('should update the model when setting a date using setValue', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2022, 0, 1), // Start with January 1, 2022
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const date = dayjs('2011-05-04 10:22');

    // Default format is day-first (DD/MM/YYYY HH:mm)
    await wrapper.find('input').setValue(date.format('DD/MM/YYYY HH:mm'));
    await vi.runOnlyPendingTimersAsync();

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue instanceof Date);

    expect(dayjs(lastEmittedValue).isSame(date, 'day')).toBeTruthy();
  });

  it('should allow typing leading zero for month (e.g., 08 for August)', async () => {
    const date = dayjs('2022-01-01 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    // Move to month field (skip day field)
    await inputField.trigger('keydown.ArrowRight');
    await vi.runOnlyPendingTimersAsync();

    // Type "0" then "8" for August
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await vi.runOnlyPendingTimersAsync();
    await inputField.trigger('keydown', { code: 'Digit8', key: '8' });
    await vi.runOnlyPendingTimersAsync();

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue && lastEmittedValue instanceof Date);

    // Should be August (month 8)
    expect(dayjs(lastEmittedValue).month()).toBe(7); // JavaScript months are 0-indexed (7 = August)
    expect(dayjs(lastEmittedValue).format('YYYY-MM-DD')).toBe('2022-08-01');
  });

  it('should reject typing 0 alone for month', async () => {
    const date = dayjs('2022-05-15 09:09');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    // Move to month field (skip day field)
    await inputField.trigger('keydown.ArrowRight');
    await vi.runOnlyPendingTimersAsync();

    // Clear the month field first
    await inputField.trigger('keydown.Delete');
    await vi.runOnlyPendingTimersAsync();

    // Check emissions before typing "0"
    let modelValue = wrapper.emitted('update:modelValue');
    const emissionsBeforeZero = modelValue?.length ?? 0;

    // Type "0" for month - should be rejected (minValue = 1)
    // Before the fix: typing "0" would set month to 0 (December of previous year) and auto-advance
    await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
    await vi.runOnlyPendingTimersAsync();

    // Verify that typing "0" did NOT emit any model update
    modelValue = wrapper.emitted('update:modelValue');
    const emissionsAfterZero = modelValue?.length ?? 0;
    expect(emissionsAfterZero).toBe(emissionsBeforeZero);

    // Type "9" - since "0" was rejected and didn't set any value,
    // this should set month to 9 (September) directly, not "09"
    await inputField.trigger('keydown', { code: 'Digit9', key: '9' });
    await vi.runOnlyPendingTimersAsync();

    // Now there should be exactly one more emission from typing "9"
    modelValue = wrapper.emitted('update:modelValue');
    assert(modelValue);
    expect(modelValue.length).toBe(emissionsAfterZero + 1);

    const lastEmittedValue = modelValue.at(-1)?.[0];
    assert(lastEmittedValue instanceof Date);

    const emittedDate = dayjs(lastEmittedValue);

    // Should be September (month index 8), not December (11) which would result from month 0
    expect(emittedDate.month()).toBe(8); // September (0-indexed)
    expect(emittedDate.year()).toBe(2022);
    expect(emittedDate.date()).toBe(15);
  });

  it('should select segment when clicking on it', async () => {
    const date = dayjs('2023-06-15 14:30');
    wrapper = createWrapper({
      props: {
        modelValue: date.toDate(),
        type: 'date',
        format: 'day-first',
      },
    });
    await vi.runOnlyPendingTimersAsync();

    const inputField = wrapper.find('input');
    const inputElement = inputField.element as HTMLInputElement;

    // Focus the input first
    await inputField.trigger('focus');
    await vi.runOnlyPendingTimersAsync();

    // Simulate clicking on the month segment by setting selectionStart to position 4
    // Position 4 is in the "MM" segment for "15/06/2023 14:30" format (DD/MM/YYYY HH:mm)
    inputElement.selectionStart = 4;
    inputElement.selectionEnd = 4;

    await inputField.trigger('click');
    await vi.runOnlyPendingTimersAsync();

    // Check that the month segment is selected (positions 3-5 for "MM" in "DD/MM/YYYY HH:mm")
    expect(inputElement.selectionStart).toBe(3);
    expect(inputElement.selectionEnd).toBe(5);
  });

  it('should show required asterisk when required prop is true', async () => {
    const customLabel = 'Custom Date Label';
    wrapper = createWrapper({
      props: {
        label: customLabel,
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    // Required asterisk should not be present by default
    expect(wrapper.find('[data-id="label"]').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('[data-id="label"]').text()).toContain('﹡');
    expect(wrapper.find('[data-id="required-indicator"]').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('[data-id="label"]').text()).not.toContain('﹡');
  });

  describe('model value synchronization', () => {
    it('should update display when modelValue prop changes externally', async () => {
      const initialDate = new Date(2022, 0, 15, 10, 30);
      wrapper = createWrapper({
        props: {
          modelValue: initialDate,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('15/01/2022');
      expect(input.element.value).toContain('10:30');

      // Update modelValue externally
      const newDate = new Date(2024, 5, 20, 16, 45);
      await wrapper.setProps({ modelValue: newDate });
      await vi.runOnlyPendingTimersAsync();

      expect(input.element.value).toContain('20/06/2024');
      expect(input.element.value).toContain('16:45');
    });

    it('should sync epoch-ms value correctly when updated', async () => {
      const initialDate = new Date(2022, 0, 15, 10, 30);
      wrapper = createWrapper({
        props: {
          modelValue: initialDate.getTime(),
          type: 'epoch-ms',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const newDate = new Date(2024, 5, 20, 16, 45);
      await wrapper.setProps({ modelValue: newDate.getTime() });
      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('20/06/2024');
      expect(input.element.value).toContain('16:45');
    });

    it('should sync epoch value correctly when updated', async () => {
      const initialDate = new Date(2022, 0, 15, 10, 30);
      const initialEpoch = Math.floor(initialDate.getTime() / 1000);
      wrapper = createWrapper({
        props: {
          modelValue: initialEpoch,
          type: 'epoch',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const newDate = new Date(2024, 5, 20, 16, 45);
      const newEpoch = Math.floor(newDate.getTime() / 1000);
      await wrapper.setProps({ modelValue: newEpoch });
      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('20/06/2024');
      expect(input.element.value).toContain('16:45');
    });
  });

  describe('edge cases', () => {
    it('should handle leap year February correctly', async () => {
      // 2024 is a leap year
      const leapYearFeb = new Date(2024, 1, 29, 12, 0); // Feb 29, 2024
      wrapper = createWrapper({
        props: {
          modelValue: leapYearFeb,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('29/02/2024');
    });

    it('should handle non-leap year February correctly', async () => {
      // 2023 is not a leap year - Feb 28 is the last day
      const nonLeapYearFeb = new Date(2023, 1, 28, 12, 0);
      wrapper = createWrapper({
        props: {
          modelValue: nonLeapYearFeb,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('28/02/2023');
    });

    it('should handle year boundary correctly (Dec 31 to Jan 1)', async () => {
      const endOfYear = new Date(2023, 11, 31, 23, 59);
      wrapper = createWrapper({
        props: {
          modelValue: endOfYear,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('31/12/2023');
      expect(input.element.value).toContain('23:59');
    });

    it('should handle midnight correctly', async () => {
      const midnight = new Date(2023, 5, 15, 0, 0);
      wrapper = createWrapper({
        props: {
          modelValue: midnight,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('00:00');
    });

    it('should handle noon correctly', async () => {
      const noon = new Date(2023, 5, 15, 12, 0);
      wrapper = createWrapper({
        props: {
          modelValue: noon,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('12:00');
    });

    it('should handle end of day time correctly', async () => {
      const endOfDay = new Date(2023, 5, 15, 23, 59);
      wrapper = createWrapper({
        props: {
          modelValue: endOfDay,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('23:59');
    });

    it('should handle first day of year correctly', async () => {
      const firstDay = new Date(2023, 0, 1, 0, 0);
      wrapper = createWrapper({
        props: {
          modelValue: firstDay,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('01/01/2023');
      expect(input.element.value).toContain('00:00');
    });

    it('should handle very old dates (1970)', async () => {
      const oldDate = new Date(1970, 0, 1, 0, 0);
      wrapper = createWrapper({
        props: {
          modelValue: oldDate,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('01/01/1970');
    });

    it('should handle dates with all single digit values', async () => {
      const singleDigits = new Date(2023, 0, 1, 1, 1, 1);
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: singleDigits,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      // Should be zero-padded
      expect(input.element.value).toContain('01/01/2023');
      expect(input.element.value).toContain('01:01:01');
    });
  });

  describe('accuracy edge cases', () => {
    it('should correctly display seconds precision', async () => {
      const dateWithSeconds = new Date(2023, 5, 15, 14, 30, 45);
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: dateWithSeconds,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('14:30:45');
    });

    it('should correctly display milliseconds precision', async () => {
      const dateWithMs = new Date(2023, 5, 15, 14, 30, 45, 123);
      wrapper = createWrapper({
        props: {
          accuracy: 'millisecond',
          modelValue: dateWithMs,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toContain('14:30:45.123');
    });

    it('should emit seconds with second accuracy', async () => {
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: new Date(2022, 0, 1),
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();
      await wrapper.find('[data-id=activator]').trigger('click');
      await vi.runOnlyPendingTimersAsync();
      await wrapper.find('[data-id=set-now]').trigger('click');
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(lastEmittedValue.getSeconds()).toBe(fixedDate.getSeconds());
    });

    it('should emit milliseconds with millisecond accuracy', async () => {
      // Reset system time to ensure exact millisecond value
      vi.setSystemTime(fixedDate);

      wrapper = createWrapper({
        props: {
          accuracy: 'millisecond',
          modelValue: new Date(2022, 0, 1),
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();
      await wrapper.find('[data-id=activator]').trigger('click');
      await vi.runOnlyPendingTimersAsync();
      await wrapper.find('[data-id=set-now]').trigger('click');
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(lastEmittedValue.getSeconds()).toBe(fixedDate.getSeconds());
      expect(lastEmittedValue.getMilliseconds()).toBe(fixedDate.getMilliseconds());
    });
  });

  describe('keyboard navigation edge cases', () => {
    it('should prevent year from going below 1970', async () => {
      const date = dayjs('1970-01-01 00:00');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to year field (DD/MM/YYYY - need to go right twice)
      await inputField.trigger('keydown.ArrowRight');
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();

      // Try to decrement year below 1970
      await inputField.trigger('keydown.ArrowDown');
      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      // Year should still be 1970
      expect(input.element.value).toContain('1970');
    });

    it('should navigate through all segments correctly', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Should start at day segment (0-2)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);

      // Navigate right to month
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
      expect(inputElement.selectionStart).toBe(3);
      expect(inputElement.selectionEnd).toBe(5);

      // Navigate right to year
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
      expect(inputElement.selectionStart).toBe(6);
      expect(inputElement.selectionEnd).toBe(10);

      // Navigate right to hour
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
      expect(inputElement.selectionStart).toBe(11);
      expect(inputElement.selectionEnd).toBe(13);

      // Navigate right to minute
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();
      expect(inputElement.selectionStart).toBe(14);
      expect(inputElement.selectionEnd).toBe(16);

      // Navigate left back to hour
      await inputField.trigger('keydown.ArrowLeft');
      await vi.runOnlyPendingTimersAsync();
      expect(inputElement.selectionStart).toBe(11);
      expect(inputElement.selectionEnd).toBe(13);
    });

    it('should handle typing invalid high values for day', async () => {
      const date = dayjs('2023-02-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type 4 for day - should be accepted as first digit
      await inputField.trigger('keydown', { code: 'Digit4', key: '4' });
      await vi.runOnlyPendingTimersAsync();

      // Typing 4 moves to next segment since 40+ is invalid
      // So it should have set day to 4
      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      // Day should be 4 (single digit that auto-advances)
      expect(dayjs(lastEmittedValue).date()).toBe(4);
    });

    it('should handle typing values for hour segment', async () => {
      const date = dayjs('2023-06-15 09:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to hour field
      for (let i = 0; i < 3; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "1" then "5" for 15:00
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).hour()).toBe(15);
    });
  });

  describe('digit typing edge cases', () => {
    it('should allow typing "02" for month', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to month field (DD/MM/YYYY HH:mm - month is second segment)
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();

      // Type "0" then "2" for month 02
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).month()).toBe(1); // 0-indexed, so February = 1
    });

    it('should allow typing "01" for day', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type "0" then "1" for day 01
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).date()).toBe(1);
    });

    it('should handle typing "0101" for day and month (01/01)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type "0101" - should set day=01 and month=01
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();
      // After "01" for day, should auto-advance to month
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).date()).toBe(1);
      expect(dayjs(lastEmittedValue).month()).toBe(0); // January = 0
    });

    it('should handle typing "0909" for hour and minute (09:09)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to hour field (DD/MM/YYYY HH:mm)
      for (let i = 0; i < 3; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "0909" - should set hour=09 and minute=09
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit9', key: '9' });
      await vi.runOnlyPendingTimersAsync();
      // After "09" for hour, should auto-advance to minute
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit9', key: '9' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).hour()).toBe(9);
      expect(dayjs(lastEmittedValue).minute()).toBe(9);
    });

    it('should handle typing "12" for month', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to month field
      await inputField.trigger('keydown.ArrowRight');
      await vi.runOnlyPendingTimersAsync();

      // Type "12" for December
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).month()).toBe(11); // December = 11
    });

    it('should handle typing "31" for day', async () => {
      const date = dayjs('2023-01-15 14:30'); // January has 31 days
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type "31"
      await inputField.trigger('keydown', { code: 'Digit3', key: '3' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).date()).toBe(31);
    });

    it('should handle typing "00" for hour (midnight)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to hour field
      for (let i = 0; i < 3; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "00" for midnight
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).hour()).toBe(0);
    });

    it('should handle typing "23" for hour', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to hour field
      for (let i = 0; i < 3; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "23"
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit3', key: '3' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).hour()).toBe(23);
    });

    it('should handle typing "59" for minute', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to minute field
      for (let i = 0; i < 4; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "59"
      await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit9', key: '9' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).minute()).toBe(59);
    });

    it('should handle typing year digits "2024"', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to year field (DD/MM/YYYY)
      await inputField.trigger('keydown.ArrowRight'); // to MM
      await inputField.trigger('keydown.ArrowRight'); // to YYYY
      await vi.runOnlyPendingTimersAsync();

      // Type "2024"
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit4', key: '4' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).year()).toBe(2024);
    });

    it('should handle month-first format typing "0101" for month and day', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'month-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // In month-first format (MM/DD/YYYY), first segment is month
      // Type "0101" - should set month=01 and day=01
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();
      // After "01" for month, should auto-advance to day
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit1', key: '1' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).month()).toBe(0); // January = 0
      expect(dayjs(lastEmittedValue).date()).toBe(1);
    });

    it('should auto-advance after typing "3" for day (since 30+ limits to 31)', async () => {
      const date = dayjs('2023-01-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type "3" - since next digit would make it 30+ which limits options
      await inputField.trigger('keydown', { code: 'Digit3', key: '3' });
      await vi.runOnlyPendingTimersAsync();

      // After typing "3" for day, cursor should stay on day to allow "30" or "31"
      // Or auto-advance if "30" exceeds max possibility
      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();
    });

    it('should handle seconds with leading zero "05"', async () => {
      const date = dayjs('2023-06-15 14:30:45');
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to seconds field (DD/MM/YYYY HH:mm:ss)
      for (let i = 0; i < 5; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "05" for seconds
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).second()).toBe(5);
    });

    it('should handle milliseconds with leading zeros "005"', async () => {
      const date = dayjs('2023-06-15 14:30:45.123');
      wrapper = createWrapper({
        props: {
          accuracy: 'millisecond',
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Navigate to milliseconds field (DD/MM/YYYY HH:mm:ss.SSS)
      for (let i = 0; i < 6; i++) {
        await inputField.trigger('keydown.ArrowRight');
        await vi.runOnlyPendingTimersAsync();
      }

      // Type "005" for milliseconds
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit0', key: '0' });
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).millisecond()).toBe(5);
    });
  });

  describe('segment click selection', () => {
    it('should select day segment when clicking on day position (day-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Simulate clicking on position 1 (inside day segment "15" at positions 0-2)
      inputElement.selectionStart = 1;
      inputElement.selectionEnd = 1;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Day segment should be selected (0-2)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should select month segment when clicking on month position (day-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Simulate clicking on position 4 (inside month segment "06" at positions 3-5)
      inputElement.selectionStart = 4;
      inputElement.selectionEnd = 4;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Month segment should be selected (3-5)
      expect(inputElement.selectionStart).toBe(3);
      expect(inputElement.selectionEnd).toBe(5);
    });

    it('should select year segment when clicking on year position (day-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Simulate clicking on position 8 (inside year segment "2023" at positions 6-10)
      inputElement.selectionStart = 8;
      inputElement.selectionEnd = 8;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Year segment should be selected (6-10)
      expect(inputElement.selectionStart).toBe(6);
      expect(inputElement.selectionEnd).toBe(10);
    });

    it('should select hour segment when clicking on hour position (day-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Simulate clicking on position 12 (inside hour segment "14" at positions 11-13)
      inputElement.selectionStart = 12;
      inputElement.selectionEnd = 12;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Hour segment should be selected (11-13)
      expect(inputElement.selectionStart).toBe(11);
      expect(inputElement.selectionEnd).toBe(13);
    });

    it('should select minute segment when clicking on minute position (day-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Simulate clicking on position 15 (inside minute segment "30" at positions 14-16)
      inputElement.selectionStart = 15;
      inputElement.selectionEnd = 15;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Minute segment should be selected (14-16)
      expect(inputElement.selectionStart).toBe(14);
      expect(inputElement.selectionEnd).toBe(16);
    });

    it('should select month segment when clicking on month position (month-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'month-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // In month-first format (MM/DD/YYYY HH:mm), month is at positions 0-2
      inputElement.selectionStart = 1;
      inputElement.selectionEnd = 1;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Month segment should be selected (0-2)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should select day segment when clicking on day position (month-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'month-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // In month-first format (MM/DD/YYYY HH:mm), day is at positions 3-5
      inputElement.selectionStart = 4;
      inputElement.selectionEnd = 4;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Day segment should be selected (3-5)
      expect(inputElement.selectionStart).toBe(3);
      expect(inputElement.selectionEnd).toBe(5);
    });

    it('should select year segment when clicking on year position (year-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'year-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // In year-first format (YYYY/MM/DD HH:mm), year is at positions 0-4
      inputElement.selectionStart = 2;
      inputElement.selectionEnd = 2;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Year segment should be selected (0-4)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(4);
    });

    it('should select seconds segment when clicking on seconds position (with second accuracy)', async () => {
      const date = dayjs('2023-06-15 14:30:45');
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // In day-first format with seconds (DD/MM/YYYY HH:mm:ss), seconds is at positions 17-19
      inputElement.selectionStart = 18;
      inputElement.selectionEnd = 18;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Seconds segment should be selected (17-19)
      expect(inputElement.selectionStart).toBe(17);
      expect(inputElement.selectionEnd).toBe(19);
    });

    it('should select milliseconds segment when clicking on milliseconds position', async () => {
      const date = dayjs('2023-06-15 14:30:45.123');
      wrapper = createWrapper({
        props: {
          accuracy: 'millisecond',
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // In day-first format with milliseconds (DD/MM/YYYY HH:mm:ss.SSS), milliseconds is at positions 20-23
      inputElement.selectionStart = 21;
      inputElement.selectionEnd = 21;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Milliseconds segment should be selected (20-23)
      expect(inputElement.selectionStart).toBe(20);
      expect(inputElement.selectionEnd).toBe(23);
    });

    it('should select first segment on initial focus', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // First segment (day) should be selected (0-2)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should select first segment on initial focus (month-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'month-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // First segment (month) should be selected (0-2)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should select first segment on initial focus (year-first format)', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'year-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // First segment (year) should be selected (0-4)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(4);
    });

    it('should maintain segment selection after typing and clicking on another segment', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;

      // Focus and type in day segment
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();
      await inputField.trigger('keydown', { code: 'Digit2', key: '2' });
      await inputField.trigger('keydown', { code: 'Digit5', key: '5' });
      await vi.runOnlyPendingTimersAsync();

      // Now click on hour segment
      inputElement.selectionStart = 12;
      inputElement.selectionEnd = 12;
      await inputField.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Hour segment should be selected (11-13)
      expect(inputElement.selectionStart).toBe(11);
      expect(inputElement.selectionEnd).toBe(13);
    });
  });

  describe('paste functionality', () => {
    it('should update when input value changes (simulating paste)', async () => {
      const date = dayjs('2022-01-01 09:09');
      wrapper = createWrapper({
        props: {
          modelValue: date.toDate(),
          type: 'date',
          format: 'day-first',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Use setValue to simulate paste/input
      await inputField.setValue('25/12/2024 18:30');
      await vi.runOnlyPendingTimersAsync();

      const modelValue = wrapper.emitted('update:modelValue');
      expect(modelValue).toBeTruthy();

      const lastEmittedValue = modelValue?.at(-1)?.[0];
      assert(lastEmittedValue instanceof Date);
      expect(dayjs(lastEmittedValue).format('DD/MM/YYYY HH:mm')).toBe('25/12/2024 18:30');
    });
  });

  describe('date format variations', () => {
    it('should correctly parse and display month-first format', async () => {
      const testDate = new Date(2023, 11, 25, 14, 30); // Dec 25, 2023
      wrapper = createWrapper({
        props: {
          format: 'month-first',
          modelValue: testDate,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toBe('12/25/2023 14:30');
    });

    it('should correctly parse and display year-first format', async () => {
      const testDate = new Date(2023, 11, 25, 14, 30); // Dec 25, 2023
      wrapper = createWrapper({
        props: {
          format: 'year-first',
          modelValue: testDate,
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const input = wrapper.find('input');
      expect(input.element.value).toBe('2023/12/25 14:30');
    });

    it('should correctly navigate segments in month-first format', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          format: 'month-first',
          modelValue: date.toDate(),
          type: 'date',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // In month-first format, should start at month segment
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should correctly navigate segments in year-first format', async () => {
      const date = dayjs('2023-06-15 14:30');
      wrapper = createWrapper({
        props: {
          format: 'year-first',
          modelValue: date.toDate(),
          type: 'date',
        },
      });
      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      const inputElement = inputField.element as HTMLInputElement;
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // In year-first format, should start at year segment (4 characters)
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(4);
    });
  });

  describe('combined error messages', () => {
    it('should show prop error when both prop errors and validation errors exist', async () => {
      const minDate = new Date(2023, 0, 10);
      const propError = 'Custom error from prop';

      // Start with a valid date
      wrapper = createWrapper({
        props: {
          errorMessages: propError,
          minDate,
          modelValue: new Date(2023, 0, 15, 12, 30), // Valid date (after minDate)
          format: 'day-first',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      const inputField = wrapper.find('input');
      await inputField.trigger('focus');
      await vi.runOnlyPendingTimersAsync();

      // Type day "05" (before minDate of 10th) to trigger validation
      await inputField.trigger('keydown', { key: '0' });
      await inputField.trigger('keydown', { key: '5' });
      await vi.runOnlyPendingTimersAsync();

      // RuiFormTextDetail only displays the first error message
      // When both prop errors and validation errors exist, prop error is shown first
      const detailsText = wrapper.find('.details').text();
      expect(detailsText).toContain(propError);
    });

    it('should show first error message when array of errors is provided', async () => {
      const errors = ['Error 1', 'Error 2'];
      wrapper = createWrapper({
        props: {
          errorMessages: errors,
          modelValue: new Date(),
        },
      });

      await vi.runOnlyPendingTimersAsync();

      // RuiFormTextDetail only displays the first error message from the array
      const detailsText = wrapper.find('.details').text();
      expect(detailsText).toContain('Error 1');
    });
  });

  describe('menu interactions', () => {
    it('should open menu when clicking on activator', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(),
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      await wrapper.find('[data-id=activator]').trigger('click');
      await vi.runOnlyPendingTimersAsync();

      const menu = wrapper.find('[data-menu-disabled="false"]');
      expect(menu.exists()).toBeTruthy();
    });

    it('should close menu when clicking arrow icon while open', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: new Date(),
          type: 'date',
        },
      });

      await vi.runOnlyPendingTimersAsync();

      // Open menu
      await wrapper.find('[data-id=activator]').trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Verify menu is open using the menu-content role attribute
      expect(wrapper.find('[role="menu-content"]').exists()).toBe(true);

      // Click the arrow icon to close the menu
      const arrowWrapper = wrapper.find('[data-id=append]');
      assert(arrowWrapper.exists());
      await arrowWrapper.trigger('click');
      await vi.runOnlyPendingTimersAsync();

      // Menu should be closed - menu-content should not exist
      expect(wrapper.find('[role="menu-content"]').exists()).toBe(false);
    });
  });

  describe('hide details', () => {
    it('should hide details when hideDetails is true', async () => {
      wrapper = createWrapper({
        props: {
          hideDetails: true,
          hint: 'This hint should be hidden',
          modelValue: new Date(),
        },
      });

      await vi.runOnlyPendingTimersAsync();

      expect(wrapper.find('.details').exists()).toBeFalsy();
    });

    it('should show details when hideDetails is false', async () => {
      wrapper = createWrapper({
        props: {
          hideDetails: false,
          hint: 'This hint should be visible',
          modelValue: new Date(),
        },
      });

      await vi.runOnlyPendingTimersAsync();

      expect(wrapper.find('.details').exists()).toBeTruthy();
      expect(wrapper.text()).toContain('This hint should be visible');
    });
  });
});
