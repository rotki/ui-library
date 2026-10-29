import { tv } from '@/utils/tv';

export const buttonGroupStyles = tv({
  slots: {
    /*
     * `w-fit`: a flex column stretches its children, inline-flex or not, which drew an outlined
     * group's frame across the whole row. A consumer's own width still wins through the class merge.
     * Between filled buttons a separator only needs to part the fills, so it takes the light divider.
     */
    root: 'inline-flex w-fit max-w-full rounded-rui-control between:border-l between:border-r-0 between:border-rui-divider outline-solid outline-1 outline-transparent -outline-offset-1',
    button: 'border-0 inset-ring-0 focus:z-1',
  },
  variants: {
    vertical: {
      true: {
        root: 'flex-col items-start between:border-l-0 between:border-t between:border-b-0 *:w-full',
        button: 'w-full',
      },
      false: {},
    },
    gap: {
      none: {
        button: 'rounded-none!',
      },
      sm: {
        root: 'between:border-0 outline-0 gap-2',
        button: 'inset-ring',
      },
      md: {
        root: 'between:border-0 outline-0 gap-4',
        button: 'inset-ring',
      },
      lg: {
        root: 'between:border-0 outline-0 gap-6',
        button: 'inset-ring',
      },
    },
    variant: {
      default: {},
      outlined: {
        // the control edge, matching RuiButton's colourless outlined treatment
        root: 'outline-rui-outline between:border-rui-outline',
      },
      text: {},
      // the segmented tabs' track and pill; the 32px options make a 36px control, a field's height
      segmented: {
        root: 'rounded-rui-panel bg-rui-neutral-200 p-0.5 gap-0.5 outline-0 between:border-0 dark:bg-rui-neutral-800',
        button: [
          'h-8 px-3 text-rui-text-secondary transition-colors hover:text-rui-text focus-visible:-outline-offset-2',
          'data-[active]:bg-rui-surface data-[active]:text-rui-text data-[active]:shadow-rui-control dark:data-[active]:bg-rui-neutral-700',
        ].join(' '),
      },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    /*
     * The outer corners go to the button that is, or sits inside, the group's first or last item, so a
     * button wrapped in a tooltip or a menu activator rounds like a direct child.
     */
    { gap: 'none', vertical: false, class: { button: '[&:is([data-button-group]>:first-child,[data-button-group]>:first-child_*)]:rounded-l-rui-control! [&:is([data-button-group]>:last-child,[data-button-group]>:last-child_*)]:rounded-r-rui-control!' } },
    { gap: 'none', vertical: true, class: { button: '[&:is([data-button-group]>:first-child,[data-button-group]>:first-child_*)]:rounded-t-rui-control! [&:is([data-button-group]>:last-child,[data-button-group]>:last-child_*)]:rounded-b-rui-control!' } },
    /*
     * In a joined group the focus outline's sides fall on the neighbours, and on a primary neighbour a
     * primary outline vanishes. A surface ring fills the outline's offset, so the raised segment's
     * ring is parted from its neighbours on every side.
     */
    { gap: 'none', variant: ['default', 'outlined', 'text'], class: { button: 'focus-visible:ring-2 focus-visible:ring-rui-surface' } },
    // each segment is its own rounded pill inside the track, not a slice of one joined bar
    { variant: 'segmented', class: { button: 'rounded-rui-control!' } },

    // Color dividers for outlined/text (overrides darker dividers above)
    { color: 'primary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-primary/50' } },
    { color: 'secondary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-secondary/50' } },
    { color: 'error', variant: ['outlined', 'text'], class: { root: 'between:border-rui-error/50' } },
    { color: 'warning', variant: ['outlined', 'text'], class: { root: 'between:border-rui-warning/50' } },
    { color: 'info', variant: ['outlined', 'text'], class: { root: 'between:border-rui-info/50' } },
    { color: 'success', variant: ['outlined', 'text'], class: { root: 'between:border-rui-success/50' } },

    // Color outline for outlined variant
    { color: 'primary', variant: 'outlined', class: { root: 'outline-rui-primary/50' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'outline-rui-secondary/50' } },
    { color: 'error', variant: 'outlined', class: { root: 'outline-rui-error/50' } },
    { color: 'warning', variant: 'outlined', class: { root: 'outline-rui-warning/50' } },
    { color: 'info', variant: 'outlined', class: { root: 'outline-rui-info/50' } },
    { color: 'success', variant: 'outlined', class: { root: 'outline-rui-success/50' } },
  ],
  defaultVariants: {
    vertical: false,
    gap: 'none',
    variant: 'default',
  },
});
