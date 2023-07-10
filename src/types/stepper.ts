export enum StepperState {
  inactive = 'inactive',
  active = 'active',
  done = 'done',
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

export interface StepperStep {
  title?: string;
  description?: string;
  state: StepperState;
}

export enum StepperOrientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}
