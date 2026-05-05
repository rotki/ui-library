import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiTimezoneSelect from '@/components/date-time-picker/RuiTimezoneSelect.vue';
import { timezones } from '@/components/date-time-picker/timezones';
import { cleanupElements } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiTimezoneSelect>,
) {
  return mount(RuiTimezoneSelect, {
    ...options,
    global: {
      stubs: {
        Transition: false,
        TransitionGroup: false,
      },
    },
  });
}

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  const now = Date.now();
  cb(now);
  return now;
});

describe('components/date-time-picker/RuiTimezoneSelect.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    cleanupElements('*', document.body);
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

    expect(wrapper.find('div[data-id=activator][tabindex="-1"]').exists()).toBeTruthy();
  });
});
