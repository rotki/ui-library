import type { ContextColorsType } from '@/consts/colors';
import { afterBorderColorMap, borderColorMap, textColorMap } from '@/composables/colors/common';

interface TextInputColorClasses {
  /** Focus label text color */
  focusLabel: string;
  /** Label after pseudo-element border */
  labelAfterBorder: string;
  /** Outlined fieldset border on focus */
  outlinedFocusFieldset: string;
  /** Text color for prepend, append, and input */
  textContent: string;
}

interface TextInputValidationClasses {
  /** Input border color with !important */
  inputBorder: string;
  /** Label text + after border with !important */
  label: string;
  /** Fieldset border with !important */
  fieldset: string;
}

/**
 * Shared by RuiTextField and RuiTextArea — identical color patterns.
 *
 * Maps the SCSS color loop for all 6 context colors.
 */
export function getTextInputColorClasses(color?: ContextColorsType): TextInputColorClasses | undefined {
  if (!color)
    return undefined;

  return {
    focusLabel: textColorMap[color],
    labelAfterBorder: afterBorderColorMap[color],
    outlinedFocusFieldset: borderColorMap[color],
    textContent: textColorMap[color],
  };
}

/**
 * Validation state colors for error/success only.
 * These use !important to override other color states.
 */
const textInputValidationMap: Record<'error' | 'success', TextInputValidationClasses> = {
  error: {
    inputBorder: '!border-rui-error',
    label: '!text-rui-error !after:border-rui-error',
    fieldset: '!border-rui-error',
  },
  success: {
    inputBorder: '!border-rui-success',
    label: '!text-rui-success !after:border-rui-success',
    fieldset: '!border-rui-success',
  },
};

export function getTextInputValidationClasses(color: 'error' | 'success'): TextInputValidationClasses {
  return textInputValidationMap[color];
}

export type { TextInputColorClasses, TextInputValidationClasses };
