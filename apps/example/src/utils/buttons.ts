import { contextColors, type ContextColorsType } from '@rotki/ui-library';

const gap = ['sm', 'md', 'lg'] as const;

export interface ButtonGroupData {
  count: number;
  rounded?: boolean;
  modelValue?: number | string | (number | string)[];
  vertical?: boolean;
  color?: ContextColorsType;
  activeColor?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: 'sm' | 'lg';
  gap?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

function createButtonGroupData(color: ContextColorsType, options: Partial<ButtonGroupData>): ButtonGroupData {
  return {
    count: 0,
    ...options,
    color,
  };
}

export function generateButtonGroupData(attributes: Partial<ButtonGroupData>[], modelValue?: ButtonGroupData['modelValue']): ButtonGroupData[] {
  const data: ButtonGroupData[] = [];
  for (const attrs of attributes) {
    for (const [i, color] of contextColors.entries()) {
      const groupGap = gap?.[i];
      data.push(createButtonGroupData(color, {
        ...attrs,
        ...(groupGap ? { gap: groupGap } : {}),
        ...(modelValue ? { modelValue: Array.isArray(modelValue) ? [...modelValue] : modelValue } : {}),
      }));
    }
  }
  return data;
}
