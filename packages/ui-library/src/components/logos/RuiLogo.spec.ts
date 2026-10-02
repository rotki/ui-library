import { type ComponentMountingOptions, flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import RuiLogo, { type Props } from '@/components/logos/RuiLogo.vue';
import { clearVerifiedLogoUrls, setVerifiedLogoUrl } from '@/components/logos/verified-logo';
import { type LogoResolver, LogoSymbol } from '@/composables/defaults/logo';

const SEASONAL_URL = 'https://example.com/logos/website-logo.svg';

function createWrapper(options?: ComponentMountingOptions<typeof RuiLogo>): VueWrapper<InstanceType<typeof RuiLogo>> {
  return mount(RuiLogo, { ...options });
}

function mountWithResolver(resolve: LogoResolver, props: Props): VueWrapper<InstanceType<typeof RuiLogo>> {
  return mount(RuiLogo, {
    props,
    global: { provide: { [LogoSymbol]: { resolve } } },
  });
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

describe('components/logos/RuiLogo.vue logo resolver', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiLogo>> | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    clearVerifiedLogoUrls();
    vi.restoreAllMocks();
  });

  it('should show only the bundled logo without a resolver', async () => {
    wrapper = createWrapper({ props: { logo: 'website' } });
    await flushPromises();

    expect(wrapper.find('img[data-image=custom]').exists()).toBeFalsy();
    expect(wrapper.find('img[data-image=fallback]').classes()).toContain('opacity-100');
  });

  it('should never make a network request of its own', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    wrapper = mountWithResolver(() => SEASONAL_URL, { logo: 'website' });
    await flushPromises();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should render the URL the resolver returns for the logo name', async () => {
    const resolve = vi.fn<LogoResolver>(async () => SEASONAL_URL);

    wrapper = mountWithResolver(resolve, { logo: 'website' });
    await flushPromises();

    expect(resolve).toHaveBeenCalledExactlyOnceWith('website');
    expect(wrapper.find('img[data-image=custom]').attributes('src')).toBe(SEASONAL_URL);
  });

  it('should append the unique key to the resolved URL', async () => {
    wrapper = mountWithResolver(() => SEASONAL_URL, { logo: 'website', uniqueKey: '10' });
    await flushPromises();
    expect(wrapper.find('img[data-image=custom]').attributes('src')).toBe(`${SEASONAL_URL}?key=10`);

    wrapper.unmount();
    wrapper = mountWithResolver(() => `${SEASONAL_URL}?v=2`, { logo: 'website', uniqueKey: '10' });
    await flushPromises();
    expect(wrapper.find('img[data-image=custom]').attributes('src')).toBe(`${SEASONAL_URL}?v=2&key=10`);
  });

  it('should keep the bundled logo when the resolver returns nothing', async () => {
    wrapper = mountWithResolver(() => undefined, { logo: 'website' });
    await flushPromises();

    expect(wrapper.find('img[data-image=custom]').exists()).toBeFalsy();
  });

  it('should keep the bundled logo when the resolver throws', async () => {
    wrapper = mountWithResolver(async () => {
      throw new Error('offline');
    }, { logo: 'website' });
    await flushPromises();

    expect(wrapper.find('img[data-image=custom]').exists()).toBeFalsy();
    expect(wrapper.find('img[data-image=fallback]').classes()).toContain('opacity-100');
  });

  it('should skip the resolver when src is provided', async () => {
    const resolve = vi.fn<LogoResolver>(() => SEASONAL_URL);

    wrapper = mountWithResolver(resolve, { logo: 'website', src: '/staging/logo.svg' });
    await flushPromises();

    expect(resolve).not.toHaveBeenCalled();
    expect(wrapper.find('img[data-image=custom]').attributes('src')).toBe('/staging/logo.svg');
  });

  it('should keep the newest logo when an older resolve finishes last', async () => {
    const pending = new Map<string, (url: string) => void>();
    const resolve: LogoResolver = name => new Promise((done) => {
      pending.set(name, done);
    });

    wrapper = mountWithResolver(resolve, { logo: 'app' });
    await flushPromises();
    await wrapper.setProps({ logo: 'website' });
    await flushPromises();

    pending.get('website')?.('https://example.com/website.svg');
    await flushPromises();
    pending.get('app')?.('https://example.com/app.svg');
    await flushPromises();

    expect(wrapper.find('img[data-image=custom]').attributes('src')).toBe('https://example.com/website.svg');
  });

  it('should show a URL that already decoded in this session straight away', async () => {
    setVerifiedLogoUrl('website', SEASONAL_URL);

    wrapper = mountWithResolver(() => SEASONAL_URL, { logo: 'website' });
    await flushPromises();

    expect(wrapper.find('img[data-image=custom]').classes()).toContain('opacity-100');
    expect(wrapper.find('img[data-image=fallback]').classes()).toContain('opacity-0');
  });
});

describe('components/logos/RuiLogo.vue hydration', () => {
  let container: HTMLElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
    clearVerifiedLogoUrls();
    vi.restoreAllMocks();
  });

  function createApp(props: Props, resolve: LogoResolver) {
    return createSSRApp({ render: () => h(RuiLogo, props) }).provide(LogoSymbol, { resolve });
  }

  it('should not call the resolver on the server', async () => {
    const resolve = vi.fn<LogoResolver>(() => SEASONAL_URL);

    const html = await renderToString(createApp({ logo: 'website' }, resolve));

    expect(resolve).not.toHaveBeenCalled();
    expect(html).not.toContain('data-image="custom"');
  });

  const noCache = (): void => {};
  const verifiedCache = (): void => setVerifiedLogoUrl('website', SEASONAL_URL);

  it.each<[string, Props, () => void]>([
    ['with an empty cache', { logo: 'website' }, noCache],
    ['with an already decoded logo', { logo: 'website' }, verifiedCache],
    ['with a src', { src: '/staging/logo.svg' }, noCache],
  ])('should hydrate without mismatches %s', async (_name, props, prepareVisitorCache) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const html = await renderToString(createApp(props, () => SEASONAL_URL));

    // The server has no sessionStorage, so the visitor's cache is set up only after rendering
    prepareVisitorCache();

    container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);

    createApp(props, () => SEASONAL_URL).mount(container);
    await flushPromises();

    const messages = [...warn.mock.calls, ...error.mock.calls].map(([message]) => String(message));
    expect(messages.filter(message => message.includes('Hydration'))).toEqual([]);
    expect(container.querySelector('img[data-image=custom]')).not.toBeNull();
  });
});
