import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

function createWrapper(options?: ComponentMountingOptions<typeof RuiCalendar>) {
  return mount(RuiCalendar, {
    ...options,
  });
}

describe('calendar', () => {
  const date = new Date(2023, 0, 2);
  vi.setSystemTime(date);

  it ('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: new Date(2023, 0, 3),
      },
    });

    expect(wrapper.find('.rui-id-2023-01-02').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/is-today/)]),
    );

    expect(wrapper.find('.rui-id-2023-01-03').exists()).toBeTruthy();
  });

  it('min date', () => {
    const wrapper = createWrapper({
      props: {
        minDate: new Date(2023, 0, 3),
      },
    });

    expect(wrapper.find('.rui-id-2023-01-02').attributes('disabled')).toBe('');
    expect(wrapper.find('.rui-id-2023-01-03').attributes('disabled')).toBeUndefined();
  });

  it('max date', () => {
    const wrapper = createWrapper({
      props: {
        maxDate: new Date(2023, 0, 3),
      },
    });

    expect(wrapper.find('.rui-id-2023-01-03').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('.rui-id-2023-01-04').attributes('disabled')).toBe('');
  });
});
