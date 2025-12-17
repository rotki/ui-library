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
    expect(wrapper.find('[class*="_label_"]').text()).toBe('Pick a date');

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
    expect(wrapper.find('[class*="_label_"]').text()).toBe(customLabel);
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

    const icon = wrapper.find('svg');
    expect(icon.attributes('height')).toBe('16');
    expect(icon.attributes('width')).toBe('16');
  });

  it('should apply outlined variant correctly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    expect(wrapper.find('[class*="_outlined_"]').exists()).toBeTruthy();
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

    const vm = wrapper.vm as any;
    expect(vm.minDate).toEqual(minDate);
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

    const vm = wrapper.vm as any;
    expect(vm.maxDate).toEqual(maxDate);
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
    wrapper = createWrapper({
      props: {
        maxDate: 'now',
        modelValue: new Date(2023, 0, 25),
      },
    });

    await vi.runOnlyPendingTimersAsync();

    const vm = wrapper.vm as any;
    expect(vm.maxAllowedDate instanceof Date).toBeTruthy();

    // Since we're using fake timers, the "now" date should be the fixed date
    const expectedDate = new Date(fixedDate);
    expect(vm.maxAllowedDate.getFullYear()).toBe(expectedDate.getFullYear());
    expect(vm.maxAllowedDate.getMonth()).toBe(expectedDate.getMonth());
    expect(vm.maxAllowedDate.getDate()).toBe(expectedDate.getDate());
    expect(vm.maxAllowedDate.getHours()).toBe(expectedDate.getHours());
    expect(vm.maxAllowedDate.getMinutes()).toBe(expectedDate.getMinutes());
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

    const vm = wrapper.vm as any;
    const minAllowedDate = vm.minAllowedDate;
    expect(minAllowedDate instanceof Date).toBeTruthy();
    expect(minAllowedDate.getFullYear()).toBe(testDate.getFullYear());
    expect(minAllowedDate.getMonth()).toBe(testDate.getMonth());
    expect(minAllowedDate.getDate()).toBe(testDate.getDate());
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

    const vm = wrapper.vm as any;
    const maxAllowedDate = vm.maxAllowedDate;
    expect(maxAllowedDate instanceof Date).toBeTruthy();
    expect(maxAllowedDate.getFullYear()).toBe(testDate.getFullYear());
    expect(maxAllowedDate.getMonth()).toBe(testDate.getMonth());
    expect(maxAllowedDate.getDate()).toBe(testDate.getDate());
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

    const vm = wrapper.vm as any;
    const dateFormat = vm.dateFormat;

    await wrapper.find('input').setValue(date.format(dateFormat));
    await vi.runOnlyPendingTimersAsync();

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();

    const lastEmittedValue = modelValue?.at(-1)?.[0];
    assert(lastEmittedValue instanceof Date);

    expect(dayjs(lastEmittedValue).isSame(date)).toBeTruthy();
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
    expect(wrapper.find('[class*="_label_"]').text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.find('[class*="_label_"]').text()).toContain('﹡');
    expect(wrapper.find('[class*="_label_"] .text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.find('[class*="_label_"]').text()).not.toContain('﹡');
  });
});
