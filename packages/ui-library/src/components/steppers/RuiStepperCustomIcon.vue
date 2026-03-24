<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { StepperState } from '@/types/stepper';
import { tv } from '@/utils/tv';

type IndicatorState = typeof StepperState.inactive | typeof StepperState.active;

const { state = StepperState.inactive } = defineProps<{
  state?: StepperState;
  index: number;
}>();

const stepperCustomIcon = tv({
  base: 'inline-flex items-center justify-center rounded-full h-10 w-10 shrink-0 border border-rui-primary',
  variants: {
    state: {
      [StepperState.inactive]: 'text-xs bg-white dark:bg-rui-primary dark:text-white dark:border-white',
      [StepperState.active]: 'text-white bg-rui-primary dark:bg-white dark:text-rui-primary',
    },
  },
  defaultVariants: { state: StepperState.active },
});

const indicatorState = computed<IndicatorState>(() => state === StepperState.inactive ? StepperState.inactive : StepperState.active);
</script>

<template>
  <span :class="stepperCustomIcon({ state: indicatorState })">
    <span
      v-if="state === StepperState.inactive"
      class="text-rui-primary dark:text-white"
    >
      {{ index }}
    </span>
    <RuiIcon
      v-else-if="state === StepperState.active"
      name="lu-checkbox-blank-circle-fill"
      :size="20"
    />
    <RuiIcon
      v-else-if="state === StepperState.done"
      :size="20"
      name="lu-check"
    />
    <span v-else>
      {{ index }}
    </span>
  </span>
</template>
