import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '../../../tests/mocks/server';
import { clearLogoSourcesCache, getCachedLogoSources, getLogoSources, getVerifiedLogoUrl, setVerifiedLogoUrl } from './use-logo-sources';

describe('use-logo-sources', () => {
  afterEach(() => {
    server.resetHandlers();
    clearLogoSourcesCache();
  });

  it('should fetch and return external links for a branch', async () => {
    const result = await getLogoSources('develop');

    expect(result).toBeDefined();
    expect(result?.website).toBe('website-logo.svg');
    expect(result?.app).toBe('app-logo.svg');
    expect(result?.drawer).toBe('drawer-logo.svg');
    expect(result?.about).toBe('about-logo.svg');
    expect(result?.emptyScreen).toBe('empty-screen-logo.svg');
  });

  it('should deduplicate concurrent requests for the same branch', async () => {
    let fetchCount = 0;
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () => {
        fetchCount++;
        return HttpResponse.json({
          logo: {
            app: 'app.svg',
            website: 'web.svg',
          },
        });
      }),
    );

    // Fire 3 concurrent requests for the same branch
    const [result1, result2, result3] = await Promise.all([
      getLogoSources('main'),
      getLogoSources('main'),
      getLogoSources('main'),
    ]);

    expect(fetchCount).toBe(1);
    expect(result1).toStrictEqual(result2);
    expect(result2).toStrictEqual(result3);
    expect(result1?.app).toBe('app.svg');
  });

  it('should cache resolved values for subsequent calls', async () => {
    let fetchCount = 0;
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () => {
        fetchCount++;
        return HttpResponse.json({
          logo: { app: 'cached.svg' },
        });
      }),
    );

    const first = await getLogoSources('main');
    const second = await getLogoSources('main');

    expect(fetchCount).toBe(1);
    expect(first?.app).toBe('cached.svg');
    expect(second?.app).toBe('cached.svg');
  });

  it('should fetch separately for different branches', async () => {
    const requestedBranches: string[] = [];
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', ({ params }) => {
        const branch = params.branch as string;
        requestedBranches.push(branch);
        return HttpResponse.json({
          logo: { app: `${branch}-app.svg` },
        });
      }),
    );

    const [develop, main] = await Promise.all([
      getLogoSources('develop'),
      getLogoSources('main'),
    ]);

    expect(requestedBranches).toHaveLength(2);
    expect(requestedBranches).toContain('develop');
    expect(requestedBranches).toContain('main');
    expect(develop?.app).toBe('develop-app.svg');
    expect(main?.app).toBe('main-app.svg');
  });

  it('should return undefined on network error', async () => {
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () =>
        HttpResponse.error()),
    );

    const result = await getLogoSources('develop');

    expect(result).toBeUndefined();
  });

  it('should return undefined when response has no logo field', async () => {
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () =>
        HttpResponse.json({ other: 'data' })),
    );

    const result = await getLogoSources('develop');

    expect(result).toBeUndefined();
  });

  it('should return undefined when logo field contains non-string values', async () => {
    server.use(
      http.get('https://raw.githubusercontent.com/rotki/data/:branch/constants/asset-mappings.json', () =>
        HttpResponse.json({ logo: { app: 123, website: true } })),
    );

    const result = await getLogoSources('develop');

    expect(result).toBeUndefined();
  });

  it('should persist fetched sources to sessionStorage', async () => {
    await getLogoSources('develop');

    const cached = getCachedLogoSources('develop');
    expect(cached).toBeDefined();
    expect(cached?.website).toBe('website-logo.svg');
  });

  it('should return cached sources synchronously from sessionStorage', async () => {
    // First fetch populates sessionStorage
    await getLogoSources('develop');
    // Clear in-memory cache but keep sessionStorage
    clearLogoSourcesCache();

    // Re-populate sessionStorage for the test (clearLogoSourcesCache clears it too)
    sessionStorage.setItem('rui-logo-sources:develop', JSON.stringify({ website: 'cached.svg' }));

    const cached = getCachedLogoSources('develop');
    expect(cached).toBeDefined();
    expect(cached?.website).toBe('cached.svg');
  });

  it('should return undefined from getCachedLogoSources when nothing is cached', () => {
    const cached = getCachedLogoSources('nonexistent');
    expect(cached).toBeUndefined();
  });

  it('should store and retrieve verified logo URLs', () => {
    setVerifiedLogoUrl('develop', 'website', 'https://example.com/logo.svg');

    const url = getVerifiedLogoUrl('develop', 'website');
    expect(url).toBe('https://example.com/logo.svg');
  });

  it('should return undefined for unverified logo URLs', () => {
    const url = getVerifiedLogoUrl('develop', 'website');
    expect(url).toBeUndefined();
  });

  it('should clear sessionStorage entries on cache clear', async () => {
    await getLogoSources('develop');
    setVerifiedLogoUrl('develop', 'website', 'https://example.com/logo.svg');

    clearLogoSourcesCache();

    expect(getCachedLogoSources('develop')).toBeUndefined();
    expect(getVerifiedLogoUrl('develop', 'website')).toBeUndefined();
  });
});
