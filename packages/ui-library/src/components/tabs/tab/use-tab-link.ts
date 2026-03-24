import { type ComputedRef, getCurrentInstance, type MaybeRefOrGetter } from 'vue';
import { type RouteLocationRaw, useLink } from 'vue-router';

interface UseTabLinkOptions {
  /** Whether this tab is a link tab */
  link: MaybeRefOrGetter<boolean>;
  /** The route location to navigate to */
  to: MaybeRefOrGetter<RouteLocationRaw>;
  /** Whether to match the route exactly */
  exact: MaybeRefOrGetter<boolean>;
}

interface UseTabLinkReturn {
  /** Whether the link is active based on the current route */
  isRouteActive: ComputedRef<boolean>;
  /** The resolved href for the link */
  href: ComputedRef<string | undefined>;
  /** Navigate to the link's route */
  navigate: ((event?: MouseEvent) => void) | undefined;
  /** Whether this tab has link behavior */
  isLink: boolean;
}

/**
 * Composable that integrates vue-router's `useLink` for link-based tabs.
 * Only activates when `link` is true, a router is available, and `to` is provided.
 */
export function useTabLink({ link, to, exact }: UseTabLinkOptions): UseTabLinkReturn {
  const hasRouter = !!getCurrentInstance()?.appContext.config.globalProperties.$router;
  const isLink = toValue(link) && hasRouter && !!toValue(to);

  if (!isLink) {
    return {
      isRouteActive: computed<boolean>(() => false),
      href: computed<string | undefined>(() => undefined),
      navigate: undefined,
      isLink: false,
    };
  }

  const linkState = useLink({ to: computed<RouteLocationRaw>(() => toValue(to)) });

  return {
    isRouteActive: computed<boolean>(() => toValue(exact) ? get(linkState.isExactActive) : get(linkState.isActive)),
    href: computed<string | undefined>(() => get(linkState.href)),
    navigate: (event?: MouseEvent) => linkState.navigate(event as MouseEvent),
    isLink: true,
  };
}
