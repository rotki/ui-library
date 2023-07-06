<script lang="ts" setup>
import Icon from '@/components/icons/Icon.vue';
import { StepperState } from '@/types/stepper';

defineProps<{
  state: StepperState;
  index: number;
}>();

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
    <icon
      v-else-if="state === StepperState.done"
      :class="css.text"
      :size="20"
      name="check-line"
    />
    <icon
      v-else-if="state === StepperState.success"
      name="checkbox-circle-fill"
    />
    <icon v-else-if="state === StepperState.error" name="error-warning-fill" />
    <icon v-else-if="state === StepperState.warning" name="alert-fill" />
    <icon v-else-if="state === StepperState.info" name="information-fill" />
  </span>
</template>

<style lang="scss" module>
.indicator {
  @apply inline-flex items-center justify-center rounded-full h-6 w-6;
  &.inactive,
  &.active,
  &.done {
    @apply bg-current rounded-full text-xs;

    .text {
      @apply text-white;
    }
  }
}

:global(.dark) {
  .indicator {
    &.inactive,
    &.active,
    &.done {
      .text {
        @apply text-black/80;
      }
    }
  }
}
</style>
