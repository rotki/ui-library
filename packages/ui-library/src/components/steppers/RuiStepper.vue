<script lang="ts" setup>
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiStepperCustomIcon from '@/components/steppers/RuiStepperCustomIcon.vue';
import RuiStepperIcon from '@/components/steppers/RuiStepperIcon.vue';
import { StepperOrientation, StepperState, type StepperStep } from '@/types/stepper';

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

const {
  step,
  steps,
  iconTop = false,
  custom = false,
  titleClass = '',
  subtitleClass = '',
  orientation = StepperOrientation.horizontal,
  keepActiveVisible = true,
} = defineProps<Props>();

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');

// automatically set step state to stepper.
const renderedStep = computed<StepperStep[]>(() => {
  if (step === undefined)
    return steps;

  return steps.map((text, index) => {
    let stepStatus: StepperState = StepperState.inactive;

    if (index + 1 === step)
      stepStatus = StepperState.active;

    if (index + 1 < step)
      stepStatus = StepperState.done;

    return {
      ...text,
      state: stepStatus,
    };
  });
});

watch(
  () => step,
  () => {
    if (!keepActiveVisible || orientation !== StepperOrientation.horizontal) {
      return;
    }

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
  },
);
</script>

<template>
  <div
    ref="wrapperRef"
    role="list"
    aria-label="Progress steps"
    :class="[
      $style.stepper,
      $style[orientation ?? ''],
      { [$style['icon-top']]: iconTop, [$style.custom]: custom },
    ]"
    class="no-scrollbar overflow-auto"
  >
    <template
      v-for="({ title, description, state, loading }, index) in renderedStep"
      :key="index"
    >
      <hr
        v-if="index > 0"
        :class="$style.divider"
      />
      <div
        role="listitem"
        :aria-current="state === StepperState.active ? 'step' : undefined"
        :class="[
          $style.step,
          $style[state ?? StepperState.inactive],
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
          :class="$style.label"
        >
          <span
            v-if="title"
            :class="[$style.title, { [titleClass]: custom }]"
            class="text-subtitle-2"
          >
            {{ title }}
          </span>
          <span
            v-if="description"
            :class="[$style.subtitle, { [subtitleClass]: custom }]"
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
