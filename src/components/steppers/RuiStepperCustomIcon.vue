<script lang="ts" setup>
import { StepperState } from '@/types/stepper';
import RuiIcon from '@/components/icons/RuiIcon.vue';

withDefaults(
  defineProps<{
    state?: StepperState;
    index: number;
  }>(),
  {
    state: StepperState.inactive,
  },
);
</script>

<template>
  <span :class="[$style.indicator, $style[state]]">
    <span
      v-if="state === StepperState.inactive"
      :class="$style.text"
    >
      {{ index }}
    </span>
    <RuiIcon
      v-else-if="state === StepperState.active"
      name="checkbox-blank-circle-fill"
      :size="20"
    />
    <RuiIcon
      v-else-if="state === StepperState.done"
      :class="$style.text"
      :size="20"
      name="check-line"
    />
    <span
      v-else
      :class="$style.text"
    >
      {{ index }}
    </span>
  </span>
</template>

<style lang="scss" module>
.indicator {
  @apply inline-flex items-center justify-center rounded-full h-10 w-10 shrink-0 border text-white bg-rui-primary border-rui-primary;

  &.inactive {
    @apply text-xs bg-white;

    .text {
      @apply text-rui-primary;
    }
  }
}

:global(.dark) {
  .indicator {
    @apply bg-white text-rui-primary;

    &.inactive {
      @apply text-white border-white bg-rui-primary;

      .text {
        @apply text-white;
      }
    }
  }
}
</style>
