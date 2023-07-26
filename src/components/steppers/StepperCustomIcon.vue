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
    <span v-if="state === StepperState.inactive" :class="css.text">
      {{ index }}
    </span>
    <Icon
      v-else-if="state === StepperState.active"
      name="checkbox-blank-circle-fill"
      :size="20"
    />
    <Icon
      v-else-if="state === StepperState.done"
      :class="css.text"
      :size="20"
      name="check-line"
    />
    <span v-else :class="css.text">
      {{ index }}
    </span>
  </span>
</template>

<style lang="scss" module>
.indicator {
  @apply inline-flex items-center justify-center rounded-full h-10 w-10 border text-white bg-rui-light-primary border-rui-light-primary;

  &.inactive {
    @apply text-xs bg-white;

    .text {
      @apply text-rui-primary;
    }
  }
}

:global(.dark) {
  .indicator {
    @apply bg-white text-rui-light-primary;

    &.inactive {
      @apply text-white border-white bg-rui-light-primary;

      .text {
        @apply text-white;
      }
    }
  }
}
</style>
