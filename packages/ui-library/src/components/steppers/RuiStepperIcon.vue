<script lang="ts" setup>
import type { RuiIcons } from '@/icons';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { StepperState } from '@/types/stepper';
import { tv } from '@/utils/tv';

interface StateIconProps {
  name: RuiIcons;
  class?: string;
  size?: number;
}

const { state = StepperState.inactive, index } = defineProps<{
  state?: StepperState;
  index: number;
}>();

const stateIconMap: Partial<Record<StepperState, StateIconProps>> = {
  [StepperState.done]: { name: 'lu-check', class: 'text-rui-dark-text dark:text-rui-light-text', size: 20 },
  [StepperState.success]: { name: 'lu-circle-check' },
  [StepperState.error]: { name: 'lu-circle-alert' },
  [StepperState.warning]: { name: 'lu-triangle-alert' },
  [StepperState.info]: { name: 'lu-info' },
};

const stepperIcon = tv({
  slots: {
    indicator: 'inline-flex items-center justify-center rounded-full h-6 w-6',
    label: 'text-rui-dark-text',
  },
  variants: {
    state: {
      [StepperState.inactive]: {
        indicator: 'bg-current text-xs',
        label: 'dark:text-rui-light-text-secondary',
      },
      [StepperState.active]: {
        indicator: 'bg-rui-primary text-xs',
        label: 'dark:text-rui-light-text',
      },
      [StepperState.done]: {
        indicator: 'bg-rui-primary text-xs',
        label: 'dark:text-rui-light-text',
      },
      [StepperState.error]: {},
      [StepperState.warning]: {},
      [StepperState.info]: {},
      [StepperState.success]: {},
    },
  },
  defaultVariants: { state: StepperState.inactive },
});

const ui = computed<ReturnType<typeof stepperIcon>>(() => stepperIcon({ state }));

const showLabel = computed<boolean>(() => state === StepperState.inactive || state === StepperState.active);

const iconProps = computed<StateIconProps | undefined>(() => stateIconMap[state]);
</script>

<template>
  <span :class="ui.indicator()">
    <span
      v-if="showLabel"
      :class="ui.label()"
    >
      {{ index }}
    </span>
    <RuiIcon
      v-else-if="iconProps"
      :name="iconProps.name"
      :class="iconProps.class"
      :size="iconProps.size"
    />
  </span>
</template>
