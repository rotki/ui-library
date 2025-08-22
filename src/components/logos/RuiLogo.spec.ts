import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiLogo from '@/components/logos/RuiLogo.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiLogo>) {
  return mount(RuiLogo, { ...options });
}

describe('forms/Logo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders properly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').find('img').exists()).toBeTruthy();
  });

  it('passes text props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ text: true });
    expect(wrapper.find('div').text()).toBe('rotki');
    await wrapper.setProps({ text: false });
    expect(wrapper.find('div').text()).toBe('');
  });

  it('passes logo props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ logo: 'website' });
    await vi.advanceTimersToNextTimerAsync();
    expect(wrapper.find('img[data-image=custom]').exists()).toBeTruthy();
    await wrapper.setProps({ uniqueKey: '10' });
    expect(wrapper.find('img[data-image=custom][src*="?key=10"]').exists()).toBeTruthy();
  });
});
