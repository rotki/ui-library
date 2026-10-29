import { StepperState } from '@/types/stepper';
import { tv } from '@/utils/tv';

/**
 * The step marker: an outlined number ahead, a filled number with a soft halo
 * for the current step, and a tinted, primary-outlined check behind. A status state shows its
 * icon at full size in the step's own color.
 */
export const stepperIconStyles = tv({
  base: 'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums transition-colors',
  variants: {
    size: {
      md: 'size-6 text-xs [--rui-icon-size:0.875rem]',
      lg: 'size-8 text-sm [--rui-icon-size:1rem]',
    },
    state: {
      [StepperState.inactive]: 'border border-rui-outline bg-rui-surface text-rui-text-secondary',
      // the 10% tint vanishes on a dark page, so dark raises the halo and the done well
      [StepperState.active]: 'bg-rui-primary-fill text-rui-primary-foreground ring-4 ring-rui-primary-soft dark:ring-rui-primary/30',
      // a primary outline over the tint, so done sits between the filled current step and a neutral upcoming one
      [StepperState.done]: 'border border-rui-primary bg-rui-primary-soft text-rui-primary dark:border-rui-primary-lighter dark:bg-rui-primary/20 dark:text-rui-primary-lighter',
      [StepperState.error]: '',
      [StepperState.warning]: '',
      [StepperState.info]: '',
      [StepperState.success]: '',
    },
    status: {
      true: '![--rui-icon-size:100%]',
      false: '',
    },
  },
  defaultVariants: { size: 'md', state: StepperState.inactive, status: false },
});
