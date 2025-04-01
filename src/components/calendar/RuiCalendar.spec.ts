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

    expect(wrapper.find('.id-2023-01-02').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/is-today/)]),
    );

    expect(wrapper.find('.id-2023-01-03').find('.vc-highlight').exists()).toBeTruthy();
  });

  it('min date', () => {
    const wrapper = createWrapper({
      props: {
        minDate: new Date(2023, 0, 3),
      },
    });

    expect(wrapper.find('.id-2023-01-02').find('.vc-disabled').exists()).toBeTruthy();
    expect(wrapper.find('.id-2023-01-03').find('.vc-disabled').exists()).toBeFalsy();
  });

  it('max date', () => {
    const wrapper = createWrapper({
      props: {
        maxDate: new Date(2023, 0, 3),
      },
    });

    expect(wrapper.find('.id-2023-01-03').find('.vc-disabled').exists()).toBeFalsy();
    expect(wrapper.find('.id-2023-01-04').find('.vc-disabled').exists()).toBeTruthy();
  });
});
