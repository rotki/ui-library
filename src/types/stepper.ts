export const StepperState = {
  active: 'active',
  done: 'done',
  error: 'error',
  inactive: 'inactive',
  info: 'info',
  success: 'success',
  warning: 'warning',
} as const;

export type StepperState = (typeof StepperState)[keyof typeof StepperState];

export interface StepperStep {
  title?: string;
  description?: string;
  state?: StepperState;
  loading?: boolean;
}

export const StepperOrientation = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type StepperOrientation =
  (typeof StepperOrientation)[keyof typeof StepperOrientation];
