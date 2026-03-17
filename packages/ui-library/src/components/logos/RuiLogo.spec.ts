import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RuiLogo from '@/components/logos/RuiLogo.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiLogo>): VueWrapper<InstanceType<typeof RuiLogo>> {
  return mount(RuiLogo, { ...options });
}

describe('components/logos/RuiLogo.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiLogo>>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();

    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render properly', () => {
    wrapper = createWrapper();
    expect(wrapper.find('div').find('img').exists()).toBeTruthy();
  });

  it('should show fallback immediately', () => {
    wrapper = createWrapper();
    const fallback = wrapper.find('img[data-image=fallback]');
    expect(fallback.exists()).toBeTruthy();
  });

  it('should pass text props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ text: true });
    expect(wrapper.find('div').text()).toBe('rotki');
    await wrapper.setProps({ text: false });
    expect(wrapper.find('div').text()).toBe('');
  });

  it('should pass logo props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('div').text()).toBe('');
    await wrapper.setProps({ logo: 'website' });
    await vi.advanceTimersToNextTimerAsync();
    expect(wrapper.find('img[data-image=custom]').exists()).toBeTruthy();
    await wrapper.setProps({ uniqueKey: '10' });
    expect(wrapper.find('img[data-image=custom][src*="?key=10"]').exists()).toBeTruthy();
  });

  it('should show fallback while logo prop is loading', async () => {
    wrapper = createWrapper({ props: { logo: 'website' } });

    // Fallback should be visible immediately while custom image loads
    const fallback = wrapper.find('img[data-image=fallback]');
    expect(fallback.exists()).toBeTruthy();
  });

  it('should render fallback image with alt text', () => {
    wrapper = createWrapper();
    const img = wrapper.find('img[data-image=fallback]');

    expect(img.exists()).toBeTruthy();
    expect(img.attributes('alt')).toBe('rotki');
  });

  it('should set height based on size prop', () => {
    wrapper = createWrapper({
      props: {
        size: 5,
      },
    });

    expect(wrapper.find('div').attributes('style')).toContain('height: 5rem');
  });

  it('should use default size of 3rem', () => {
    wrapper = createWrapper();

    expect(wrapper.find('div').attributes('style')).toContain('height: 3rem');
  });

  it('should render custom image directly when src prop is provided', () => {
    wrapper = createWrapper({
      props: {
        src: '/staging/logo.svg',
      },
    });

    const img = wrapper.find('img[data-image=custom]');
    expect(img.exists()).toBeTruthy();
    expect(img.attributes('src')).toBe('/staging/logo.svg');
  });

  it('should not show fallback when src is provided', () => {
    wrapper = createWrapper({
      props: {
        src: '/staging/logo.svg',
      },
    });

    expect(wrapper.find('img[data-image=fallback]').exists()).toBeFalsy();
    expect(wrapper.find('img[data-image=custom]').exists()).toBeTruthy();
  });
});
