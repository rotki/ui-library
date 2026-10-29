import { TabLayout, TabVariant } from '@/components/tabs/tab-props';
import { tv } from '@/utils/tv';

/**
 * The bar. The underline variant draws its 1px track as a `before` line along
 * the whole root, so the arrows sit on it too, and the 2px indicator, a layer
 * above, covers it under the active tab.
 */
export const tabsStyles = tv({
  slots: {
    root: '',
    arrow: 'flex shrink-0 items-center justify-center',
    // a tab stop only when it scrolls with every tab disabled (useKeyboardScroll)
    bar: 'no-scrollbar relative max-h-full overflow-auto outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    wrapper: 'inline-flex max-w-none',
    indicator: 'pointer-events-none absolute',
  },
  variants: {
    variant: {
      [TabVariant.underline]: {
        root: `relative before:pointer-events-none before:absolute before:bg-rui-divider before:content-['']`,
        indicator: 'z-1 bg-rui-primary',
      },
      [TabVariant.segmented]: {
        // neutral-200, not 100: on a near-white page (`#fafafa`) the lighter track all but disappeared
        root: 'rounded-rui-panel bg-rui-neutral-200 p-0.5 dark:bg-rui-neutral-800',
        wrapper: 'gap-0.5',
        indicator: 'rounded-rui-control bg-rui-surface shadow-rui-control dark:bg-rui-neutral-700',
      },
    },
    layout: {
      [TabLayout.horizontal]: { root: 'flex h-fit', arrow: 'w-8' },
      [TabLayout.vertical]: { root: 'inline-flex flex-col', arrow: 'h-8 w-full', wrapper: 'flex-col w-full' },
    },
    indicatorPosition: {
      start: {},
      end: {},
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
    wide: {
      true: { bar: 'w-full', wrapper: 'min-w-full' },
      false: {},
    },
    animated: {
      true: { indicator: 'transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none' },
      false: {},
    },
  },
  compoundVariants: [
    { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'end', class: { root: 'before:inset-x-0 before:bottom-0 before:h-px', indicator: 'bottom-0 h-0.5 rounded-t-full' } },
    { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'start', class: { root: 'before:inset-x-0 before:top-0 before:h-px', indicator: 'top-0 h-0.5 rounded-b-full' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, indicatorPosition: 'end', class: { root: 'before:inset-y-0 before:right-0 before:w-px', indicator: 'right-0 w-0.5 rounded-l-full' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, indicatorPosition: 'start', class: { root: 'before:inset-y-0 before:left-0 before:w-px', indicator: 'left-0 w-0.5 rounded-r-full' } },
    // the underline track spans its row, while a segmented control hugs its options unless it grows
    { variant: TabVariant.segmented, layout: TabLayout.horizontal, wide: false, class: { root: 'w-fit max-w-full' } },
    // `color` picks the underline's color; the segmented pill stays a neutral surface
    { variant: TabVariant.underline, color: 'secondary', class: { indicator: 'bg-rui-secondary' } },
    { variant: TabVariant.underline, color: 'error', class: { indicator: 'bg-rui-error' } },
    { variant: TabVariant.underline, color: 'warning', class: { indicator: 'bg-rui-warning' } },
    { variant: TabVariant.underline, color: 'info', class: { indicator: 'bg-rui-info' } },
    { variant: TabVariant.underline, color: 'success', class: { indicator: 'bg-rui-success' } },
  ],
  defaultVariants: { variant: TabVariant.underline, layout: TabLayout.horizontal, indicatorPosition: 'end' },
});
