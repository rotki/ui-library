import { StepperOrientation, StepperState } from '@/types/stepper';
import { tv } from '@/utils/tv';

export const stepperStyles = tv({
  slots: {
    // takes focus only while it overflows (see useKeyboardScroll); the ring sits inside the clip
    root: 'flex no-scrollbar overflow-auto rounded-rui-control outline-hidden focus-visible:focus-ring focus-visible:-outline-offset-2',
    step: 'flex items-center px-6 relative',
    title: '',
    subtitle: '',
    label: 'flex flex-col items-start text-left ml-2',
    // the connector is decoration, so it takes the light divider rather than a control's edge
    divider: 'border-rui-divider',
  },
  variants: {
    orientation: {
      [StepperOrientation.horizontal]: {
        root: 'whitespace-nowrap lg:whitespace-normal',
        step: '',
        divider: 'block max-w-full min-w-4 h-0 max-h-0 self-center -mx-4 my-0 border-t flex-[1_1_0]',
      },
      [StepperOrientation.vertical]: {
        root: 'flex-col inline-flex',
        // 4px in from the edge, so the scrolling root does not clip the active marker's halo
        step: 'px-1 py-3',
        // reaches into both steps' padding, so the line runs from just under one marker to just over the next
        divider: 'block min-h-6 min-w-0 max-h-full h-full self-start -my-3 mx-4 border-l',
      },
    },
    state: {
      // an upcoming step is not disabled, so its text keeps the 4.5:1 of the secondary tone
      [StepperState.inactive]: {
        step: 'text-rui-text-disabled',
        title: 'text-rui-text-secondary',
        subtitle: 'text-rui-text-secondary',
      },
      [StepperState.active]: {
        step: 'text-rui-text',
        title: '',
        subtitle: 'text-rui-text-secondary',
      },
      [StepperState.done]: {
        step: 'text-rui-text',
        title: '',
        subtitle: 'text-rui-text-secondary',
      },
      [StepperState.error]: {
        step: 'text-rui-error',
        title: '',
        subtitle: '',
      },
      [StepperState.warning]: {
        step: 'text-rui-warning',
        title: '',
        subtitle: '',
      },
      [StepperState.info]: {
        step: 'text-rui-info',
        title: '',
        subtitle: '',
      },
      [StepperState.success]: {
        step: 'text-rui-success',
        title: '',
        subtitle: '',
      },
    },
    iconTop: {
      true: {
        step: 'flex-col',
        label: 'ml-0 mt-4 items-center text-center',
      },
    },
    custom: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    { custom: true, state: StepperState.inactive, class: { step: 'text-rui-text' } },
    // the line runs through the 32px marker's center
    { orientation: StepperOrientation.vertical, custom: true, class: { divider: 'mx-5' } },
    { orientation: StepperOrientation.vertical, iconTop: true, class: { divider: 'self-center mx-auto' } },
  ],
  defaultVariants: {
    state: StepperState.inactive,
    orientation: StepperOrientation.horizontal,
    custom: false,
  },
});
