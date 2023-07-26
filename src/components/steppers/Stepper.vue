<script lang="ts" setup>
import {
  StepperOrientation,
  StepperState,
  type StepperStep,
} from '@/types/stepper';
import StepperIcon from '@/components/steppers/StepperIcon.vue';
import StepperCustomIcon from '@/components/steppers/StepperCustomIcon.vue';

export interface Props {
  step?: number;
  steps: StepperStep[];
  iconTop?: boolean;
  custom?: boolean;
  titleClass?: string;
  subtitleClass?: string;
  orientation?: StepperOrientation;
}

defineOptions({
  name: 'RuiStepper',
});

const props = withDefaults(defineProps<Props>(), {
  step: 0,
  iconTop: false,
  custom: false,
  titleClass: '',
  subtitleClass: '',
  orientation: StepperOrientation.horizontal,
});

const css = useCssModule();

const { custom, steps, step } = toRefs(props);

// automatically set step state to custom stepper.
const renderedStep = computed(() => {
  if (!get(custom)) {
    return get(steps);
  }

  const currentStep = get(step);
  return get(steps).map((text, index) => {
    let stepStatus: StepperState = StepperState.inactive;

    if (index + 1 === currentStep) {
      stepStatus = StepperState.active;
    }

    if (index + 1 < currentStep) {
      stepStatus = StepperState.done;
    }

    return {
      ...text,
      state: stepStatus,
    };
  });
});
</script>

<template>
  <div
    :class="[
      css.stepper,
      css[orientation ?? ''],
      { [css['icon-top']]: iconTop, [css.custom]: custom },
    ]"
  >
    <template
      v-for="({ title, description, state }, index) in renderedStep"
      :key="index"
    >
      <hr v-if="index > 0" :class="css.divider" />
      <div :class="[css.step, css[state ?? StepperState.inactive]]">
        <slot name="icon" v-bind="{ state, index: index + 1 }">
          <StepperCustomIcon v-if="custom" :index="index + 1" :state="state" />
          <StepperIcon v-else :index="index + 1" :state="state" />
        </slot>
        <div v-if="title || description" :class="css.label">
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
            >{{ description }}</span
          >
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
$colors: 'error', 'warning', 'info', 'success';
.stepper {
  @apply flex;

  &.vertical {
    @apply flex-col inline-flex;

    .step {
      @apply px-0 py-6;
    }

    .divider {
      @apply block min-h-[3rem] max-h-full h-full self-start -my-4 mx-3 border-l border-rui-grey-400;
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
    @apply block max-w-full h-0 max-h-0 self-center -mx-4 my-0 border-t border-rui-grey-400;
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
