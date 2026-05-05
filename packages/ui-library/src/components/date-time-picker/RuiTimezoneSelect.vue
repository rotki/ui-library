<script lang="ts" setup>
import type { AutoCompleteVariant } from '@/components/forms/auto-complete/auto-complete-styles';
import type { MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import { timezones } from '@/components/date-time-picker/timezones';
import RuiAutoComplete, { type RuiAutoCompleteClassNames } from '@/components/forms/auto-complete/RuiAutoComplete.vue';

export interface RuiTimezoneSelectProps {
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  variant?: AutoCompleteVariant;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  placeholder?: string;
  required?: boolean;
  classNames?: RuiAutoCompleteClassNames;
  menuOptions?: MenuProps;
}

defineOptions({
  name: 'RuiTimezoneSelect',
});

const modelValue = defineModel<string | undefined>({ required: true });

const {
  disabled = false,
  readOnly = false,
  dense = false,
  clearable = false,
  label = 'Timezone',
  variant = 'outlined',
  hint,
  errorMessages,
  successMessages,
  hideDetails = false,
  placeholder,
  required = false,
  classNames,
  menuOptions,
} = defineProps<RuiTimezoneSelectProps>();

interface TimezoneOption {
  value: string;
  label: string;
}

const options: TimezoneOption[] = timezones.map(value => ({
  value,
  label: value.replace(/_/g, ' '),
}));
</script>

<template>
  <RuiAutoComplete
    v-model="modelValue"
    key-attr="value"
    text-attr="label"
    auto-select-first
    :options="options"
    :label="label"
    :variant="variant"
    :disabled="disabled"
    :read-only="readOnly"
    :dense="dense"
    :clearable="clearable"
    :hint="hint"
    :error-messages="errorMessages"
    :success-messages="successMessages"
    :hide-details="hideDetails"
    :placeholder="placeholder"
    :required="required"
    :class-names="classNames"
    :menu-options="menuOptions"
  />
</template>
