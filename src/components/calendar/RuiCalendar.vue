<script setup lang="ts">
import { DatePicker as VDatePicker } from 'v-calendar';
import './RuiCalendar.scss';

export interface CalendarProps {
  maxDate?: Date | number;
  minDate?: Date | number;
  allowEmpty?: boolean;
  mode?: string;
  timeAccuracy?: number;
}

defineOptions({
  name: 'RuiCalendar',
  inheritAttrs: false,
});

const model = defineModel<Date | number | null>({ required: false });

withDefaults(defineProps<CalendarProps>(), {
  maxDate: undefined,
  minDate: undefined,
  allowEmpty: false,
  mode: 'date',
  timeAccuracy: 3,
});

const emit = defineEmits<{
  (event: 'update:pages', e: { title: string }[]): void;
}>();

const datePickerRef = useTemplateRef<InstanceType<typeof VDatePicker>>('datePickerRef');

const { isDark } = useRotkiTheme();

function move(value: Date | number) {
  get(datePickerRef)?.move(value);
}

defineExpose({
  move,
});
</script>

<template>
  <VDatePicker
    ref="datePickerRef"
    v-model="model"
    transparent
    borderless
    is24hr
    color="primary-blue"
    :max-date="maxDate"
    :min-date="minDate"
    :is-required="!allowEmpty"
    :is-dark="isDark"
    :mode="mode"
    :time-accuracy="timeAccuracy"
    @update:pages="emit('update:pages', $event)"
  />
</template>
