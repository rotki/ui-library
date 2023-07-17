<script lang="ts" setup>
import {
  RuiAlert,
  RuiButton,
  RuiCheckbox,
  RuiFooterStepper,
  RuiIcon,
  RuiProgress,
  RuiRadio,
  RuiRadioGroup,
  RuiRevealableTextField,
  RuiStepper,
  RuiTextField,
  StepperState,
} from '@rotki/ui-library';
import { ref, useCssModule } from 'vue';

const css = useCssModule();

const buttons = ref([
  { clicks: 0, color: 'primary' },
  { clicks: 0, color: 'secondary' },
  { clicks: 0, color: 'error' },
  { clicks: 0, color: 'warning' },
  { clicks: 0, color: 'info' },
  { clicks: 0, color: 'success' },

  { clicks: 0, color: 'primary', variant: 'outlined' },
  { clicks: 0, color: 'secondary', variant: 'outlined' },
  { clicks: 0, color: 'error', variant: 'outlined' },
  { clicks: 0, color: 'warning', variant: 'outlined' },
  { clicks: 0, color: 'info', variant: 'outlined' },
  { clicks: 0, color: 'success', variant: 'outlined' },

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

  { clicks: 0, color: 'primary', variant: 'text' },
  { clicks: 0, color: 'secondary', variant: 'text' },
  { clicks: 0, color: 'error', variant: 'text' },
  { clicks: 0, color: 'warning', variant: 'text' },
  { clicks: 0, color: 'info', variant: 'text' },
  { clicks: 0, color: 'success', variant: 'text' },

  { clicks: 0, color: 'primary', disabled: true },
  { clicks: 0, color: 'secondary', disabled: true },
  { clicks: 0, color: 'error', disabled: true },
  { clicks: 0, color: 'warning', disabled: true },
  { clicks: 0, color: 'info', disabled: true },
  { clicks: 0, color: 'success', disabled: true },

  { clicks: 0, color: 'primary', disabled: false, rounded: true },
  { clicks: 0, color: 'secondary', disabled: false, rounded: true },
  { clicks: 0, color: 'error', disabled: false, rounded: true },
  { clicks: 0, color: 'warning', disabled: false, rounded: true },
  { clicks: 0, color: 'info', disabled: false, rounded: true },
  { clicks: 0, color: 'success', disabled: false, rounded: true },

  { clicks: 0, color: 'primary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'warning', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true },
  { clicks: 0, color: 'success', variant: 'outlined', rounded: true },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'lg' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'lg',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'error', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },
  { clicks: 0, color: 'info', variant: 'outlined', rounded: true, size: 'sm' },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    rounded: true,
    size: 'sm',
  },

  { clicks: 0, color: 'primary', variant: 'text', rounded: true },
  { clicks: 0, color: 'secondary', variant: 'text', rounded: true },
  { clicks: 0, color: 'error', variant: 'text', rounded: true },
  { clicks: 0, color: 'warning', variant: 'text', rounded: true },
  { clicks: 0, color: 'info', variant: 'text', rounded: true },
  { clicks: 0, color: 'success', variant: 'text', rounded: true },

  { clicks: 0, color: 'primary', disabled: true, rounded: true },
  { clicks: 0, color: 'secondary', disabled: true, rounded: true },
  { clicks: 0, color: 'error', disabled: true, rounded: true },
  { clicks: 0, color: 'warning', disabled: true, rounded: true },
  { clicks: 0, color: 'info', disabled: true, rounded: true },
  { clicks: 0, color: 'success', disabled: true, rounded: true },

  { clicks: 0, color: 'primary', variant: 'fab' },
  { clicks: 0, color: 'secondary', variant: 'fab' },
  { clicks: 0, color: 'error', variant: 'fab' },
  { clicks: 0, color: 'warning', variant: 'fab' },
  { clicks: 0, color: 'info', variant: 'fab' },
  { clicks: 0, color: 'success', variant: 'fab' },

  {
    clicks: 0,
    color: 'primary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'fab',
    icon: true,
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    icon: true,
    variant: 'text',
    iconName: 'add-fill',
  },

  {
    clicks: 0,
    color: 'primary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'secondary',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'error',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'warning',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'info',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
  {
    clicks: 0,
    color: 'success',
    variant: 'outlined',
    icon: true,
    iconName: 'add-fill',
  },
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

const textFields = ref([
  { value: '', color: 'primary' },
  { value: '', color: 'secondary' },
  { value: '', color: 'error' },
  { value: '', color: 'warning' },
  { value: '', color: 'info' },
  { value: '', color: 'success' },

  { value: '', color: 'primary', dense: true },
  { value: '', color: 'secondary', dense: true },
  { value: '', color: 'error', dense: true },
  { value: '', color: 'warning', dense: true },
  { value: '', color: 'info', dense: true },
  { value: '', color: 'success', dense: true },

  { value: '', color: 'primary', variant: 'filled' },
  { value: '', color: 'secondary', variant: 'filled' },
  { value: '', color: 'error', variant: 'filled' },
  { value: '', color: 'warning', variant: 'filled' },
  { value: '', color: 'info', variant: 'filled' },
  { value: '', color: 'success', variant: 'filled' },

  { value: '', color: 'primary', variant: 'filled', dense: true },
  { value: '', color: 'secondary', variant: 'filled', dense: true },
  { value: '', color: 'error', variant: 'filled', dense: true },
  { value: '', color: 'warning', variant: 'filled', dense: true },
  { value: '', color: 'info', variant: 'filled', dense: true },
  { value: '', color: 'success', variant: 'filled', dense: true },

  { value: '', color: 'primary', variant: 'outlined' },
  { value: '', color: 'secondary', variant: 'outlined' },
  { value: '', color: 'error', variant: 'outlined' },
  { value: '', color: 'warning', variant: 'outlined' },
  { value: '', color: 'info', variant: 'outlined' },
  { value: '', color: 'success', variant: 'outlined' },

  { value: '', color: 'primary', variant: 'outlined', dense: true },
  { value: '', color: 'secondary', variant: 'outlined', dense: true },
  { value: '', color: 'error', variant: 'outlined', dense: true },
  { value: '', color: 'warning', variant: 'outlined', dense: true },
  { value: '', color: 'info', variant: 'outlined', dense: true },
  { value: '', color: 'success', variant: 'outlined', dense: true },

  { value: '', color: 'primary', variant: 'outlined', disabled: true },
  { value: '', color: 'secondary', variant: 'outlined', disabled: true },
  { value: '', color: 'error', variant: 'outlined', disabled: true },
  { value: '', color: 'warning', variant: 'outlined', disabled: true },
  { value: '', color: 'info', variant: 'outlined', disabled: true },
  { value: '', color: 'success', variant: 'outlined', disabled: true },

  { value: '', color: 'primary', variant: 'outlined', hint: 'Text field hint' },
  {
    value: '',
    color: 'secondary',
    variant: 'outlined',
    hint: 'Text field hint',
  },
  { value: '', color: 'error', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'warning', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'info', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'success', variant: 'outlined', hint: 'Text field hint' },

  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'secondary',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'error',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'warning',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'info',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'success',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },

  {
    value: '',
    color: 'primary',
    appendIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    appendIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    appendIcon: 'arrow-right-line',
  },

  {
    value: '',
    color: 'primary',
    prependIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    prependIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    prependIcon: 'arrow-right-line',
  },

  {
    value: '',
    color: 'primary',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    append: 'Append',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    append: 'Append',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    append: 'Append',
  },
]);

const footerSteppers = ref([
  {
    value: 1,
    pages: 5,
  },
  {
    value: 2,
    pages: 5,
    variant: 'bullet',
  },
  {
    value: 3,
    pages: 5,
    variant: 'progress',
  },
  {
    value: 4,
    pages: 5,
    variant: 'pill',
  },
]);

const progress = ref([
  {
    value: 0.4,
  },
  {
    value: 0.4,
    color: 'secondary',
  },
  {
    value: 0.4,
    color: 'inherit',
  },
  {
    value: 0.4,
    showLabel: true,
  },
  {
    value: 0.4,
    color: 'secondary',
    showLabel: true,
  },
  {
    value: 0.4,
    color: 'inherit',
    showLabel: true,
  },
  {
    value: 0.4,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'secondary',
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'inherit',
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'secondary',
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'inherit',
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'secondary',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'inherit',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    circular: true,
  },
  {
    value: 0.8,
    color: 'secondary',
    circular: true,
  },
  {
    value: 1,
    color: 'inherit',
    circular: true,
  },
  {
    value: 0.4,
    circular: true,
    showLabel: true,
  },
  {
    value: 0.8,
    color: 'secondary',
    circular: true,
    showLabel: true,
  },
  {
    value: 1,
    color: 'inherit',
    circular: true,
    showLabel: true,
  },
  {
    value: 0.4,
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'secondary',
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'inherit',
    circular: true,
    variant: 'indeterminate',
  },
]);

const revealableTextFields = ref([
  { value: '', color: 'primary', variant: 'outlined' },
  { value: '', color: 'secondary', variant: 'outlined' },
  { value: '', color: 'error', variant: 'outlined' },
  { value: '', color: 'warning', variant: 'outlined' },
  { value: '', color: 'info', variant: 'outlined' },
  { value: '', color: 'success', variant: 'outlined' },
]);

const alerts = ref([
  { type: 'primary', icon: 'information-line' },
  { type: 'secondary', icon: 'information-line' },
  { type: 'error' },
  { type: 'warning' },
  { type: 'info' },
  { type: 'success' },

  { variant: 'filled', type: 'primary', icon: 'information-line' },
  { variant: 'filled', type: 'secondary', icon: 'information-line' },
  { variant: 'filled', type: 'error' },
  { variant: 'filled', type: 'warning' },
  { variant: 'filled', type: 'info' },
  { variant: 'filled', type: 'success' },

  { variant: 'outlined', type: 'primary', icon: 'information-line' },
  {
    variant: 'outlined',
    type: 'secondary',
    icon: 'information-line',
  },
  { variant: 'outlined', type: 'error' },
  { variant: 'outlined', type: 'warning' },
  { variant: 'outlined', type: 'info' },
  { variant: 'outlined', type: 'success' },

  {
    clicks: 0,
    type: 'primary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    type: 'secondary',
    icon: 'information-line',
  },
  { clicks: 0, type: 'error' },
  { clicks: 0, type: 'warning' },
  { clicks: 0, type: 'info' },
  { clicks: 0, type: 'success' },

  {
    clicks: 0,
    closeable: true,
    type: 'primary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'secondary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'error',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'warning',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'info',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'success',
  },
]);

const radioGroups = ref([
  {
    value: 'primary',
    options: [
      { color: 'primary' },
      { color: 'secondary' },
      { color: 'error' },
      { color: 'warning' },
      { color: 'info' },
      { color: 'success' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'sm' },
      { color: 'secondary', size: 'sm' },
      { color: 'error', size: 'sm' },
      { color: 'warning', size: 'sm' },
      { color: 'info', size: 'sm' },
      { color: 'success', size: 'sm' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'lg' },
      { color: 'secondary', size: 'lg', disabled: true },
      { color: 'error', size: 'lg', disabled: true },
      { color: 'warning', size: 'lg', disabled: true },
      { color: 'info', size: 'lg', disabled: true },
      { color: 'success', size: 'lg' },
    ],
  },
]);
</script>

<template>
  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="buttons">Buttons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6 justify-items-start">
      <RuiButton
        v-for="(button, i) in buttons"
        :key="i"
        :class="{ 'w-full': !button.icon && button.variant !== 'fab' }"
        v-bind="button"
        @click="button.clicks++"
      >
        <template v-if="button.prepend" #prepend>
          <RuiIcon :name="button.prepend" />
        </template>
        <span v-if="!button.icon" class="capitalize">
          {{ button.color }} {{ button.clicks }}
        </span>
        <RuiIcon v-else :name="button.iconName" />
        <template v-if="button.append" #append>
          <RuiIcon :name="button.append" />
        </template>
      </RuiButton>
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="icons">Icons</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <RuiIcon v-for="(icon, i) in icons" :key="i" v-bind="icon" />
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="checkboxes">Checkboxes</h2>
    <div class="grid gap-1 grid-rows-2 grid-cols-6">
      <RuiCheckbox
        v-for="(checkbox, i) in checkboxes"
        :key="i"
        v-bind="checkbox"
        v-model="checkbox.value"
        v-model:indeterminate="checkbox.indeterminate"
      >
        <span class="capitalize"> {{ checkbox.color }} </span>
      </RuiCheckbox>
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="steppers">Steppers</h2>
    <RuiStepper
      v-for="(stepper, i) in steppers"
      :key="i"
      v-bind="stepper"
      class="mb-6"
    />
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="text-fields">Text Fields</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiTextField
        v-for="(field, i) in textFields"
        :key="i"
        v-model="field.value"
        v-bind="field"
        :label="field.color"
        placeholder="Placeholder"
      >
        <template v-if="field.prepend" #prepend>{{ field.prepend }}</template>
        <template v-if="field.append" #append>{{ field.append }}</template>
      </RuiTextField>
    </div>
  </div>
  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="footer-steppers">Footer Steppers</h2>
    <RuiFooterStepper
      v-for="(stepper, i) in footerSteppers"
      :key="i"
      v-model="stepper.value"
      class="mb-6"
      v-bind="stepper"
    />
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="progress">Progress</h2>
    <div class="grid gap-4 grid-cols-3">
      <RuiProgress
        v-for="(item, i) in progress"
        :key="i"
        class="mb-6"
        v-bind="item"
      />
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="text-fields">Revealable Text Fields</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiRevealableTextField
        v-for="(field, i) in revealableTextFields"
        :key="i"
        v-model="field.value"
        v-bind="field"
        label="Password"
        placeholder="Placeholder"
      />
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="alerts">Alerts</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiAlert
        v-for="(alert, i) in alerts"
        :key="i"
        v-bind="alert"
        :action-text="alert.clicks !== undefined && 'Action'"
        :title="`${alert.type} ${
          alert.clicks !== undefined ? `(${alert.clicks})` : ''
        } ${alert.closed ? '(Closed)' : ''}`"
        description="Description"
        @close="alert.closed = true"
        @action="alert.clicks !== undefined && alert.clicks++"
      />
    </div>
  </div>

  <div :class="css.section">
    <h2 class="text-h4 mb-6" data-cy="radio-buttons">Radio Buttons</h2>
    <div class="grid gap-8">
      <RuiRadioGroup
        v-for="(radioGroup, i) in radioGroups"
        :key="i"
        v-model="radioGroup.value"
        inline
        :hint="`Selected value: ${radioGroup.value}`"
      >
        <RuiRadio
          v-for="(radio, j) in radioGroup.options"
          :key="j"
          v-bind="radio"
          :value="radio.color"
        >
          <span class="capitalize"> {{ radio.color }} </span>
        </RuiRadio>
      </RuiRadioGroup>
    </div>
  </div>
</template>

<style lang="scss" module>
.section {
  @apply mb-14;
}
</style>
