<script setup lang="ts">
import { createTimePicker } from '../../use/time-picker';
import BaseSelect from '../BaseSelect/BaseSelect.vue';
import CalendarSlot from '../Calendar/CalendarSlot.vue';

const props = defineProps<{
  position: number;
}>();

const timePicker = createTimePicker(props);
const {
  locale,
  isValid,
  date,
  hours,
  minutes,
  seconds,
  milliseconds,
  options,
  hourOptions,
  isTimeMode,
  isAM,
  isAMOptions,
  is24hr,
  showHeader,
  timeAccuracy,
} = timePicker;

defineExpose(timePicker);
</script>

<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-invalid': !isValid, 'vc-attached': !isTimeMode }]"
  >
    <CalendarSlot name="time-header">
      <div
        v-if="showHeader && date"
        class="vc-time-header"
      >
        <span class="vc-time-weekday">
          {{ locale.formatDate(date, 'WWW') }}
        </span>
        <span class="vc-time-month">
          {{ locale.formatDate(date, 'MMM') }}
        </span>
        <span class="vc-time-day">
          {{ locale.formatDate(date, 'D') }}
        </span>
        <span class="vc-time-year">
          {{ locale.formatDate(date, 'YYYY') }}
        </span>
      </div>
    </CalendarSlot>
    <div class="vc-time-select-group">
      <RuiIcon
        name="lu-clock"
        size="17"
      />
      <BaseSelect
        v-model.number="hours"
        :options="hourOptions"
        class="vc-time-select-hours"
        align-right
      />
      <template v-if="timeAccuracy > 1">
        <span class="vc-time-colon">:</span>
        <BaseSelect
          v-model.number="minutes"
          :options="options.minutes"
          class="vc-time-select-minutes"
          :align-left="timeAccuracy === 2"
        />
      </template>
      <template v-if="timeAccuracy > 2">
        <span class="vc-time-colon">:</span>
        <BaseSelect
          v-model.number="seconds"
          :options="options.seconds"
          class="vc-time-select-seconds"
          :align-left="timeAccuracy === 3"
        />
      </template>
      <template v-if="timeAccuracy > 3">
        <span class="vc-time-decimal">.</span>
        <BaseSelect
          v-model.number="milliseconds"
          :options="options.milliseconds"
          class="vc-time-select-milliseconds"
          align-left
        />
      </template>
      <BaseSelect
        v-if="!is24hr"
        v-model="isAM"
        :options="isAMOptions"
      />
    </div>
  </div>
</template>
