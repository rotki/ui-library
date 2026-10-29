<script lang="ts" setup>
import type { VueClassValue } from '@/types/class-value';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiStepperIcon from '@/components/steppers/RuiStepperIcon.vue';
import { useKeyboardScroll } from '@/composables/keyboard-scroll';
import { StepperOrientation, StepperState, type StepperStep } from '@/types/stepper';
import { cn } from '@/utils/tv';
import { stepperStyles } from './stepper-styles';

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
  inheritAttrs: false,
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
const scrollTabindex = useKeyboardScroll(wrapperRef);

// Shared UI for layout props (no per-item state)
const ui = computed<ReturnType<typeof stepperStyles>>(() => stepperStyles({ orientation, custom, iconTop }));

/**
 * Resolves the stepper's classes for one step, which vary with the state that
 * step is in, which the shared `ui` above cannot carry because it resolves
 * once for the whole stepper.
 *
 * @param state - the state that step is in
 * @returns the stepper's classes with that state applied
 */
function stepUi(state: StepperState): ReturnType<typeof stepperStyles> {
  return stepperStyles({ orientation, custom, iconTop, state });
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
    :tabindex="scrollTabindex"
    role="list"
    aria-label="Progress steps"
    :class="ui.root({ class: cn([classNames?.root, $attrs.class]) })"
    v-bind="{ ...$attrs, class: undefined }"
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
