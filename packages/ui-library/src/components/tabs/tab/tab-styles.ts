import { TabLayout, TabVariant } from '@/components/tabs/tab-props';
import { tv } from '@/utils/tv';

/**
 * A tab is a plain button or link: RuiTabs draws the active indicator, so a tab
 * only sets its label color, and its hover fill. On the underline bar the fill
 * hugs the label rather than the 40px cell, so the bar stays calm.
 */
export const tabStyles = tv({
  slots: {
    root: [
      'group relative inline-flex shrink-0 items-center whitespace-nowrap rounded-rui-control',
      'text-sm font-medium text-rui-text-secondary transition-colors duration-150 [--rui-icon-size:1rem]',
      // inset, since the scrolling bar would clip a ring drawn outside the tab
      'outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    ].join(' '),
    content: 'inline-flex items-center gap-2 rounded-rui-control transition-colors duration-150',
  },
  variants: {
    variant: {
      [TabVariant.underline]: { root: 'px-1', content: 'h-8 px-2' },
      // above the sliding pill, which RuiTabs renders behind the tabs
      [TabVariant.segmented]: { root: 'z-1 h-8 px-3' },
    },
    layout: {
      [TabLayout.horizontal]: {},
      [TabLayout.vertical]: { root: 'w-full' },
    },
    align: {
      start: { root: 'justify-start text-left rtl:justify-end rtl:text-right' },
      center: { root: 'justify-center text-center' },
      end: { root: 'justify-end text-right rtl:justify-start rtl:text-left' },
    },
    grow: {
      true: { root: 'grow' },
    },
    active: {
      true: { root: 'text-rui-text' },
      false: {},
    },
    disabled: {
      true: { root: 'cursor-not-allowed text-rui-text-disabled' },
      false: { root: 'cursor-pointer hover:text-rui-text' },
    },
  },
  compoundVariants: [
    { variant: TabVariant.underline, layout: TabLayout.horizontal, class: { root: 'h-10' } },
    { variant: TabVariant.underline, layout: TabLayout.horizontal, disabled: false, class: { content: 'group-hover:bg-rui-hover' } },
    // a vertical list fills the whole row on hover and keeps that fill on the selected row
    { variant: TabVariant.underline, layout: TabLayout.vertical, class: { root: 'min-h-9 px-3', content: 'h-auto px-0 py-2' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, disabled: false, class: { root: 'hover:bg-rui-hover' } },
    { variant: TabVariant.underline, layout: TabLayout.vertical, active: true, class: { root: 'bg-rui-hover' } },
  ],
  defaultVariants: {
    variant: TabVariant.underline,
    layout: TabLayout.horizontal,
    align: 'center',
    active: false,
    disabled: false,
  },
});
