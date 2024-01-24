<script lang="ts" setup>
import {
  StepperOrientation,
  StepperState,
  type StepperStep,
} from '@/types/stepper';
import StepperIcon from '@/components/steppers/StepperIcon.vue';
import StepperCustomIcon from '@/components/steppers/StepperCustomIcon.vue';
import Progress from '@/components/progress/Progress.vue';

export interface Props {
  step?: number;
  steps: StepperStep[];
  iconTop?: boolean;
  custom?: boolean;
  titleClass?: string;
  subtitleClass?: string;
  orientation?: StepperOrientation;
  keepActiveVisible?: boolean;
}

defineOptions({
  name: 'RuiStepper',
});

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  iconTop: false,
  custom: false,
  titleClass: '',
  subtitleClass: '',
  orientation: StepperOrientation.horizontal,
  keepActiveVisible: true,
});

const css = useCssModule();

const { custom, steps, step, orientation, keepActiveVisible } = toRefs(props);

// automatically set step state to stepper.
const renderedStep = computed(() => {
  const currentStep = get(step);
  const stepsVal = get(steps);

  if (!isDefined(currentStep))
    return stepsVal;

  return stepsVal.map((text, index) => {
    let stepStatus: StepperState = StepperState.inactive;

    if (index + 1 === currentStep)
      stepStatus = StepperState.active;

    if (index + 1 < currentStep)
      stepStatus = StepperState.done;

    return {
      ...text,
      state: stepStatus,
    };
  });
});

const wrapperRef = ref<HTMLDivElement>();

watch(step, () => {
  if (
    !get(keepActiveVisible)
    || get(orientation) !== StepperOrientation.horizontal
  )
    return;

  nextTick(() => {
    const elem = get(wrapperRef);
    if (elem) {
      const activeStep = elem.querySelector('.active-step');
      activeStep?.scrollIntoView?.({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  });
});
</script>

<template>
  <div
    ref="wrapperRef"
    :class="[
      css.stepper,
      css[orientation ?? ''],
      { [css['icon-top']]: iconTop, [css.custom]: custom },
    ]"
    class="no-scrollbar overflow-auto"
  >
    <template
      v-for="({ title, description, state, loading }, index) in renderedStep"
      :key="index"
    >
      <hr
        v-if="index > 0"
        :class="css.divider"
      />
      <div
        :class="[
          css.step,
          css[state ?? StepperState.inactive],
          {
            'active-step': state === StepperState.active,
          },
        ]"
      >
        <slot
          name="icon"
          v-bind="{ state, index: index + 1 }"
        >
          <div class="relative flex py-2">
            <StepperCustomIcon
              v-if="custom"
              :index="index + 1"
              :state="state"
            />
            <StepperIcon
              v-else
              :index="index + 1"
              :state="state"
            />
            <Progress
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
          :class="css.label"
        >
          <span
            v-if="title"
            :class="[css.title, { [titleClass]: custom }]"
            class="text-subtitle-2"
          >
            {{ title }}
          </span>
          <span
            v-if="description"
            :class="[css.subtitle, { [subtitleClass]: custom }]"
            class="text-caption"
          >
            {{ description }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
$colors: 'error', 'warning', 'info', 'success';
.stepper {
  @apply flex;

  &.horizontal {
    @apply whitespace-nowrap lg:whitespace-normal;
  }

  &.vertical {
    @apply flex-col inline-flex;

    .step {
      @apply px-0 py-6;
    }

    .divider {
      @apply block min-h-[3rem] min-w-0 max-h-full h-full self-start -my-4 mx-3 border-l border-rui-grey-400;
    }

    &.custom {
      .divider {
        @apply mx-5;
      }
    }

    &.icon-top {
      .divider {
        @apply self-center mx-auto;
      }
    }
  }

  .step {
    @apply flex items-center px-6 relative;

    .indicator {
      @apply inline-flex items-center justify-center rounded-full h-6 w-6 min-w-[1.5rem];
    }

    .label {
      @apply flex flex-col items-start text-left ml-2;
    }

    &.inactive {
      @apply text-rui-text-disabled;

      .title {
        @apply text-rui-text-secondary;
      }

      .subtitle {
        @apply text-rui-text;
      }
    }

    &.active,
    &.done {
      @apply text-rui-text;

      .subtitle {
        @apply text-rui-text-secondary;
      }
    }

    @each $color in $colors {
      &.#{$color} {
        @apply text-rui-#{$color};
      }
    }
  }

  &.icon-top {
    .step {
      @apply flex-col;

      .label {
        @apply ml-0 mt-4 items-center text-center;
      }
    }
  }

  .divider {
    @apply block max-w-full min-w-[1rem] h-0 max-h-0 self-center -mx-4 my-0 border-t border-rui-grey-400;
    flex: 1 1 0;
  }

  &.custom {
    .step {
      .divider {
        @apply border-rui-primary-lighter;
      }

      &.inactive {
        @apply text-rui-text;
      }
    }
  }
}
</style>
