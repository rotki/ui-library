<script setup lang="ts">
import {
  CalendarStateSymbol,
  getShortMonthNames,
  type MonthYearSelection,
  type RuiCalendarState,
} from '@/components/calendar/state';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { computed, inject, ref } from 'vue';
import RuiButton from '../buttons/button/RuiButton.vue';

defineOptions({
  name: 'RuiCalendarMenu',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>();

const props = defineProps<{
  anchorEl: HTMLElement | undefined;
  viewMonth: number;
  viewYear: number;
}>();

const emit = defineEmits<{
  select: [MonthYearSelection];
}>();

const viewMode = ref<'months' | 'years'>('months');
const startYear = ref<number>(props.viewYear - 6);

const months = getShortMonthNames();

const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

const yearRange = computed<number[]>(() => {
  const years = [];
  const start = get(startYear);
  for (let i = 0; i < 12; i++) {
    years.push(start + i);
  }
  return years;
});

const title = computed<string>(() => {
  if (get(viewMode) === 'months') {
    return props.viewYear.toString();
  }
  const range = get(yearRange);
  return `${range[0]} - ${range.at(-1)}`;
});

const canGoToNext = computed<boolean>(() => {
  const { maxDate } = calendarState;
  const nextYear = props.viewYear + 1;

  if (get(viewMode) === 'months') {
    return isDefined(maxDate) && nextYear <= get(maxDate).getFullYear();
  }
  const lastYearInRange = get(yearRange).at(-1) ?? new Date().getFullYear();
  return lastYearInRange <= nextYear;
});

const canGoToPrev = computed<boolean>(() => {
  const { minDate } = calendarState;
  if (!isDefined(minDate)) {
    return true;
  }

  const previousYear = props.viewYear - 1;
  if (get(viewMode) === 'months') {
    return previousYear >= get(minDate).getFullYear();
  }
  const firstYearInRange = get(yearRange)[0] ?? new Date().getFullYear();
  return firstYearInRange >= previousYear;
});

function isDateInRange(month: number, year: number): boolean {
  const { minDate, maxDate } = calendarState;
  const date = new Date(year, month);

  if (isDefined(maxDate) && date > get(maxDate))
    return false;
  if (isDefined(minDate) && date < get(minDate))
    return false;

  return true;
}

function toggleSelection() {
  set(viewMode, get(viewMode) === 'months' ? 'years' : 'months');
}

function selectMonth(month: number) {
  emit('select', { month, year: props.viewYear });
  set(modelValue, false);
}

function selectYear(year: number) {
  emit('select', { month: props.viewMonth, year });
  set(viewMode, 'months');
}

function handleNext() {
  if (get(viewMode) === 'months') {
    const nextYear = props.viewYear + 1;
    selectYear(nextYear);
  }
  else {
    const lastYearInRange = get(yearRange).at(-1) ?? new Date().getFullYear();
    set(startYear, lastYearInRange + 1);
  }
}

function handlePrev() {
  if (get(viewMode) === 'months') {
    const previousYear = props.viewYear - 1;
    selectYear(previousYear);
  }
  else {
    const firstYearInRange = get(yearRange)[0] ?? new Date().getFullYear();
    set(startYear, firstYearInRange - 12);
  }
}
</script>

<template>
  <RuiMenu
    v-model="modelValue"
    :anchor-el="anchorEl"
    placement="bottom-start"
  >
    <div class="menu-container">
      <div class="menu-header">
        <RuiButton
          type="button"
          class="nav-button"
          icon
          :disabled="!canGoToPrev"
          variant="text"
          @click="handlePrev()"
        >
          <RuiIcon
            name="lu-chevron-left"
            size="20"
          />
        </RuiButton>

        <div
          class="flex-1 text-center cursor-pointer"
          @click="toggleSelection()"
        >
          {{ title }}
        </div>

        <RuiButton
          type="button"
          class="nav-button"
          icon
          :disabled="!canGoToNext"
          variant="text"
          @click="handleNext()"
        >
          <RuiIcon
            name="lu-chevron-right"
            size="20"
          />
        </RuiButton>
      </div>

      <div
        v-if="viewMode === 'months'"
        class="month-grid"
      >
        <RuiButton
          v-for="(month, index) in months"
          :key="month"
          :variant="index === viewMonth ? 'default' : 'text'"
          :active="index === viewMonth"
          :color="index === viewMonth ? 'primary' : undefined"
          :disabled="!isDateInRange(index, viewYear)"
          @click="selectMonth(index)"
        >
          {{ month.substring(0, 3) }}
        </RuiButton>
      </div>

      <div
        v-else-if="viewMode === 'years'"
        class="year-grid"
      >
        <RuiButton
          v-for="year in yearRange"
          :key="year"
          :variant="year === viewYear ? 'default' : 'text'"
          :active="year === viewYear"
          :color="year === viewYear ? 'primary' : undefined"
          :disabled="!isDateInRange(viewMonth, year)"
          @click="selectYear(year)"
        >
          {{ year }}
        </RuiButton>
      </div>
    </div>
  </RuiMenu>
</template>

<style scoped>
.menu-container {
  @apply w-64 shadow-lg overflow-hidden;
}

.menu-header {
  @apply flex items-center justify-center p-1 font-medium text-gray-800 dark:text-gray-200;
  @apply border-b border-rui-grey-200 dark:border-rui-grey-800 cursor-pointer hover:bg-rui-grey-100 dark:hover:bg-rui-grey-800;
}

.month-grid {
  @apply grid grid-cols-3 gap-1 p-2;
}

.year-grid {
  @apply grid grid-cols-3 gap-1 p-2;
}
</style>
