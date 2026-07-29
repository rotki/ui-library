<script setup lang="ts">
import { get, isDefined, set } from '@vueuse/core';
import { computed, inject, nextTick, ref, useTemplateRef, watch } from 'vue';
import {
  CalendarStateSymbol,
  getDaysOfWeek,
  type RuiCalendarState,
} from '@/components/calendar/state';
import { tv } from '@/utils/tv';

defineOptions({
  name: 'RuiCalendarGrid',
  inheritAttrs: false,
});

const model = defineModel<Date | undefined>();

const { viewMonth, viewYear } = defineProps<{
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

const dayButton = tv({
  base: 'h-9 w-full flex items-center justify-center text-sm rounded-full mx-auto max-w-[2.25rem] transition-colors duration-150 ease-in-out border-none outline-none cursor-pointer focus:ring-2 focus:ring-rui-primary focus:ring-opacity-50',
  variants: {
    selected: {
      true: 'bg-rui-primary text-white hover:bg-rui-primary/90 dark:hover:bg-rui-primary/90',
    },
    currentMonth: {
      true: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
      false: 'text-gray-400 dark:text-gray-600',
    },
    inRange: {
      false: 'opacity-50 cursor-not-allowed hover:bg-transparent',
    },
    today: {
      true: `relative after:content-[''] after:absolute after:size-1 after:rounded-full after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:bg-rui-primary`,
    },
  },
  compoundVariants: [
    {
      selected: true,
      class: 'text-white dark:text-white',
    },
  ],
});

// Pre-calculated arrays for performance - using refs for better control
const calendarDays = ref<
  Array<{
    date: Date;
    isCurrentMonth: boolean;
    isInRange: boolean;
    isSelected: boolean;
    isToday: boolean;
    key: string;
    dayNumber: number;
  }>
>([]);

function createDayData(
  date: Date,
  isCurrentMonth: boolean,
  modelValue: Date | null | undefined,
  maxDateValue: Date | null,
  minDateValue: Date | null,
): {
  date: Date;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isSelected: boolean;
  isToday: boolean;
  key: string;
  dayNumber: number;
} {
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
function calculateCalendarDays(): void {
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const { maxDate, minDate } = calendarState;
  const modelValue = get(model);
  const maxDateValue = isDefined(maxDate) ? get(maxDate) : null;
  const minDateValue = isDefined(minDate) ? get(minDate) : null;

  const result = [];

  // Previous month days
  if (startingDayOfWeek > 0) {
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(viewYear, viewMonth - 1, prevMonthLastDay - i, 12, 0, 0, 0);
      result.push(createDayData(date, false, modelValue, maxDateValue, minDateValue));
    }
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(viewYear, viewMonth, i, 12, 0, 0, 0);
    result.push(createDayData(date, true, modelValue, maxDateValue, minDateValue));
  }

  // Next month days
  const totalDaysSoFar = result.length;
  const daysToAdd = 42 - totalDaysSoFar;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(viewYear, viewMonth + 1, i, 12, 0, 0, 0);
    result.push(createDayData(date, false, modelValue, maxDateValue, minDateValue));
  }

  set(calendarDays, result);
}

function isDateInRangeCheck(
  date: Date,
  maxDateValue: Date | null,
  minDateValue: Date | null,
): boolean {
  if (maxDateValue && date > maxDateValue)
    return false;
  if (minDateValue && date < minDateValue)
    return false;
  return true;
}

function isDateSelectedCheck(date: Date, modelValue: Date): boolean {
  return (
    date.getFullYear() === modelValue.getFullYear() &&
    date.getMonth() === modelValue.getMonth() &&
    date.getDate() === modelValue.getDate()
  );
}

function selectDate(dayData: { date: Date; isInRange: boolean; isSelected: boolean }): void {
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

// --- keyboard navigation -------------------------------------------------
// The grid is a roving tabindex: one day is tabbable and the arrows move it,
// so crossing the calendar costs one Tab instead of 42.

const gridRef = useTemplateRef<HTMLDivElement>('grid');
const activeKey = ref<string>('');

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });

const KEY_DAY_OFFSETS: Record<string, number> = {
  ArrowDown: 7,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
};

const weeks = computed<Array<typeof calendarDays.value>>(() => {
  const days = get(calendarDays);
  const result = [];
  for (let i = 0; i < days.length; i += 7)
    result.push(days.slice(i, i + 7));
  return result;
});

function preferredActiveKey(): string {
  const days = get(calendarDays);
  const selected = days.find(day => day.isSelected && day.isInRange);
  const todayInView = days.find(day => day.isToday && day.isCurrentMonth && day.isInRange);
  const firstSelectable = days.find(day => day.isCurrentMonth && day.isInRange);
  return (selected ?? todayInView ?? firstSelectable ?? days[0])?.key ?? '';
}

function syncActiveKey(): void {
  const days = get(calendarDays);
  if (!days.some(day => day.key === get(activeKey)))
    set(activeKey, preferredActiveKey());
}

function keyToDate(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function focusKey(key: string): void {
  set(activeKey, key);
  nextTick(() => {
    get(gridRef)?.querySelector<HTMLButtonElement>(`[data-id="${key}"]`)?.focus();
  });
}

function moveTo(target: Date): void {
  const { maxDate, minDate } = calendarState;
  const maxDateValue = isDefined(maxDate) ? get(maxDate) : null;
  const minDateValue = isDefined(minDate) ? get(minDate) : null;

  // min/max bound a contiguous range, so a blocked step means the edge is here
  if (!isDateInRangeCheck(target, maxDateValue, minDateValue))
    return;

  const key = createDateKey(target);

  // Landing on another month turns the page, even when that day happens to be
  // rendered as a spill day in the current window — otherwise the header and
  // the focused day disagree about which month is being edited.
  if (target.getMonth() === viewMonth && target.getFullYear() === viewYear) {
    focusKey(key);
    return;
  }

  set(calendarState.viewMonth, target.getMonth());
  set(calendarState.viewYear, target.getFullYear());
  nextTick(() => {
    focusKey(key);
  });
}

function onKeydown(event: KeyboardEvent): void {
  const active = get(activeKey);
  if (!active)
    return;

  const current = keyToDate(active);
  const dayOffset = KEY_DAY_OFFSETS[event.key];

  if (dayOffset !== undefined) {
    event.preventDefault();
    moveTo(new Date(current.getFullYear(), current.getMonth(), current.getDate() + dayOffset, 12, 0, 0, 0));
  }
  else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    const offset = event.key === 'Home' ? -current.getDay() : 6 - current.getDay();
    moveTo(new Date(current.getFullYear(), current.getMonth(), current.getDate() + offset, 12, 0, 0, 0));
  }
  else if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault();
    const delta = event.key === 'PageUp' ? -1 : 1;
    moveTo(new Date(current.getFullYear(), current.getMonth() + delta, current.getDate(), 12, 0, 0, 0));
  }
}

// Initial calculation
calculateCalendarDays();
syncActiveKey();

// Watchers for recalculation only when needed
watch([() => viewMonth, () => viewYear], () => {
  calculateCalendarDays();
  syncActiveKey();
});

watch(model, () => {
  calculateCalendarDays();
  syncActiveKey();
});

watch(
  [() => calendarState.maxDate, () => calendarState.minDate],
  () => {
    calculateCalendarDays();
    syncActiveKey();
  },
);
</script>

<template>
  <div class="w-full p-2 pt-0">
    <div
      ref="grid"
      role="grid"
      class="grid grid-cols-7 gap-0.5"
      @keydown="onKeydown($event)"
    >
      <div
        role="row"
        class="contents"
      >
        <span
          v-for="day in daysOfWeek"
          :key="day"
          role="columnheader"
          class="py-2 pb-4 text-xs font-medium text-center text-gray-500 dark:text-gray-400"
        >
          {{ day }}
        </span>
      </div>

      <div
        v-for="(week, index) in weeks"
        :key="index"
        role="row"
        class="contents"
      >
        <button
          v-for="dayData in week"
          :key="dayData.key"
          type="button"
          role="gridcell"
          :data-id="dayData.key"
          :data-current-month="dayData.isCurrentMonth || undefined"
          :data-selected="dayData.isSelected || undefined"
          :data-today="(dayData.isToday && !dayData.isSelected) || undefined"
          :class="dayButton({
            selected: dayData.isSelected,
            currentMonth: !dayData.isSelected && dayData.isCurrentMonth,
            inRange: dayData.isInRange,
            today: dayData.isToday && !dayData.isSelected,
          })"
          :disabled="!dayData.isInRange"
          :tabindex="dayData.key === activeKey ? 0 : -1"
          :aria-label="dayLabelFormatter.format(dayData.date)"
          :aria-selected="dayData.isSelected"
          :aria-current="dayData.isToday ? 'date' : undefined"
          @click.stop="selectDate(dayData)"
          @focus="activeKey = dayData.key"
        >
          {{ dayData.dayNumber }}
        </button>
      </div>
    </div>
  </div>
</template>
