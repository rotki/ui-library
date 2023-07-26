export const StepperState = {
  inactive: 'inactive',
  active: 'active',
  done: 'done',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
} as const;

export type StepperState = (typeof StepperState)[keyof typeof StepperState];

export interface StepperStep {
  title?: string;
  description?: string;
  state?: StepperState;
}

export const StepperOrientation = {
  vertical: 'vertical',
  horizontal: 'horizontal',
} as const;

export type StepperOrientation =
  (typeof StepperOrientation)[keyof typeof StepperOrientation];
