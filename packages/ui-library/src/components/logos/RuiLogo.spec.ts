import { type ComponentMountingOptions, flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import RuiLogo, { type Props } from '@/components/logos/RuiLogo.vue';
import { clearLogoSourcesCache, getLogoSources, setVerifiedLogoUrl } from '@/components/logos/use-logo-sources';

const SEASONAL_URL = 'https://raw.githubusercontent.com/rotki/data/develop/assets/icons/website-logo.svg';

/** Caches the mocked asset mappings and marks the seasonal logo as decoded, as an earlier page load would. */
async function cacheSeasonalLogo(): Promise<void> {
  await getLogoSources('develop');
  setVerifiedLogoUrl('develop', 'website', SEASONAL_URL);
}

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

  it('should hide fallback when src is provided', () => {
    wrapper = createWrapper({
      props: {
        src: '/staging/logo.svg',
      },
    });

    const fallbackImg = wrapper.find('img[data-image=fallback]');
    expect(fallbackImg.exists()).toBeTruthy();
    expect(fallbackImg.classes()).toContain('opacity-0');
    expect(wrapper.find('img[data-image=custom]').exists()).toBeTruthy();
  });
});

describe('components/logos/RuiLogo.vue cached seasonal logo', () => {
  let container: HTMLElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
    clearLogoSourcesCache();
    vi.restoreAllMocks();
  });

  it('should show the cached seasonal logo after mount', async () => {
    await cacheSeasonalLogo();

    const wrapper = mount(RuiLogo, { props: { logo: 'website' } });
    await nextTick();

    const custom = wrapper.find('img[data-image=custom]');
    expect(custom.attributes('src')).toBe(SEASONAL_URL);
    expect(custom.classes()).toContain('opacity-100');
    expect(wrapper.find('img[data-image=fallback]').classes()).toContain('opacity-0');
    wrapper.unmount();
  });

  const emptyCache = async (): Promise<void> => {};

  it.each<[string, Props, () => Promise<void>]>([
    ['with an empty cache', { logo: 'website' }, emptyCache],
    ['with a cached seasonal logo', { logo: 'website' }, cacheSeasonalLogo],
    ['with a src', { src: '/staging/logo.svg' }, emptyCache],
  ])('should hydrate without mismatches %s', async (_name, props, prepareVisitorCache) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const html = await renderToString(createSSRApp({ render: () => h(RuiLogo, props) }));

    // The server has no sessionStorage, so the visitor's cache is set up only after rendering
    clearLogoSourcesCache();
    await prepareVisitorCache();

    container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);

    createSSRApp({ render: () => h(RuiLogo, props) }).mount(container);
    await flushPromises();

    const messages = [...warn.mock.calls, ...error.mock.calls].map(([message]) => String(message));
    expect(messages.filter(message => message.includes('Hydration'))).toEqual([]);
  });
});
