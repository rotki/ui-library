import type { ContextColorsType } from '@/consts/colors';

interface ButtonGroupColorClasses {
  base: string;
  outlinedText: string;
  outlined: string;
}

const buttonGroupColorMap: Record<ContextColorsType, ButtonGroupColorClasses> = {
  primary: {
    base: 'divide-rui-primary-darker',
    outlinedText: 'divide-rui-primary/[0.5]',
    outlined: 'outline-rui-primary/[0.5]',
  },
  secondary: {
    base: 'divide-rui-secondary-darker',
    outlinedText: 'divide-rui-secondary/[0.5]',
    outlined: 'outline-rui-secondary/[0.5]',
  },
  error: {
    base: 'divide-rui-error-darker',
    outlinedText: 'divide-rui-error/[0.5]',
    outlined: 'outline-rui-error/[0.5]',
  },
  warning: {
    base: 'divide-rui-warning-darker',
    outlinedText: 'divide-rui-warning/[0.5]',
    outlined: 'outline-rui-warning/[0.5]',
  },
  info: {
    base: 'divide-rui-info-darker',
    outlinedText: 'divide-rui-info/[0.5]',
    outlined: 'outline-rui-info/[0.5]',
  },
  success: {
    base: 'divide-rui-success-darker',
    outlinedText: 'divide-rui-success/[0.5]',
    outlined: 'outline-rui-success/[0.5]',
  },
};

export function getButtonGroupColorClasses(color?: ContextColorsType): ButtonGroupColorClasses | undefined {
  if (!color)
    return undefined;

  return buttonGroupColorMap[color];
}

export type { ButtonGroupColorClasses };
