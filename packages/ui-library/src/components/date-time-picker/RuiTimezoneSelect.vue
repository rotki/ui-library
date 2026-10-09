<script lang="ts" setup>
import type { RuiAutoCompleteClassNames } from '@/components/forms/auto-complete/auto-complete-props';
import type { MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import type { LabelPlacement } from '@/composables/defaults/field';
import { timezones } from '@/components/date-time-picker/timezones';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';

export interface RuiTimezoneSelectProps {
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  /** Where the label shows; falls back to the nearest `RuiFieldDefaults`, then the app default, then `top`. */
  labelPlacement?: LabelPlacement;
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
  label,
  labelPlacement = undefined,
  hint,
  errorMessages,
  successMessages,
  hideDetails = false,
  placeholder,
  required = false,
  classNames,
  menuOptions,
} = defineProps<RuiTimezoneSelectProps>();

const { t } = useRuiI8n();

const fieldLabel = computed<string>(() => label ?? t(RUI_I18N_KEYS.timezoneSelect.label, 'Timezone'));

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
    :label="fieldLabel"
    :label-placement="labelPlacement"
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
