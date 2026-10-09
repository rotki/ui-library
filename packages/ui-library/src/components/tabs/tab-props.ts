export const TabAlignment = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

export type TabAlignment = (typeof TabAlignment)[keyof typeof TabAlignment];

export const TabIndicatorPosition = {
  start: 'start',
  end: 'end',
} as const;

export type TabIndicatorPosition = (typeof TabIndicatorPosition)[keyof typeof TabIndicatorPosition];

export const TabVariant = {
  /** Labels on a divider track, the active one marked by a sliding line: page and section tabs */
  underline: 'underline',
  /** A raised pill sliding on a sunken track: a few short options that switch a view in place */
  segmented: 'segmented',
} as const;

export type TabVariant = (typeof TabVariant)[keyof typeof TabVariant];

export interface RouteMatchOptions {
  exact?: boolean;
}

export const TabLayout = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type TabLayout = (typeof TabLayout)[keyof typeof TabLayout];
