<script lang="ts" setup>
import Icon from '@/components/icons/Icon.vue';
import { StepperState } from '@/types/stepper';

withDefaults(
  defineProps<{
    state?: StepperState;
    index: number;
  }>(),
  {
    state: StepperState.inactive,
  },
);

const css = useCssModule();
</script>

<template>
  <span :class="[css.indicator, css[state]]">
    <span
      v-if="state === StepperState.inactive || state === StepperState.active"
      :class="css.text"
    >
      {{ index }}
    </span>
    <Icon
      v-else-if="state === StepperState.done"
      :class="css.text"
      :size="20"
      name="check-line"
    />
    <Icon
      v-else-if="state === StepperState.success"
      name="checkbox-circle-fill"
    />
    <Icon v-else-if="state === StepperState.error" name="error-warning-fill" />
    <Icon v-else-if="state === StepperState.warning" name="alert-fill" />
    <Icon v-else-if="state === StepperState.info" name="information-fill" />
  </span>
</template>

<style lang="scss" module>
.indicator {
  @apply inline-flex items-center justify-center rounded-full h-6 w-6;

  .text {
    @apply text-rui-dark-text;
  }

  &.inactive {
    @apply bg-current text-xs;
  }

  &.active,
  &.done {
    @apply bg-rui-primary rounded-full text-xs;
  }
}

:global(.dark) {
  .indicator {
    &.inactive {
      .text {
        @apply text-rui-light-text-secondary;
      }
    }

    &.active,
    &.done {
      .text {
        @apply text-rui-light-text;
      }
    }
  }
}
</style>
