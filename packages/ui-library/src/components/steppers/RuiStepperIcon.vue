<script lang="ts" setup>
import type { RuiIcons } from '@/icons';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { StepperState } from '@/types/stepper';
import { stepperIconStyles } from './stepper-icon-styles';

const { state = StepperState.inactive, index, size = 'md' } = defineProps<{
  state?: StepperState;
  index: number;
  /** md is 24px, the default stepper; lg is 32px, the `custom` one */
  size?: 'md' | 'lg';
}>();

const statusIcons: Partial<Record<StepperState, RuiIcons>> = {
  [StepperState.success]: 'lu-circle-check',
  [StepperState.error]: 'lu-circle-alert',
  [StepperState.warning]: 'lu-triangle-alert',
  [StepperState.info]: 'lu-info',
};

const statusIcon = computed<RuiIcons | undefined>(() => statusIcons[state]);
</script>

<template>
  <span :class="stepperIconStyles({ size, state, status: !!statusIcon })">
    <RuiIcon
      v-if="state === StepperState.done"
      name="lu-check"
    />
    <RuiIcon
      v-else-if="statusIcon"
      :name="statusIcon"
    />
    <span v-else>{{ index }}</span>
  </span>
</template>
