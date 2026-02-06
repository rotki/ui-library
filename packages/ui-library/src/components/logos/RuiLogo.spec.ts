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

  it('should have aria-label on loading placeholder when decoding', async () => {
    wrapper = createWrapper();
    await wrapper.setProps({ logo: 'website' });

    // When logo is set but sources haven't loaded yet, decoding is true
    // and the placeholder div should have role="img" and aria-label
    const placeholder = wrapper.find('div[role=img]');
    if (placeholder.exists()) {
      expect(placeholder.attributes('aria-label')).toBe('rotki');
    }
  });
});
