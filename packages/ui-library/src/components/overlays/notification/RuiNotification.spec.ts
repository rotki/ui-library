import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiNotification from '@/components/overlays/notification/RuiNotification.vue';
import { assertExists, queryBody } from '~/tests/helpers/dom-helpers';
import { createMounter, type MountedWrapper } from '~/tests/helpers/mount-component';

const createWrapper = createMounter(RuiNotification, {
  slots: {
    default: `<div id="content">Notification</div>`,
  },
});

describe('components/overlays/notification/RuiNotification.vue', () => {
  let wrapper: MountedWrapper<typeof RuiNotification>;

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render properly', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = queryBody<HTMLDivElement>('#content');
    expect(notification).toBeTruthy();
  });

  it('should not render if value is false', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: false,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = queryBody<HTMLDivElement>('#content');
    expect(notification).toBeFalsy();
  });

  it('should close on click', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = queryBody<HTMLDivElement>('#content');
    assertExists(notification);
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toHaveProperty('update:modelValue', [[false]]);
  });

  it('should not close on click if timeout is negative', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: -1,
      },
    });

    await nextTick();
    const notification = queryBody<HTMLDivElement>('#content');
    assertExists(notification);
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toEqual({});
  });

  it('should have role="alert" and aria-live="polite"', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = queryBody<HTMLDivElement>('[role="alert"]');
    assertExists(notification);
    expect(notification.getAttribute('aria-live')).toBe('polite');
  });

  it('should close automatically after timeout', async () => {
    vi.useFakeTimers();
    wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 5000,
      },
    });

    await nextTick();
    vi.advanceTimersByTime(3000);
    const notification = queryBody<HTMLDivElement>('#content');
    expect(notification).toBeTruthy();
    expect(wrapper.emitted()).toEqual({});
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted()).toHaveProperty('update:modelValue', [[false]]);
  });
});
