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

export interface RouteMatchOptions {
  exactPath?: boolean;
  exact?: boolean;
}

export const TabLayout = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type TabLayout = (typeof TabLayout)[keyof typeof TabLayout];
