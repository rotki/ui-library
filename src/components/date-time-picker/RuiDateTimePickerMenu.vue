<script lang="ts" setup>
import type { TimeAccuracy } from '@/consts/time-accuracy';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import { timezones } from '@/components/date-time-picker/timezones';
import RuiAutoComplete from '@/components/forms/auto-complete/RuiAutoComplete.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTimePicker, { type TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';

defineOptions({
  name: 'RuiDateTimePickerMenu',
});

const selectedDate = defineModel<Date | undefined>('selectedDate', { required: true });
const selectedTime = defineModel<Date | undefined>('selectedTime', { required: true });
const selectedHour = defineModel<number | undefined>('selectedHour', { required: true });
const selectedMinute = defineModel<number | undefined>('selectedMinute', { required: true });
const selectedSecond = defineModel<number | undefined>('selectedSecond', { required: true });
const selectedMillisecond = defineModel<number | undefined>('selectedMillisecond', { required: true });
const timeSelection = defineModel<TimePickerSelection>('timeSelection', { required: true });
const selectedTimezone = defineModel<string | undefined>('selectedTimezone', { required: true });

defineProps<{
  accuracy: TimeAccuracy;
  maxDate?: Date | number;
  minDate?: Date | number;
}>();

const emit = defineEmits<{
  'set-now': [];
}>();

defineSlots<{
  default: () => any;
}>();

function setNow(): void {
  emit('set-now');
}
</script>

<template>
  <div class="flex divide-x divide-rui-grey-200 dark:divide-rui-grey-800">
    <RuiCalendar
      v-model="selectedDate"
      borderless
      :max-date="maxDate"
      :min-date="minDate"
    />
    <RuiTimePicker
      v-model="selectedTime"
      v-model:hour="selectedHour"
      v-model:minute="selectedMinute"
      v-model:second="selectedSecond"
      v-model:millisecond="selectedMillisecond"
      v-model:selection="timeSelection"
      :accuracy="accuracy"
      borderless
    />
    <div>
      <div class="flex gap-3 p-4 pl-3">
        <div class="flex flex-col justify-center items-center">
          <RuiButton
            variant="text"
            icon
            data-id="set-now"
            @click="setNow()"
          >
            <RuiIcon
              name="lu-clock"
              size="18"
            />
          </RuiButton>
        </div>
        <div class="flex flex-col">
          <RuiAutoComplete
            v-model="selectedTimezone"
            hide-details
            label="Timezone"
            class="pt-0 pr-0"
            variant="outlined"
            :options="timezones"
          />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
