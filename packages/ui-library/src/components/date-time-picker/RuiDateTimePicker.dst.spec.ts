import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TransitionGroupStub } from '@/__test__/transition-group-stub';
import { assert } from '@/utils/assert';
import RuiDateTimePicker from './RuiDateTimePicker.vue';

dayjs.extend(utc);
dayjs.extend(timezone);

// The rest of the picker specs run in UTC, which never changes offset. Berlin is
// +01:00 in January and +02:00 in July, so it is the only place these can fail.
const DST_TIMEZONE = 'Europe/Berlin';

vi.mock('@/components/date-time-picker/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/date-time-picker/utils')>();
  return {
    ...actual,
    guessTimezone: () => DST_TIMEZONE,
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

describe('components/date-time-picker/RuiDateTimePicker.vue — DST', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiDateTimePicker>>;

  vi.useFakeTimers();
  vi.setSystemTime(new Date(2023, 0, 15, 10, 30));

  afterEach(() => {
    wrapper?.unmount();
  });

  async function pickDate(target: Date): Promise<void> {
    await vi.runOnlyPendingTimersAsync();

    // clicking the activator toggles, so an already open menu is left alone
    if (!wrapper.findComponent({ name: 'RuiCalendar' }).exists()) {
      await wrapper.find('[data-id="activator"]').trigger('click');
      await vi.runOnlyPendingTimersAsync();
    }

    const calendar = wrapper.findComponent({ name: 'RuiCalendar' });
    assert(calendar.exists());
    calendar.vm.$emit('update:modelValue', target);
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }

  function lastEmittedDate(): dayjs.Dayjs {
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0];
    assert(value instanceof Date);
    return dayjs(value).tz(DST_TIMEZONE);
  }

  it('keeps the time when the date moves from standard time into DST', async () => {
    // 02/01/2023 20:20 is +01:00, 15/07/2023 is +02:00
    wrapper = createWrapper({
      props: {
        modelValue: dayjs.tz('2023-01-02T20:20:00', DST_TIMEZONE).toDate(),
        type: 'date',
      },
    });

    await pickDate(new Date(2023, 6, 15));

    const emitted = lastEmittedDate();
    expect(emitted.format('DD/MM/YYYY HH:mm')).toBe('15/07/2023 20:20');
  });

  it('keeps the time when the date moves from DST back into standard time', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: dayjs.tz('2023-07-15T08:05:00', DST_TIMEZONE).toDate(),
        type: 'date',
      },
    });

    await pickDate(new Date(2023, 0, 2));

    const emitted = lastEmittedDate();
    expect(emitted.format('DD/MM/YYYY HH:mm')).toBe('02/01/2023 08:05');
  });

  it('keeps the time across a DST boundary for an epoch value', async () => {
    wrapper = createWrapper({
      props: {
        accuracy: 'second',
        modelValue: dayjs.tz('2023-01-02T20:20:30', DST_TIMEZONE).unix(),
        type: 'epoch',
      },
    });

    await pickDate(new Date(2023, 6, 15));

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0];
    assert(typeof value === 'number');
    expect(dayjs.unix(value).tz(DST_TIMEZONE).format('DD/MM/YYYY HH:mm:ss')).toBe('15/07/2023 20:20:30');
  });

  describe('transition days', () => {
    // Berlin springs forward on 2023-03-26 (02:00 -> 03:00, so 02:30 never
    // happens) and falls back on 2023-10-29 (03:00 -> 02:00, so 02:30 happens
    // twice). Neither can be represented as a plain wall clock, so the contract
    // is that the value stays valid and round trips, not that it is preserved
    // literally.
    it('normalises a time that the spring forward skips', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: dayjs.tz('2023-03-20T02:30:00', DST_TIMEZONE).toDate(),
          type: 'date',
        },
      });

      await pickDate(new Date(2023, 2, 26));

      const emitted = lastEmittedDate();
      // 02:30 does not exist, so it lands on the other side of the jump
      expect(emitted.format('DD/MM/YYYY HH:mm')).toBe('26/03/2023 03:30');
      expect(emitted.utcOffset()).toBe(120);
      // and what the field shows agrees with what the model holds
      expect(wrapper.find('input').element.value).toBe('26/03/2023 03:30');
    });

    it('keeps a time the spring forward does not touch', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: dayjs.tz('2023-03-20T01:30:00', DST_TIMEZONE).toDate(),
          type: 'date',
        },
      });

      await pickDate(new Date(2023, 2, 26));

      const emitted = lastEmittedDate();
      expect(emitted.format('DD/MM/YYYY HH:mm')).toBe('26/03/2023 01:30');
      expect(emitted.utcOffset()).toBe(60);
    });

    it('resolves the repeated hour of the fall back to a real instant', async () => {
      wrapper = createWrapper({
        props: {
          modelValue: dayjs.tz('2023-10-23T02:30:00', DST_TIMEZONE).toDate(),
          type: 'date',
        },
      });

      await pickDate(new Date(2023, 9, 29));

      const emitted = lastEmittedDate();
      expect(emitted.format('DD/MM/YYYY HH:mm')).toBe('29/10/2023 02:30');
      expect(wrapper.find('input').element.value).toBe('29/10/2023 02:30');
      // 02:30 happens twice; either instant is correct, but it has to be one of
      // them. Which one gets picked depends on the host timezone, so the offset
      // is not pinned here — the e2e covers that in a real Berlin browser.
      expect([60, 120]).toContain(emitted.utcOffset());
      expect(['2023-10-29T00:30:00.000Z', '2023-10-29T01:30:00.000Z'])
        .toContain(emitted.toISOString());
    });

    it('round trips an epoch through the fall back without drifting', async () => {
      wrapper = createWrapper({
        props: {
          accuracy: 'second',
          modelValue: dayjs.tz('2023-10-23T02:30:00', DST_TIMEZONE).unix(),
          type: 'epoch',
        },
      });

      await pickDate(new Date(2023, 9, 29));

      const first = wrapper.emitted('update:modelValue')?.at(-1)?.[0];
      assert(typeof first === 'number');

      // picking the same day again must not move the value
      await pickDate(new Date(2023, 9, 29));
      const second = wrapper.emitted('update:modelValue')?.at(-1)?.[0];

      expect(second).toBe(first);
      expect(dayjs.unix(first).tz(DST_TIMEZONE).format('DD/MM/YYYY HH:mm')).toBe('29/10/2023 02:30');
    });
  });
});
