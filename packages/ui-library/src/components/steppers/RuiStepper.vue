<script lang="ts" setup>
import type { VueClassValue } from '@/types/class-value';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiStepperCustomIcon from '@/components/steppers/RuiStepperCustomIcon.vue';
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
  /** @deprecated Use `classNames.title` instead */
  titleClass?: string;
  /** @deprecated Use `classNames.subtitle` instead */
  subtitleClass?: string;
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
  titleClass = '',
  subtitleClass = '',
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
    divider: 'border-rui-grey-400',
  },
  variants: {
    orientation: {
      [StepperOrientation.horizontal]: {
        root: 'whitespace-nowrap lg:whitespace-normal',
        step: '',
        divider: 'block max-w-full min-w-[1rem] h-0 max-h-0 self-center -mx-4 my-0 border-t [flex:1_1_0]',
      },
      [StepperOrientation.vertical]: {
        root: 'flex-col inline-flex',
        step: 'px-0 py-6',
        divider: 'block min-h-[3rem] min-w-0 max-h-full h-full self-start -my-4 mx-3 border-l',
      },
    },
    state: {
      [StepperState.inactive]: {
        step: 'text-rui-text-disabled',
        title: 'text-rui-text-secondary',
        subtitle: 'text-rui-text',
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

// Per-item UI that includes the step's state
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
      <hr
        v-if="index > 0"
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
            <RuiStepperCustomIcon
              v-if="custom"
              :index="index + 1"
              :state="state"
            />
            <RuiStepperIcon
              v-else
              :index="index + 1"
              :state="state"
            />
            <RuiProgress
              v-if="loading"
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              size="32"
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
            :class="[stepUi(resolveState(state)).title(), custom && (classNames?.title ?? titleClass)]"
            class="text-subtitle-2"
          >
            {{ title }}
          </span>
          <span
            v-if="description"
            :class="[stepUi(resolveState(state)).subtitle(), custom && (classNames?.subtitle ?? subtitleClass)]"
            class="text-caption"
          >
            {{ description }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
