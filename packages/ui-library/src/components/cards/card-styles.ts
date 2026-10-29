import { tv } from '@/utils/tv';

export const cardStyles = tv({
  slots: {
    root: 'flex flex-col h-full w-full bg-rui-surface',
    image: 'overflow-hidden',
    content: 'text-sm/6 text-rui-text overflow-y-auto outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    // a leading text button moves out by its side padding to align its label; unquoted selectors, quoted ones break consumer builds
    footer: [
      'flex between:ml-2 between:mr-0 items-center justify-start mt-auto',
      '[&>[data-variant=text][data-size=xs]:first-child]:-ms-1',
      '[&>[data-variant=text][data-size=sm]:first-child]:-ms-1.5',
      '[&>[data-variant=text][data-size=md]:first-child]:-ms-2',
      '[&>[data-variant=text][data-size=lg]:first-child]:-ms-2.5',
      '[&>[data-variant=text][data-size$=xl]:first-child]:-ms-2.5',
    ],
  },
  variants: {
    variant: {
      flat: { root: '' },
      outlined: { root: 'border border-rui-divider' },
    },
    rounded: {
      sm: { root: 'rounded-rui-sm', image: 'rounded-t-rui-sm' },
      md: { root: 'rounded-rui-card', image: 'rounded-t-rui-card' },
      lg: { root: 'rounded-rui-lg', image: 'rounded-t-rui-lg' },
    },
    divide: {
      true: { root: 'between:border-t between:border-b-0 between:border-rui-divider' },
    },
    padding: {
      none: { content: 'p-0' },
      dense: { content: 'p-3' },
      normal: { content: 'p-4' },
    },
    dense: {
      // the footer keeps the content's side padding, so its buttons line up with the text above
      true: { footer: 'p-3 pt-1' },
      false: { footer: 'p-4 pt-2' },
    },
    underHeader: {
      true: { content: 'pt-0' },
      false: {},
    },
  },
  defaultVariants: { variant: 'outlined', rounded: 'md', padding: 'normal', dense: false, underHeader: false },
});
