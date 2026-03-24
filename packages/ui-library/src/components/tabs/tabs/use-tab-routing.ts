import type { RouteMatchOptions } from '@/components/tabs/tab-props';
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router';

interface UseTabRoutingOptions {
  /** Callback invoked when the route changes, to re-sync the active tab */
  onRouteChange: () => void;
}

interface UseTabRoutingReturn {
  /** Whether vue-router is available in the app context */
  hasRouter: boolean;
  /**
   * Resolves a route location and returns its full path, or undefined
   * if the router is not available or the value is not a valid route location.
   */
  resolveRoute: (to: unknown) => string | undefined;
  /**
   * Checks whether a given path matches the current route.
   * Supports exact path, exact route, and prefix matching.
   */
  isPathMatch: (path: string, options: RouteMatchOptions) => boolean;
}

export function isRouteLocation(value: unknown): value is RouteLocationRaw {
  return typeof value === 'string' || (typeof value === 'object' && value !== null);
}

/**
 * Composable that manages vue-router integration for the RuiTabs component.
 * Provides route resolution and path matching utilities, and watches for
 * route changes to notify the parent component.
 */
export function useTabRouting({ onRouteChange }: UseTabRoutingOptions): UseTabRoutingReturn {
  const hasRouter = getCurrentInstance()?.appContext.config.globalProperties.$router !== undefined;

  if (!hasRouter) {
    return {
      hasRouter,
      resolveRoute: () => undefined,
      isPathMatch: () => false,
    };
  }

  const route = useRoute();
  const router = useRouter();

  function resolveRoute(to: unknown): string | undefined {
    if (!isRouteLocation(to))
      return undefined;

    return router.resolve(to).fullPath;
  }

  function isPathMatch(
    path: string,
    { exactPath, exact }: RouteMatchOptions,
  ): boolean {
    const currentRoute = route.fullPath;

    if (exactPath)
      return currentRoute === path;

    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const routeWithoutQueryParams = new URL(path, base).pathname;

    if (exact)
      return currentRoute === routeWithoutQueryParams;

    return currentRoute.startsWith(routeWithoutQueryParams);
  }

  watch(route, onRouteChange);

  return {
    hasRouter,
    resolveRoute,
    isPathMatch,
  };
}
