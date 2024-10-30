import { type ButtonGroupProps, type ContextColorsType, contextColors } from '@rotki/ui-library';

const gap = ['sm', 'md', 'lg'] as const;

export interface ButtonGroupData extends ButtonGroupProps<number | string> {
  count: number;
  rounded?: boolean;
};

function createButtonGroupData(color: ContextColorsType, options: Partial<ButtonGroupData>): ButtonGroupData {
  return {
    count: 0,
    ...options,
    color,
  };
}

export function generateButtonGroupData(attributes: Partial<ButtonGroupData>[], modelValue?: ButtonGroupProps<any>['modelValue']): ButtonGroupData[] {
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
