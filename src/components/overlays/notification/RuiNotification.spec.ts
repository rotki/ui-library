import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RuiNotification from '@/components/overlays/notification/RuiNotification.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiNotification>) {
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

describe('notification', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    wrapper.unmount();
  });

  it('does not render if value is false', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: false,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeFalsy();
    wrapper.unmount();
  });

  it('closes on click', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: 0,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toHaveProperty('update:model-value', [[false]]);
    wrapper.unmount();
  });

  it('does not close on click if timeout is negative', async () => {
    const wrapper = createWrapper({
      props: {
        modelValue: true,
        timeout: -1,
      },
    });

    await nextTick();
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    notification.click();
    await nextTick();
    expect(wrapper.emitted()).toEqual({});
    wrapper.unmount();
  });

  it('closes automatically after timeout', async () => {
    vi.useFakeTimers();
    const wrapper = createWrapper({
      propsData: {
        modelValue: true,
        timeout: 5000,
      },
    });

    await nextTick();
    vi.advanceTimersByTime(3000);
    const notification = document.body.querySelector('#content') as HTMLDivElement;
    expect(notification).toBeTruthy();
    expect(wrapper.emitted()).toEqual({});
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted()).toHaveProperty('update:model-value', [[false]]);
    wrapper.unmount();
    vi.useRealTimers();
  });
});
