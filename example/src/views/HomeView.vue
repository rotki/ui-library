<script lang="ts" setup>
import {
  RuiButton,
  RuiCheckbox,
  RuiIcon,
  RuiStepper,
  StepperState,
} from '@rotki/ui-library';
import { ref, useCssModule } from 'vue';

const css = useCssModule();

const buttons = ref([
  { clicks: 0, color: 'primary', disabled: false },
  { clicks: 0, color: 'secondary', disabled: false },
  { clicks: 0, color: 'error', disabled: false },
  { clicks: 0, color: 'warning', disabled: false },
  { clicks: 0, color: 'info', disabled: false },
  { clicks: 0, color: 'success', disabled: false },

  { clicks: 0, color: 'primary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'error', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'warning', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'info', prepend: 'arrow-right-line' },
  { clicks: 0, color: 'success', prepend: 'arrow-right-line' },

  { clicks: 0, color: 'primary', append: 'arrow-right-line' },
  { clicks: 0, color: 'secondary', append: 'arrow-right-line' },
  { clicks: 0, color: 'error', append: 'arrow-right-line' },
  { clicks: 0, color: 'warning', append: 'arrow-right-line' },
  { clicks: 0, color: 'info', append: 'arrow-right-line' },
  { clicks: 0, color: 'success', append: 'arrow-right-line' },

  { clicks: 0, color: 'primary', text: true },
  { clicks: 0, color: 'secondary', text: true },
  { clicks: 0, color: 'error', text: true },
  { clicks: 0, color: 'warning', text: true },
  { clicks: 0, color: 'info', text: true },
  { clicks: 0, color: 'success', text: true },

  { clicks: 0, color: 'primary', disabled: true },
  { clicks: 0, color: 'secondary', disabled: true },
  { clicks: 0, color: 'error', disabled: true },
  { clicks: 0, color: 'warning', disabled: true },
  { clicks: 0, color: 'info', disabled: true },
  { clicks: 0, color: 'success', disabled: true },

  { clicks: 0, color: 'primary', disabled: false, tile: true },
  { clicks: 0, color: 'secondary', disabled: false, tile: true },
  { clicks: 0, color: 'error', disabled: false, tile: true },
  { clicks: 0, color: 'warning', disabled: false, tile: true },
  { clicks: 0, color: 'info', disabled: false, tile: true },
  { clicks: 0, color: 'success', disabled: false, tile: true },

  { clicks: 0, color: 'primary', text: true, tile: true },
  { clicks: 0, color: 'secondary', text: true, tile: true },
  { clicks: 0, color: 'error', text: true, tile: true },
  { clicks: 0, color: 'warning', text: true, tile: true },
  { clicks: 0, color: 'info', text: true, tile: true },
  { clicks: 0, color: 'success', text: true, tile: true },

  { clicks: 0, color: 'primary', disabled: true, tile: true },
  { clicks: 0, color: 'secondary', disabled: true, tile: true },
  { clicks: 0, color: 'error', disabled: true, tile: true },
  { clicks: 0, color: 'warning', disabled: true, tile: true },
  { clicks: 0, color: 'info', disabled: true, tile: true },
  { clicks: 0, color: 'success', disabled: true, tile: true },
]);

const icons = ref([
  { name: 'moon-line', size: 24 },
  { name: 'sun-line', size: 24 },
  { name: 'arrow-right-line', size: 24 },
]);

const checkboxes = ref([
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

  { indeterminate: true, color: 'primary' },
  { indeterminate: true, color: 'secondary' },
  { indeterminate: true, color: 'error' },
  { indeterminate: true, color: 'warning' },
  { indeterminate: true, color: 'info' },
  { indeterminate: true, color: 'success' },

  { value: false, color: 'primary', size: 'sm' },
  { value: false, color: 'secondary', size: 'sm' },
  { value: false, color: 'error', size: 'sm' },
  { value: false, color: 'warning', size: 'sm' },
  { value: false, color: 'info', size: 'sm' },
  { value: false, color: 'success', size: 'sm' },

  { value: false, color: 'primary', size: 'lg' },
  { value: false, color: 'secondary', size: 'lg' },
  { value: false, color: 'error', size: 'lg' },
  { value: false, color: 'warning', size: 'lg' },
  { value: false, color: 'info', size: 'lg' },
  { value: false, color: 'success', size: 'lg' },

  { value: false, color: 'primary', disabled: true },
  { value: false, color: 'secondary', disabled: true },
  { value: false, color: 'error', disabled: true },
  { value: false, color: 'warning', disabled: true },
  { value: false, color: 'info', disabled: true },
  { value: false, color: 'success', disabled: true },

  { value: false, color: 'primary', hint: 'Checkbox hint' },
  { value: false, color: 'secondary', hint: 'Checkbox hint' },
  { value: false, color: 'error', hint: 'Checkbox hint' },
  { value: false, color: 'warning', hint: 'Checkbox hint' },
  { value: false, color: 'info', hint: 'Checkbox hint' },
  { value: false, color: 'success', hint: 'Checkbox hint' },

  { value: false, color: 'primary', errorMessages: ['Checkbox error message'] },
  {
    value: false,
    color: 'secondary',
    errorMessages: ['Checkbox error message'],
  },
  { value: false, color: 'error', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'warning', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'info', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'success', errorMessages: ['Checkbox error message'] },
]);

const steppers = ref([
  {
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
  {
    orientation: 'vertical',
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
  {
    iconTop: true,
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
  {
    iconTop: true,
    orientation: 'vertical',
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
      {
        title: 'Error',
        description: 'Lorem ipsum',
        state: StepperState.error,
      },
      {
        title: 'Warning',
        description: 'Lorem ipsum',
        state: StepperState.warning,
      },
      {
        title: 'Info',
        description: 'Lorem ipsum',
        state: StepperState.info,
      },
      {
        title: 'Success',
        description: 'Lorem ipsum',
        state: StepperState.success,
      },
    ],
  },
  {
    custom: true,
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
    ],
  },
  {
    custom: true,
    orientation: 'vertical',
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
    ],
  },
  {
    custom: true,
    iconTop: true,
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
    ],
  },
  {
    custom: true,
    iconTop: true,
    titleClass: 'text-rui-primary',
    subtitleClass: 'text-rui-info',
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
    ],
  },
  {
    custom: true,
    iconTop: true,
    orientation: 'vertical',
    steps: [
      {
        title: 'Inactive',
        description: 'Lorem ipsum',
        state: StepperState.inactive,
      },
      {
        title: 'Active',
        description: 'Lorem ipsum',
        state: StepperState.active,
      },
      {
        title: 'Done',
        description: 'Lorem ipsum',
        state: StepperState.done,
      },
    ],
  },
]);
</script>

<template>
  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="buttons">Buttons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <rui-button
        v-for="(button, i) in buttons"
        :key="i"
        v-bind="button"
        @click="button.clicks++"
      >
        <template v-if="button.prepend" #prepend>
          <rui-icon :name="button.prepend" />
        </template>
        <span class="capitalize"> {{ button.color }} {{ button.clicks }} </span>
        <template v-if="button.append" #append>
          <rui-icon :name="button.append" />
        </template>
      </rui-button>
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="icons">Icons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <rui-icon v-for="(icon, i) in icons" :key="i" v-bind="icon" />
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="checkboxes">Checkboxes</h2>
    <div class="grid gap-1 grid-rows-2 grid-cols-6">
      <rui-checkbox
        v-for="(checkbox, i) in checkboxes"
        :key="i"
        v-bind="checkbox"
        v-model="checkbox.value"
        v-model:indeterminate="checkbox.indeterminate"
      >
        <span class="capitalize"> {{ checkbox.color }} </span>
      </rui-checkbox>
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="steppers">Steppers</h2>
    <rui-stepper
      v-for="(stepper, i) in steppers"
      :key="i"
      v-bind="stepper"
      class="mb-6"
    />
  </div>
</template>

<style lang="scss" module>
.section {
  @apply mb-14;
}
</style>
