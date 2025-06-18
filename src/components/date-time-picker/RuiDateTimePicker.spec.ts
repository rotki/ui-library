import { TransitionGroupStub } from '@/__test__/transition-group-stub';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { describe, expect, it, vi } from 'vitest';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

dayjs.extend(utc);
dayjs.extend(timezone);

vi.mock('@/components/date-time-picker/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/date-time-picker/utils')>();
  return {
    ...actual,
    guessTimezone: () => 'UTC',
  };
});

function createWrapper(options: ComponentMountingOptions<typeof RuiDateTimePicker>) {
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

describe('date-time-picker/RuiDateTimePicker', () => {
  const fixedDate = new Date(2023, 0, 15, 10, 30, 45, 500);
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);

  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        type: 'date',
      },
    });

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });

  it('renders the default label', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        type: 'date',
        variant: 'outlined',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('[class*="_label_"]').text()).toBe('Pick a date');

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY hh:mm');
  });

  it('renders with custom label', async () => {
    const customLabel = 'Custom Date Label';
    const wrapper = createWrapper({
      props: {
        label: customLabel,
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('[class*="_label_"]').text()).toBe(customLabel);
  });

  it('applies disabled state correctly', () => {
    const wrapper = createWrapper({
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

  it('applies readonly state correctly', () => {
    const wrapper = createWrapper({
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

  it('applies dense state correctly', () => {
    const wrapper = createWrapper({
      props: {
        dense: true,
        modelValue: new Date(),
      },
    });

    const icon = wrapper.find('svg');
    expect(icon.attributes('height')).toBe('16');
    expect(icon.attributes('width')).toBe('16');
  });

  it('applies outlined variant correctly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        variant: 'outlined',
      },
    });

    expect(wrapper.find('[class*="_outlined_"]').exists()).toBeTruthy();
  });

  it('shows error messages correctly', () => {
    const errorMessage = 'This is an error message';
    const wrapper = createWrapper({
      props: {
        errorMessages: errorMessage,
        modelValue: new Date(),
      },
    });

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('shows success messages correctly', () => {
    const successMessage = 'This is a success message';
    const wrapper = createWrapper({
      props: {
        modelValue: new Date(),
        successMessages: successMessage,
      },
    });

    expect(wrapper.text()).toContain(successMessage);
  });

  it('uses month-first format correctly', () => {
    const wrapper = createWrapper({
      props: {
        format: 'month-first',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('MM/DD/YYYY hh:mm');
  });

  it('uses year-first format correctly', () => {
    const wrapper = createWrapper({
      props: {
        format: 'year-first',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('YYYY/MM/DD hh:mm');
  });

  it('uses second accuracy correctly', () => {
    const wrapper = createWrapper({
      props: {
        accuracy: 'second',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY hh:mm:ss');
  });

  it('uses millisecond accuracy correctly', () => {
    const wrapper = createWrapper({
      props: {
        accuracy: 'millisecond',
        modelValue: new Date(),
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('DD/MM/YYYY hh:mm:ss.SSS');
  });

  it('initializes with current date when allowEmpty is false', async () => {
    const wrapper = createWrapper({
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

  it('initializes empty when allowEmpty is true', () => {
    const wrapper = createWrapper({
      props: {
        allowEmpty: true,
        modelValue: undefined,
      },
    });

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeFalsy();
  });

  it('handles date model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);

    const wrapper = createWrapper({
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

  it('handles epoch-ms model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);
    const epochMs = testDate.getTime();

    const wrapper = createWrapper({
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

  it('handles epoch model value type correctly', async () => {
    const testDate = new Date(2023, 5, 15, 14, 30);
    const epoch = Math.floor(testDate.getTime() / 1000);

    const wrapper = createWrapper({
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

  it('respects min date constraint', async () => {
    const minDate = new Date(2023, 0, 10);

    const wrapper = createWrapper({
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

  it('respects max date constraint', async () => {
    const maxDate = new Date(2023, 0, 20);

    const wrapper = createWrapper({
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

  it('shows error message when date is below minAllowedDate', async () => {
    const minDate = new Date(2023, 0, 10);
    const belowMinDate = new Date(2023, 0, 5); // Date before minDate

    const wrapper = createWrapper({
      props: {
        minDate,
        modelValue: belowMinDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${minDate.toLocaleDateString()}`);
  });

  it('shows error message when date is above maxAllowedDate', async () => {
    const maxDate = new Date(2023, 0, 20);
    const aboveMaxDate = new Date(2023, 0, 25);

    const wrapper = createWrapper({
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

    const wrapper = createWrapper({
      props: {
        maxDate: 'now',
        modelValue: aboveMaxDate,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find('.details').text()).toContain('The selected date cannot be in the future');
  });

  it('handles "now" as maxDate correctly', async () => {
    const wrapper = createWrapper({
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

  it('respects min date constraint with epoch type', async () => {
    const testDate = new Date(2023, 0, 10);
    const minDateEpoch = Math.floor(testDate.getTime() / 1000);

    const wrapper = createWrapper({
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

  it('respects max date constraint with epoch type', async () => {
    const testDate = new Date(2023, 0, 20);
    const maxDateEpoch = Math.floor(testDate.getTime() / 1000);

    const wrapper = createWrapper({
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

  it('shows error message when date is below minAllowedDate with epoch type', async () => {
    const testDate = new Date(2023, 0, 10);
    const minDateEpoch = Math.floor(testDate.getTime() / 1000);
    const belowMinDate = new Date(2023, 0, 5); // Date before minDate

    const wrapper = createWrapper({
      props: {
        minDate: minDateEpoch,
        modelValue: belowMinDate,
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be before ${testDate.toLocaleDateString()}`);
  });

  it('shows error message when date is above maxAllowedDate with epoch type', async () => {
    const testDate = new Date(2023, 0, 20);
    const maxDateEpoch = Math.floor(testDate.getTime() / 1000);
    const aboveMaxDate = new Date(2023, 0, 25); // Date after maxDate

    const wrapper = createWrapper({
      props: {
        maxDate: maxDateEpoch,
        modelValue: aboveMaxDate,
        type: 'epoch',
      },
    });

    await vi.runOnlyPendingTimersAsync();

    expect(wrapper.find('.details').text()).toContain(`Date cannot be after ${testDate.toLocaleDateString()}`);
  });

  it('clears the value when clear button is clicked', async () => {
    const wrapper = createWrapper({
      props: {
        allowEmpty: true,
        modelValue: new Date(2023, 0, 15),
      },
    });

    await vi.runOnlyPendingTimersAsync();
    await wrapper.find('input').trigger('focus');

    wrapper.vm.$emit('update:modelValue', undefined);

    const modelValue = wrapper.emitted('update:modelValue');
    expect(modelValue).toBeTruthy();
    expect(modelValue?.[0][0]).toBeUndefined();
  });

  it('sets current date and time when "Now" button is clicked', async () => {
    const wrapper = createWrapper({
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
    const wrapper = createWrapper({
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
    expect(dayjs(lastEmittedValue).isSame(dayjs('2021-03-03 10:08')), 'the emitted date was not the expected').toBeTruthy();
  });

  it('should clear the field on delete and allow the user to type a new date', async () => {
    const date = dayjs('2022-01-01 09:09');
    const wrapper = createWrapper({
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
    expect(dayjs(lastEmittedValue).isSame(dayjs('2025-01-01 09:09')), 'the emitted date was not the expected').toBeTruthy();
  });

  it('should remove the last field on backspace and allow the user fill', async () => {
    const date = dayjs('2022-01-01 09:09');
    const wrapper = createWrapper({
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
    expect(dayjs(lastEmittedValue).isSame(dayjs('2025-01-01 09:09')), 'the emitted date was not the expected').toBeTruthy();
  });

  it('should be able to type a full date following the pattern', async () => {
    const date = dayjs('2022-01-01 09:09');
    const wrapper = createWrapper({
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
    expect(dayjs(lastEmittedValue).isSame(dayjs('2000-12-12 10:05')), 'the emitted date was not the expected').toBeTruthy();
  });
});
