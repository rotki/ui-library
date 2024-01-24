import type { RouteLocationNamedRaw } from 'vue-router';

export interface SideNavLink {
  to: RouteLocationNamedRaw;
  title: string;
}

type ExtractComponentProps<TComponent> = TComponent extends new () => {
  $props: infer P;
}
  ? P
  : never;

export type DataType<C, D = undefined> = Omit<
  ExtractComponentProps<C> & { value?: D },
  'modelValue'
>;

export interface Slots {
  append?: string;
  prepend?: string;
}
