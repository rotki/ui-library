import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiNotification from '@/components/overlays/notification/RuiNotification.vue';
import { assertExists, cleanupElements, queryBody } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiNotification>,
): VueWrapper<InstanceType<typeof RuiNotification>> {
  return mount(RuiNotification, {
    ...options,
    slots: {
      default: `<div id="content">Notification</div>`,
    },
    stubs: {
      Transition: true,
    },
  });
}

describe('components/overlays/notification/RuiNotification.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiNotification>>;

  afterEach(() => {
    wrapper?.unmount();
    cleanupElements('*', document.body);
    vi.restoreAllMocks();
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
    expect(wrapper.emitted()).toHaveProperty('update:model-value', [[false]]);
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
    expect(wrapper.emitted()).toHaveProperty('update:model-value', [[false]]);
  });
});
