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
    <span v-if="state === StepperState.inactive" :class="css.text">
      {{ index }}
    </span>
    <icon
      v-else-if="state === StepperState.active"
      name="checkbox-blank-circle-fill"
      :size="20"
    />
    <icon
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
  @apply inline-flex items-center justify-center rounded-full h-10 w-10 border text-white;
  background-color: rgb(var(--rui-light-primary-main));
  border-color: rgb(var(--rui-light-primary-main));

  &.inactive {
    @apply text-xs bg-white;

    .text {
      @apply text-rui-primary;
    }
  }
}

:global(.dark) {
  .indicator {
    @apply bg-white;
    color: rgb(var(--rui-light-primary-main));

    &.inactive {
      @apply text-white border-white;
      background-color: rgb(var(--rui-light-primary-main));

      .text {
        @apply text-white;
      }
    }
  }
}
</style>
