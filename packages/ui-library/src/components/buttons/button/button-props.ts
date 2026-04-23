export const ButtonVariant = {
  default: 'default',
  outlined: 'outlined',
  text: 'text',
  fab: 'fab',
  list: 'list',
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

const SPINNER_SIZES: Record<string, number> = { 'xs': 12, 'sm': 18, 'lg': 26, 'xl': 26, '2xl': 28 };
const DEFAULT_SPINNER_SIZE = 22;

export const FAB_DEFAULT_ELEVATION = 6;

export const NO_ELEVATION = 0;

export function getButtonSpinnerSize(size?: ButtonSize): number {
  return (size && SPINNER_SIZES[size]) || DEFAULT_SPINNER_SIZE;
}
