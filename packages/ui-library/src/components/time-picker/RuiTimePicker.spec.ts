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

  it('should have role="group" and aria-label on root element', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 10, 30),
      },
    });

    const root = wrapper.find('[role="group"]');
    expect(root.exists()).toBe(true);
    expect(root.attributes('aria-label')).toBe('Time picker');
  });

  it('should have role="listbox" and aria-label on clock face', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 10, 30),
      },
    });

    const clockFace = wrapper.find('[role="listbox"]');
    expect(clockFace.exists()).toBe(true);
    expect(clockFace.attributes('aria-label')).toBe('Select hour');
  });

  it('should have role="option" and aria-selected on clock numbers', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 3, 30),
      },
    });

    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);

    // Hour 3 AM → displayHour 3, should be selected
    const selected = wrapper.find('[role="option"][aria-selected="true"]');
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toBe('3');
  });

  it('should have aria-label on digit selectors and AM/PM toggle', () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 10, 30),
      },
    });

    const buttons = wrapper.findAll('[role="button"]');
    const labels = buttons.map(b => b.attributes('aria-label'));

    expect(labels).toContain('Select hours');
    expect(labels).toContain('Select minutes');
    expect(labels).toContain('Toggle AM/PM');
  });

  it('should display midnight hour as 12', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 0, 0),
      },
    });

    await nextTick();

    // Hour 0 (midnight) → displayHour should be 12
    const selected = wrapper.find('[role="option"][aria-selected="true"]');
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toBe('12');

    // Period should be AM
    expect(wrapper.find('.rui-time-picker-period').text()).toBe('AM');
  });

  it('should display noon hour as 12 PM', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 12, 0),
      },
    });

    await nextTick();

    const selected = wrapper.find('[role="option"][aria-selected="true"]');
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toBe('12');

    expect(wrapper.find('.rui-time-picker-period').text()).toBe('PM');
  });

  it('should update clock face aria-label when mode changes', async () => {
    const wrapper = mount(RuiTimePicker, {
      props: {
        'accuracy': TimeAccuracy.SECOND,
        'modelValue': new Date(2023, 0, 1, 10, 30),
        'onUpdate:modelValue': (e?: Date) => wrapper.setProps({ modelValue: e }),
      },
    });

    const clockFace = wrapper.find('[role="listbox"]');
    expect(clockFace.attributes('aria-label')).toBe('Select hour');

    // Click hour to switch to minute mode
    await wrapper.find('.rui-hour-03').trigger('click');
    expect(clockFace.attributes('aria-label')).toBe('Select minute');

    // Click minute to switch to second mode
    await wrapper.find('.rui-minute-15').trigger('click');
    expect(clockFace.attributes('aria-label')).toBe('Select second');

    wrapper.unmount();
  });

  it('should apply bordered class by default and remove with borderless prop', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 1, 10, 30),
      },
    });

    // Default: bordered
    const root = wrapper.find('[role="group"]');
    expect(root.classes().some(c => /bordered/.test(c))).toBe(true);

    await wrapper.setProps({ borderless: true });
    expect(root.classes().some(c => /bordered/.test(c))).toBe(false);
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
