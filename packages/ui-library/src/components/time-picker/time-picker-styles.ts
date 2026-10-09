import { tv } from '@/utils/tv';

export const timePickerStyles = tv({
  slots: {
    root: 'overflow-hidden text-rui-text p-3',
    // three columns, so the time sits over the dial's center and AM/PM hangs off to its right
    digitalDisplay: 'mb-3 grid grid-cols-[1fr_auto_1fr] items-center',
    // Inter's `case` feature lifts the colon to the middle of the figures instead of the x-height
    time: `col-start-2 flex items-center gap-0.5 [font-feature-settings:'case','cv05','cv08']`,
    // each part of the time is a button that picks what the face edits, tinted while it is the one
    digit: [
      'rounded-rui-control px-1.5 text-2xl font-semibold tabular-nums transition-colors',
      'hover:bg-rui-hover outline-hidden focus-visible:focus-ring',
    ].join(' '),
    separator: 'text-2xl font-semibold text-rui-text-secondary',
    period: [
      'col-start-3 justify-self-start ml-2 rounded-rui-control border border-rui-outline px-2 py-1 text-sm font-medium transition-colors',
      'hover:bg-rui-hover outline-hidden focus-visible:focus-ring rui-time-picker-period',
    ].join(' '),
    // a translucent well, so the face reads on a menu and on a card in both themes
    clockFace: 'relative rounded-full w-64 h-64 mx-auto bg-rui-hover',
    centerDot: 'absolute rounded-full bg-rui-primary w-2 h-2',
    clockHand: 'absolute w-[1.5px] bg-rui-primary rounded-full',
    clockHandCircle: 'absolute border-2 border-rui-primary',
    clockNumber: [
      'absolute text-center text-sm font-medium w-8 h-8 tabular-nums',
      'flex items-center justify-center',
      'hover:bg-rui-hover cursor-pointer rounded-full',
    ].join(' '),
  },
  variants: {
    bordered: {
      true: {
        root: 'bg-rui-surface rounded-rui-panel border border-rui-divider',
      },
      false: {
        root: 'bg-rui-menu',
      },
    },
    active: {
      true: {
        // the 10% tint vanishes on a dark menu, so dark doubles it
        digit: 'bg-rui-primary-soft text-rui-primary hover:bg-rui-primary-soft dark:bg-rui-primary/20 dark:text-rui-primary-lighter dark:hover:bg-rui-primary/20',
      },
    },
    selected: {
      true: {
        // the primary fill and its foreground, like the selected calendar day
        clockNumber: 'bg-rui-primary-fill hover:bg-rui-primary-fill text-rui-primary-foreground z-1 font-semibold',
      },
    },
  },
});
