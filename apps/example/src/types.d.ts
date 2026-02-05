import type { RouteLocationRaw } from 'vue-router';

export interface SideNavLink {
  to: RouteLocationRaw;
  title: string;
}

export interface Slots {
  append?: string;
  prepend?: string;
}
