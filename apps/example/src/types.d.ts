import type { RouteLocationNamedRaw } from 'vue-router';

export interface SideNavLink {
  to: RouteLocationNamedRaw;
  title: string;
}

export interface Slots {
  append?: string;
  prepend?: string;
}
