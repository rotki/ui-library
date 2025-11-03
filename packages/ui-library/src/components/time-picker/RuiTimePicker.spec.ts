import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { assert } from '@/utils/assert';
import RuiTimePicker from './RuiTimePicker.vue';

function createWrapper(
  options: ComponentMountingOptions<typeof RuiTimePicker>,
): VueWrapper<InstanceType<typeof RuiTimePicker>> {
  return mount(RuiTimePicker, { ...options });
}

describe('components/time-picker/RuiTimePicker.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiTimePicker>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(),
      },
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should select hour and minute and emit update:model-value event with correct date', async () => {
    const initialDate = new Date(2023, 0, 1, 10, 30, 0);

    const wrapper = mount(RuiTimePicker, {
      props: {
        'accuracy': TimeAccuracy.MINUTE,
        'modelValue': initialDate,
        'onUpdate:modelValue': (e?: Date) => wrapper.setProps({ modelValue: e }),
      },
    });

    const hourElement = wrapper.find('.rui-hour-03');
    expect(hourElement.exists()).toBe(true);
    await hourElement.trigger('click');

    // Update the clock numbers for minute mode
    const minuteElement = wrapper.find('.rui-minute-45');
    expect(minuteElement.exists()).toBe(true);
    await minuteElement?.trigger('click');

    const emittedEvents = wrapper.emitted('update:modelValue');
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents?.length).toBe(2);

    const emittedEvent1 = emittedEvents?.[1];
    assert(emittedEvent1);
    const finalEmittedDate = emittedEvent1[0] as Date;

    const expectedHour = initialDate.getHours() >= 12 ? 15 : 3;

    expect(finalEmittedDate.getHours()).toBe(expectedHour);
    expect(finalEmittedDate.getMinutes()).toBe(45);
    expect(finalEmittedDate.getSeconds()).toBe(0); // Since accuracy is MINUTE, seconds should be 0

    // Verify other parts of the date remain unchanged
    expect(finalEmittedDate.getFullYear()).toBe(initialDate.getFullYear());
    expect(finalEmittedDate.getMonth()).toBe(initialDate.getMonth());
    expect(finalEmittedDate.getDate()).toBe(initialDate.getDate());
  });

  it('should change mode when selecting AM/PM', async () => {
    const initialDate = new Date(2023, 0, 1, 10, 30, 0); // AM

    const wrapper = mount(RuiTimePicker, {
      props: {
        'accuracy': TimeAccuracy.MINUTE,
        'modelValue': initialDate,
        'onUpdate:modelValue': (e?: Date) => wrapper.setProps({ modelValue: e }),
      },
    });

    const amPmToggle = wrapper.find('.rui-time-picker-period');
    expect(amPmToggle.exists()).toBe(true);
    expect(amPmToggle.text()).toBe('AM');
    await amPmToggle.trigger('click');
    expect(amPmToggle.text()).toBe('PM');

    const emittedEvents = wrapper.emitted('update:modelValue');
    const emittedEvent0 = emittedEvents?.[0];
    assert(emittedEvent0);
    const updatedDate = emittedEvent0[0] as Date;

    expect(updatedDate.getHours()).toBe(22);
    expect(updatedDate.getMinutes()).toBe(30);
  });

  it('should select time up to milliseconds and emit correct values', async () => {
    const initialDate = new Date(2023, 0, 1, 10, 30, 0, 0);

    const wrapper = mount(RuiTimePicker, {
      props: {
        'accuracy': TimeAccuracy.MILLISECOND,
        'modelValue': initialDate,
        'onUpdate:modelValue': (e?: Date) => wrapper.setProps({ modelValue: e }),
      },
    });

    const hourSeven = wrapper.find('.rui-hour-07');
    await hourSeven.trigger('click');

    const minute25 = wrapper.find('.rui-minute-25');
    await minute25.trigger('click');

    const second45 = wrapper.find('.rui-second-45');
    await second45.trigger('click');

    const millisecond500 = wrapper.find('.rui-millisecond-500');
    await millisecond500.trigger('click');

    // Verify emitted events
    const emittedEvents = wrapper.emitted('update:modelValue');
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents?.length).toBe(4);

    const emittedEvent3 = emittedEvents?.[3];
    assert(emittedEvent3);
    const finalEmittedDate = emittedEvent3[0] as Date;

    const expectedHour = initialDate.getHours() >= 12 ? 19 : 7;

    expect(finalEmittedDate.getHours()).toBe(expectedHour);
    expect(finalEmittedDate.getMinutes()).toBe(25);
    expect(finalEmittedDate.getSeconds()).toBe(45);
    expect(finalEmittedDate.getMilliseconds()).toBe(500);

    expect(finalEmittedDate.getFullYear()).toBe(initialDate.getFullYear());
    expect(finalEmittedDate.getMonth()).toBe(initialDate.getMonth());
    expect(finalEmittedDate.getDate()).toBe(initialDate.getDate());
  });
});
