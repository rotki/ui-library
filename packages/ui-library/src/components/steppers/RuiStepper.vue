<script lang="ts" setup>
import type { VueClassValue } from '@/types/class-value';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiStepperIcon from '@/components/steppers/RuiStepperIcon.vue';
import { StepperOrientation, StepperState, type StepperStep } from '@/types/stepper';
import { tv } from '@/utils/tv';

export interface RuiStepperClassNames {
  root?: VueClassValue;
  title?: VueClassValue;
  subtitle?: VueClassValue;
}

export interface Props {
  step?: number;
  steps: StepperStep[];
  iconTop?: boolean;
  custom?: boolean;
  classNames?: RuiStepperClassNames;
  orientation?: StepperOrientation;
  keepActiveVisible?: boolean;
}

defineOptions({
  name: 'RuiStepper',
});

const {
  step,
  steps,
  iconTop = false,
  custom = false,
  classNames,
  orientation = StepperOrientation.horizontal,
  keepActiveVisible = true,
} = defineProps<Props>();

defineSlots<{
  icon?: (props: { state: StepperState | undefined; index: number }) => any;
}>();

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');

const stepper = tv({
  slots: {
    root: 'flex no-scrollbar overflow-auto',
    step: 'flex items-center px-6 relative',
    title: '',
    subtitle: '',
    label: 'flex flex-col items-start text-left ml-2',
    divider: 'border-rui-outline',
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
        step: 'px-1 py-6',
        divider: 'block min-h-12 min-w-0 max-h-full h-full self-start -my-4 mx-4 border-l',
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

// Shared UI for layout props (no per-item state)
const ui = computed<ReturnType<typeof stepper>>(() => stepper({ orientation, custom, iconTop }));

/**
 * Resolves the stepper's classes for one step, which vary with the state that
 * step is in, which the shared `ui` above cannot carry because it resolves
 * once for the whole stepper.
 *
 * @param state - the state that step is in
 * @returns the stepper's classes with that state applied
 */
function stepUi(state: StepperState): ReturnType<typeof stepper> {
  return stepper({ orientation, custom, iconTop, state });
}

// automatically set step state to stepper.
const renderedStep = computed<StepperStep[]>(() => {
  if (step === undefined)
    return steps;

  return steps.map((item, index) => {
    let stepStatus: StepperState = StepperState.inactive;

    if (index + 1 === step)
      stepStatus = StepperState.active;

    if (index + 1 < step)
      stepStatus = StepperState.done;

    return {
      ...item,
      state: stepStatus,
    };
  });
});

function resolveState(state: StepperState | undefined): StepperState {
  return state ?? StepperState.inactive;
}

watch(() => step, () => {
  if (!keepActiveVisible || orientation !== StepperOrientation.horizontal) {
    return;
  }

  nextTick(() => {
    const elem = get(wrapperRef);
    if (!elem) {
      return;
    }
    const activeStep = elem.querySelector('[data-active]');
    activeStep?.scrollIntoView?.({
      behavior: 'smooth',
      inline: 'center',
    });
  });
});
</script>

<template>
  <div
    ref="wrapperRef"
    role="list"
    aria-label="Progress steps"
    :class="ui.root()"
    :data-orientation="orientation"
    :data-icon-top="iconTop || undefined"
    :data-custom="custom || undefined"
  >
    <template
      v-for="({ title, description, state, loading }, index) in renderedStep"
      :key="index"
    >
      <!-- a list may hold only its items, so the connector is drawn but kept out of the accessibility tree -->
      <hr
        v-if="index > 0"
        aria-hidden="true"
        :class="ui.divider()"
      />
      <div
        role="listitem"
        :aria-current="state === StepperState.active ? 'step' : undefined"
        :data-state="resolveState(state)"
        :data-active="state === StepperState.active || undefined"
        :class="stepUi(resolveState(state)).step()"
      >
        <slot
          name="icon"
          v-bind="{ state, index: index + 1 }"
        >
          <div class="relative flex py-2">
            <RuiStepperIcon
              :index="index + 1"
              :state="state"
              :size="custom ? 'lg' : 'md'"
            />
            <RuiProgress
              v-if="loading"
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              :size="custom ? 40 : 32"
              variant="indeterminate"
              circular
              thickness="2"
              color="primary"
            />
          </div>
        </slot>
        <div
          v-if="title || description"
          :class="ui.label()"
          data-id="stepper-label"
        >
          <span
            v-if="title"
            :class="[stepUi(resolveState(state)).title(), custom && classNames?.title]"
            class="text-subtitle-2"
          >
            {{ title }}
          </span>
          <span
            v-if="description"
            :class="[stepUi(resolveState(state)).subtitle(), custom && classNames?.subtitle]"
            class="text-caption"
          >
            {{ description }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
