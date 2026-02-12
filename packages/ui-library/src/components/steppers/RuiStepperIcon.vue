<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { StepperState } from '@/types/stepper';

const { state = StepperState.inactive, index } = defineProps<{
  state?: StepperState;
  index: number;
}>();
</script>

<template>
  <span :class="[$style.indicator, $style[state]]">
    <span
      v-if="state === StepperState.inactive || state === StepperState.active"
      :class="$style.text"
    >
      {{ index }}
    </span>
    <RuiIcon
      v-else-if="state === StepperState.done"
      :class="$style.text"
      :size="20"
      name="lu-check"
    />
    <RuiIcon
      v-else-if="state === StepperState.success"
      name="lu-circle-check"
    />
    <RuiIcon
      v-else-if="state === StepperState.error"
      name="lu-circle-alert"
    />
    <RuiIcon
      v-else-if="state === StepperState.warning"
      name="lu-triangle-alert"
    />
    <RuiIcon
      v-else-if="state === StepperState.info"
      name="lu-info"
    />
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
