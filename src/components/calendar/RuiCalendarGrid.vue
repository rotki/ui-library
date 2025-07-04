<script setup lang="ts">
import { CalendarStateSymbol, getDaysOfWeek, type RuiCalendarState } from '@/components/calendar/state';
import { get, isDefined, set } from '@vueuse/core';
import { inject, ref, watch } from 'vue';

defineOptions({
  name: 'RuiCalendarGrid',
  inheritAttrs: false,
});

const model = defineModel<Date | undefined>();

const props = defineProps<{
  viewMonth: number;
  viewYear: number;
}>();

const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

// Helper functions to reduce duplication
function createDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Pre-calculated constants
const daysOfWeek = getDaysOfWeek();
const today = new Date();
const todayKey = createDateKey(today);

// Pre-calculated arrays for performance - using refs for better control
const calendarDays = ref<Array<{
  date: Date;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isSelected: boolean;
  isToday: boolean;
  key: string;
  dayNumber: number;
}>>([]);

function createDayData(date: Date, isCurrentMonth: boolean, modelValue: Date | null | undefined, maxDateValue: Date | null, minDateValue: Date | null) {
  const key = createDateKey(date);
  return {
    date,
    isCurrentMonth,
    isInRange: isDateInRangeCheck(date, maxDateValue, minDateValue),
    isSelected: modelValue ? isDateSelectedCheck(date, modelValue) : false,
    isToday: key === todayKey,
    key,
    dayNumber: date.getDate(),
  };
}

// Pre-calculation functions using VueUse get/set
function calculateCalendarDays() {
  const firstDayOfMonth = new Date(props.viewYear, props.viewMonth, 1);
  const lastDayOfMonth = new Date(props.viewYear, props.viewMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const { maxDate, minDate } = calendarState;
  const modelValue = get(model);
  const maxDateValue = isDefined(maxDate) ? get(maxDate) : null;
  const minDateValue = isDefined(minDate) ? get(minDate) : null;

  const result = [];

  // Previous month days
  if (startingDayOfWeek > 0) {
    const prevMonthLastDay = new Date(props.viewYear, props.viewMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(props.viewYear, props.viewMonth - 1, prevMonthLastDay - i, 12, 0, 0, 0);
      result.push(createDayData(date, false, modelValue, maxDateValue, minDateValue));
    }
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(props.viewYear, props.viewMonth, i, 12, 0, 0, 0);
    result.push(createDayData(date, true, modelValue, maxDateValue, minDateValue));
  }

  // Next month days
  const totalDaysSoFar = result.length;
  const daysToAdd = 42 - totalDaysSoFar;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(props.viewYear, props.viewMonth + 1, i, 12, 0, 0, 0);
    result.push(createDayData(date, false, modelValue, maxDateValue, minDateValue));
  }

  set(calendarDays, result);
}

function isDateInRangeCheck(date: Date, maxDateValue: Date | null, minDateValue: Date | null): boolean {
  if (maxDateValue && date > maxDateValue)
    return false;
  if (minDateValue && date < minDateValue)
    return false;
  return true;
}

function isDateSelectedCheck(date: Date, modelValue: Date): boolean {
  return date.getFullYear() === modelValue.getFullYear()
    && date.getMonth() === modelValue.getMonth()
    && date.getDate() === modelValue.getDate();
}

// Initial calculation
calculateCalendarDays();

// Watchers for recalculation only when needed
watch([() => props.viewMonth, () => props.viewYear], () => {
  calculateCalendarDays();
});

watch(model, () => {
  calculateCalendarDays();
});

watch([() => calendarState.maxDate, () => calendarState.minDate], () => {
  calculateCalendarDays();
}, { deep: true });

function selectDate(dayData: { date: Date; isInRange: boolean; isSelected: boolean }) {
  if (!dayData.isInRange)
    return;

  let updateModel: Date | undefined;

  if (dayData.isSelected && calendarState.allowEmpty) {
    updateModel = undefined;
  }
  else if (isDefined(model)) {
    const modelValue = get(model);
    const newDate = new Date(dayData.date);
    newDate.setHours(modelValue.getHours());
    newDate.setMinutes(modelValue.getMinutes());
    newDate.setSeconds(modelValue.getSeconds());
    updateModel = newDate;
  }
  else {
    updateModel = new Date(dayData.date);
  }
  set(model, updateModel);
}
</script>

<template>
  <div class="calendar-grid">
    <div class="calendar-weekdays">
      <span
        v-for="day in daysOfWeek"
        :key="day"
        class="weekday-label"
      >
        {{ day }}
      </span>
    </div>

    <div class="calendar-days">
      <button
        v-for="dayData in get(calendarDays)"
        :key="dayData.key"
        type="button"
        :data-id="dayData.key"
        class="h-9 w-full flex items-center justify-center text-sm rounded-full mx-auto max-w-[2.25rem] transition-colors duration-150 ease-in-out border-none outline-none cursor-pointer focus:ring-2 focus:ring-rui-primary focus:ring-opacity-50"
        :class="[
          {
            'bg-rui-primary text-white hover:bg-rui-primary/90 dark:hover:bg-rui-primary/90': dayData.isSelected,
            'text-gray-400 dark:text-gray-600': !dayData.isCurrentMonth && !dayData.isSelected,
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': dayData.isCurrentMonth && !dayData.isSelected && dayData.isInRange,
            'opacity-50 cursor-not-allowed hover:bg-transparent': !dayData.isInRange,
            'today-indicator': dayData.isToday && !dayData.isSelected,
          },
        ]"
        :disabled="!dayData.isInRange"
        @click.stop="selectDate(dayData)"
      >
        {{ dayData.dayNumber }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid {
  @apply w-full p-2 pt-0;
}

.calendar-weekdays {
  @apply grid grid-cols-7 pb-2;
}

.weekday-label {
  @apply py-2 text-xs font-medium text-center text-gray-500 dark:text-gray-400;
}

.calendar-days {
  @apply grid grid-cols-7 gap-0.5;
}

.today-indicator {
  @apply relative;

  &:after {
    content: '';
    @apply absolute size-1 rounded-full bottom-1 left-1/2 transform -translate-x-1/2 bg-rui-primary;
  }
}
</style>
