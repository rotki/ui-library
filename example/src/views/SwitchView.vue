<script lang="ts" setup>
import { RuiSwitch, type SwitchProps } from '@rotki/ui-library';
import { ref } from 'vue';

type SwitchData = SwitchProps & {
  value?: boolean;
};

const switches = ref<SwitchData[]>([
  { value: false, color: 'primary' },
  { value: false, color: 'secondary' },
  { value: false, color: 'error' },
  { value: false, color: 'warning' },
  { value: false, color: 'info' },
  { value: false, color: 'success' },

  { value: true, color: 'primary' },
  { value: true, color: 'secondary' },
  { value: true, color: 'error' },
  { value: true, color: 'warning' },
  { value: true, color: 'info' },
  { value: true, color: 'success' },

  { value: false, color: 'primary', size: 'sm' },
  { value: false, color: 'secondary', size: 'sm' },
  { value: false, color: 'error', size: 'sm' },
  { value: false, color: 'warning', size: 'sm' },
  { value: false, color: 'info', size: 'sm' },
  { value: false, color: 'success', size: 'sm' },

  { value: false, color: 'primary', disabled: true },
  { value: false, color: 'secondary', disabled: true },
  { value: false, color: 'error', disabled: true },
  { value: false, color: 'warning', disabled: true },
  { value: false, color: 'info', disabled: true },
  { value: false, color: 'success', disabled: true },

  { value: true, color: 'primary', disabled: true },
  { value: true, color: 'secondary', disabled: true },
  { value: true, color: 'error', disabled: true },
  { value: true, color: 'warning', disabled: true },
  { value: true, color: 'info', disabled: true },
  { value: true, color: 'success', disabled: true },

  { value: false, color: 'primary', hint: 'Switch hint' },
  { value: false, color: 'secondary', hint: 'Switch hint' },
  { value: false, color: 'error', hint: 'Switch hint' },
  { value: false, color: 'warning', hint: 'Switch hint' },
  { value: false, color: 'info', hint: 'Switch hint' },
  { value: false, color: 'success', hint: 'Switch hint' },

  { value: false, color: 'primary', errorMessages: ['Switch error message'] },
  {
    value: false,
    color: 'secondary',
    errorMessages: 'Switch error message',
  },
  { value: false, color: 'error', errorMessages: ['Switch error message'] },
  { value: false, color: 'warning', errorMessages: 'Switch error message' },
  { value: false, color: 'info', errorMessages: ['Switch error message'] },
  { value: false, color: 'success', errorMessages: 'Switch error message' },

  {
    value: false,
    color: 'primary',
    successMessages: ['Switch success message'],
  },
  {
    value: false,
    color: 'secondary',
    successMessages: 'Switch success message',
  },
  {
    value: false,
    color: 'error',
    successMessages: ['Switch success message'],
  },
  {
    value: false,
    color: 'warning',
    successMessages: 'Switch success message',
  },
  {
    value: false,
    color: 'info',
    successMessages: ['Switch success message'],
  },
  {
    value: false,
    color: 'success',
    successMessages: 'Switch success message',
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="switches"
    >
      Switches
    </h2>
    <div class="grid gap-3 grid-rows-2 grid-cols-6">
      <RuiSwitch
        v-for="(sw, i) in switches"
        :key="i"
        v-model="sw.value"
        v-bind="sw"
      >
        <span class="capitalize"> {{ sw.color }} </span>
      </RuiSwitch>
    </div>
  </div>
</template>
