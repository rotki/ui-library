<script lang="ts" setup>
import {
  StepperOrientation,
  StepperState,
  type StepperStep,
} from '@/types/stepper';
import StepperIcon from '@/components/steppers/StepperIcon.vue';
import StepperCustomIcon from '@/components/steppers/StepperCustomIcon.vue';

const props = withDefaults(
  defineProps<{
    steps: StepperStep[];
    iconTop?: boolean;
    custom?: boolean;
    orientation?: StepperOrientation;
  }>(),
  {
    iconTop: false,
    custom: false,
    orientation: StepperOrientation.horizontal,
  }
);

const css = useCssModule();

const { custom, steps } = toRefs(props);

// custom steps only supports 3 states.
const filteredSteps = computed(() => {
  if (!get(custom)) {
    return get(steps);
  }

  return get(steps).filter((step) =>
    [StepperState.inactive, StepperState.active, StepperState.done].includes(
      step.state
    )
  );
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
      v-for="({ title, description, state }, index) in filteredSteps"
      :key="index"
    >
      <hr v-if="index > 0" :class="css.divider" />
      <div :class="[css.step, css[state]]">
        <slot name="icon" v-bind="{ state, index: index + 1 }">
          <stepper-custom-icon
            v-if="custom"
            :index="index + 1"
            :state="state"
          />
          <stepper-icon v-else :index="index + 1" :state="state" />
        </slot>
        <div v-if="title || description" :class="css.label">
          <span v-if="title" class="text-subtitle-2">{{ title }}</span>
          <span v-if="description" class="text-caption">{{ description }}</span>
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
      @apply inline-flex items-center justify-center rounded-full h-6 w-6;
    }

    .label {
      @apply flex flex-col items-start text-left ml-2;
    }

    &.inactive {
      @apply text-black/40;
    }

    &.active,
    &.done {
      @apply text-rui-primary;
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
    .divider {
      @apply border-rui-primary-lighter;
    }

    .step {
      .label {
        @apply text-rui-primary;
      }
    }
  }
}

:global(.dark) {
  .stepper {
    .step {
      &.inactive {
        @apply text-white/50;
      }
    }
  }
}
</style>
