import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { isRouteLocation, useTabRouting } from '@/components/tabs/tabs/use-tab-routing';

vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockImplementation(() => reactive({ fullPath: '/current' })),
  useRouter: vi.fn().mockImplementation(() => ({
    resolve: vi.fn((to: unknown) => ({ fullPath: typeof to === 'string' ? to : '/resolved' })),
  })),
}));

interface SetupResult {
  resolveRoute: ReturnType<typeof useTabRouting>['resolveRoute'];
  isPathMatch: ReturnType<typeof useTabRouting>['isPathMatch'];
  hasRouter: boolean;
}

function mountWithRouting(): SetupResult {
  let result!: SetupResult;

  const Wrapper = defineComponent({
    setup() {
      const { resolveRoute, isPathMatch, hasRouter } = useTabRouting({ onRouteChange: vi.fn() });
      result = { resolveRoute, isPathMatch, hasRouter };
      return {};
    },
    render: () => null,
  });

  const wrapper = mount(Wrapper, {
    global: {
      plugins: [{
        install(app) {
          // Minimal stub — composable only checks `$router !== undefined`
          Object.defineProperty(app.config.globalProperties, '$router', { value: true });
        },
      }],
    },
  });
  wrapper.unmount();

  return result;
}

describe('use-tab-routing', () => {
  describe('isRouteLocation', () => {
    it('should return true for string values', () => {
      expect(isRouteLocation('/path')).toBe(true);
      expect(isRouteLocation('')).toBe(true);
    });

    it('should return true for object values', () => {
      expect(isRouteLocation({ path: '/foo' })).toBe(true);
      expect(isRouteLocation({ name: 'route' })).toBe(true);
      expect(isRouteLocation({})).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isRouteLocation(null)).toBe(false);
      expect(isRouteLocation(undefined)).toBe(false);
    });

    it('should return false for non-route primitives', () => {
      expect(isRouteLocation(42)).toBe(false);
      expect(isRouteLocation(true)).toBe(false);
    });
  });

  describe('composable with router', () => {
    let result: SetupResult;

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should detect router availability', () => {
      result = mountWithRouting();
      expect(result.hasRouter).toBe(true);
    });

    it('should resolve string routes', () => {
      result = mountWithRouting();
      expect(result.resolveRoute('/some-path')).toBe('/some-path');
    });

    it('should resolve object routes', () => {
      result = mountWithRouting();
      expect(result.resolveRoute({ path: '/obj' })).toBe('/resolved');
    });

    it('should return undefined for invalid route values', () => {
      result = mountWithRouting();
      expect(result.resolveRoute(null)).toBeUndefined();
      expect(result.resolveRoute(undefined)).toBeUndefined();
      expect(result.resolveRoute(42)).toBeUndefined();
    });

    it('should match exact path with exactPath option', () => {
      result = mountWithRouting();
      expect(result.isPathMatch('/current', { exactPath: true })).toBe(true);
      expect(result.isPathMatch('/other', { exactPath: true })).toBe(false);
    });

    it('should match exact route stripping query params', () => {
      result = mountWithRouting();
      expect(result.isPathMatch('/current?foo=bar', { exact: true })).toBe(true);
      expect(result.isPathMatch('/other?foo=bar', { exact: true })).toBe(false);
    });

    it('should match by prefix when no exact options given', () => {
      result = mountWithRouting();
      expect(result.isPathMatch('/cur', {})).toBe(true);
      expect(result.isPathMatch('/current', {})).toBe(true);
      expect(result.isPathMatch('/other', {})).toBe(false);
    });
  });
});
