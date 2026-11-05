import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiTimezoneSelect from '@/components/date-time-picker/RuiTimezoneSelect.vue';
import { timezones } from '@/components/date-time-picker/timezones';
import { createMounter, type MountedWrapper } from '~/tests/helpers/mount-component';

const createWrapper = createMounter(RuiTimezoneSelect, {
  global: {
    stubs: {
      Transition: false,
      TransitionGroup: false,
    },
  },
});

describe('components/date-time-picker/RuiTimezoneSelect.vue', () => {
  let wrapper: MountedWrapper<typeof RuiTimezoneSelect>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: undefined,
      },
    });

    expect(wrapper.find('div[data-id="activator"]').exists()).toBeTruthy();
  });

  it('should render the default Timezone label', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: undefined,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.text()).toContain('Timezone');
  });

  it('should accept a custom label', async () => {
    wrapper = createWrapper({
      props: {
        label: 'Pick a timezone',
        modelValue: undefined,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.text()).toContain('Pick a timezone');
  });

  it('should display the current selected timezone', async () => {
    const value = 'Europe/Madrid';
    wrapper = createWrapper({
      props: {
        modelValue: value,
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toBe(value);
  });

  it('should display the selected timezone with underscores replaced by spaces', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'America/New_York',
      },
    });

    await vi.runOnlyPendingTimersAsync();
    expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toBe('America/New York');
  });

  it('should expose the full timezones list as options', () => {
    expect(timezones.length).toBeGreaterThan(0);
    expect(timezones).toContain('Europe/Madrid');
    expect(timezones).toContain('UTC');
  });

  it('should render disabled when prop is set', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        modelValue: undefined,
      },
    });

    expect(wrapper.find('div[data-id=activator] input[role=combobox]').attributes('disabled')).toBeDefined();
  });
});
