export const ButtonVariant = {
  default: 'default',
  outlined: 'outlined',
  text: 'text',
  fab: 'fab',
  list: 'list',
  link: 'link',
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  'xs': 'xs',
  'sm': 'sm',
  'lg': 'lg',
  'xl': 'xl',
  '2xl': '2xl',
} as const;

export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

/** The Tailwind breakpoint below which `collapseBelow` hides a button's label. */
export type ButtonCollapseBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// the icon size plus 2px: the spinner takes the icon's place, a thin ring reading lighter than a glyph
const SPINNER_SIZES: Record<string, number> = { 'xs': 12, 'sm': 16, 'lg': 22, 'xl': 24, '2xl': 24 };
const DEFAULT_SPINNER_SIZE = 18;

export function getButtonSpinnerSize(size?: ButtonSize): number {
  return (size && SPINNER_SIZES[size]) || DEFAULT_SPINNER_SIZE;
}
