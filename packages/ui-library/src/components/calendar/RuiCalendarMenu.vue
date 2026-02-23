<script setup lang="ts">
import { get, isDefined, set } from '@vueuse/core';
import { ref, watch } from 'vue';
import {
  CalendarStateSymbol,
  getShortMonthNames,
  type MonthYearSelection,
  type RuiCalendarState,
} from '@/components/calendar/state';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiButton from '../buttons/button/RuiButton.vue';

defineOptions({
  name: 'RuiCalendarMenu',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>();

const { viewMonth, viewYear } = defineProps<{
  anchorEl: HTMLElement | undefined;
  viewMonth: number;
  viewYear: number;
}>();

const emit = defineEmits<{
  select: [MonthYearSelection];
}>();

// Core reactive state - minimal
const viewMode = ref<'months' | 'years'>('months');
const startYear = ref<number>(viewYear - 6);

// Pre-calculated constants
const months = getShortMonthNames();
const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

// Pre-calculated arrays for performance - using refs for better control
const yearRange = ref<number[]>([]);
const monthsInRange = ref<boolean[]>([]);
const yearsInRange = ref<boolean[]>([]);
const title = ref<string>('');
const canGoToNext = ref<boolean>(true);
const canGoToPrev = ref<boolean>(true);

// Pre-calculation functions using VueUse get/set
function calculateYearRange(): void {
  const start = get(startYear);
  set(
    yearRange,
    Array.from({ length: 12 }, (_, i) => start + i),
  );
}

function calculateTitle(): void {
  if (get(viewMode) === 'months') {
    set(title, viewYear.toString());
  }
  else {
    const range = get(yearRange);
    set(title, `${range[0]} - ${range.at(-1)}`);
  }
}

function calculateNavigation(): void {
  const { maxDate, minDate } = calendarState;
  const mode = get(viewMode);

  if (mode === 'months') {
    const nextYear = viewYear + 1;
    const previousYear = viewYear - 1;

    set(canGoToNext, !isDefined(maxDate) || nextYear <= get(maxDate).getFullYear());
    set(canGoToPrev, !isDefined(minDate) || previousYear >= get(minDate).getFullYear());
  }
  else {
    const lastYearInRange = get(startYear) + 11;
    const firstYearInRange = get(startYear);

    // Check if we can navigate to the next range of years
    const nextRangeStart = lastYearInRange + 1;
    set(canGoToNext, !isDefined(maxDate) || nextRangeStart <= get(maxDate).getFullYear());

    // Check if we can navigate to the previous range of years
    const prevRangeEnd = firstYearInRange - 1;
    set(canGoToPrev, !isDefined(minDate) || prevRangeEnd >= get(minDate).getFullYear());
  }
}

function calculateMonthsInRange(): void {
  const { minDate, maxDate } = calendarState;
  const currentYear = viewYear;
  const result = new Array(12).fill(true);

  if (isDefined(minDate) || isDefined(maxDate)) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month);
      if (isDefined(maxDate) && date > get(maxDate)) {
        result[month] = false;
      }
      if (isDefined(minDate) && date < get(minDate)) {
        result[month] = false;
      }
    }
  }

  set(monthsInRange, result);
}

function calculateYearsInRange(): void {
  const { minDate, maxDate } = calendarState;
  const range = get(yearRange);
  const currentMonth = viewMonth;

  if (!isDefined(minDate) && !isDefined(maxDate)) {
    set(yearsInRange, new Array(range.length).fill(true));
    return;
  }

  const result = range.map((year) => {
    const date = new Date(year, currentMonth);
    if (isDefined(maxDate) && date > get(maxDate)) {
      return false;
    }
    return !isDefined(minDate) || date >= get(minDate);
  });

  set(yearsInRange, result);
}

function toggleSelection(): void {
  set(viewMode, get(viewMode) === 'months' ? 'years' : 'months');
}

function selectMonth(month: number): void {
  if (!get(monthsInRange)[month])
    return;
  emit('select', { month, year: viewYear });
  set(modelValue, false);
}

function selectYear(year: number): void {
  const yearIndex = get(yearRange).indexOf(year);
  if (yearIndex === -1 || !get(yearsInRange)[yearIndex])
    return;

  emit('select', { month: viewMonth, year });
  set(viewMode, 'months');
}

function handleNext(): void {
  if (get(viewMode) === 'months') {
    const nextYear = viewYear + 1;
    // Emit directly - navigation is already constrained by canGoToNext
    emit('select', { month: viewMonth, year: nextYear });
  }
  else {
    const lastYearInRange = get(startYear) + 11;
    set(startYear, lastYearInRange + 1);
  }
}

function handlePrev(): void {
  if (get(viewMode) === 'months') {
    const previousYear = viewYear - 1;
    // Emit directly - navigation is already constrained by canGoToPrev
    emit('select', { month: viewMonth, year: previousYear });
  }
  else {
    const firstYearInRange = get(startYear);
    set(startYear, firstYearInRange - 12);
  }
}

// Initial calculations
calculateYearRange();
calculateTitle();
calculateNavigation();
calculateMonthsInRange();
calculateYearsInRange();

// Watchers for recalculation only when needed
watch(startYear, () => {
  calculateYearRange();
  calculateTitle();
  calculateNavigation();
  calculateYearsInRange();
});

watch(viewMode, () => {
  calculateTitle();
  calculateNavigation();
});

watch(
  () => viewYear,
  () => {
    calculateTitle();
    calculateNavigation();
    calculateMonthsInRange();
    calculateYearsInRange();
  },
);

watch(
  () => viewMonth,
  () => {
    calculateYearsInRange();
  },
);
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
          :disabled="!get(canGoToPrev)"
          variant="text"
          @click.stop="handlePrev()"
        >
          <RuiIcon
            name="lu-chevron-left"
            size="20"
          />
        </RuiButton>

        <div
          class="flex-1 text-center cursor-pointer"
          @click.stop="toggleSelection()"
        >
          {{ get(title) }}
        </div>

        <RuiButton
          type="button"
          class="nav-button"
          icon
          :disabled="!get(canGoToNext)"
          variant="text"
          @click.stop="handleNext()"
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
        <button
          v-for="(month, index) in months"
          :key="month"
          type="button"
          class="h-9 w-full flex items-center justify-center text-sm font-medium rounded-md transition-colors duration-150 ease-in-out border-none outline-none cursor-pointer focus:ring-2 focus:ring-rui-primary focus:ring-opacity-50"
          :class="[
            {
              'bg-rui-primary text-white hover:bg-rui-primary-darker active:bg-rui-primary-darker dark:bg-rui-primary dark:text-white dark:hover:bg-rui-primary-darker':
                index === viewMonth && get(monthsInRange)[index],
              'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400':
                index === viewMonth && !get(monthsInRange)[index],
              'text-gray-700 bg-transparent hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600':
                index !== viewMonth && get(monthsInRange)[index],
              'opacity-50 cursor-not-allowed bg-transparent hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent pointer-events-none text-gray-400 dark:text-gray-600':
                !get(monthsInRange)[index],
            },
          ]"
          :disabled="!get(monthsInRange)[index]"
          @click.stop="selectMonth(index)"
        >
          {{ month.substring(0, 3) }}
        </button>
      </div>

      <div
        v-else-if="viewMode === 'years'"
        class="year-grid"
      >
        <button
          v-for="(year, index) in yearRange"
          :key="year"
          type="button"
          class="h-9 w-full flex items-center justify-center text-sm font-medium rounded-md transition-colors duration-150 ease-in-out border-none outline-none cursor-pointer focus:ring-2 focus:ring-rui-primary focus:ring-opacity-50"
          :class="[
            {
              'bg-rui-primary text-white hover:bg-rui-primary-darker active:bg-rui-primary-darker dark:bg-rui-primary dark:text-white dark:hover:bg-rui-primary-darker':
                year === viewYear && get(yearsInRange)[index],
              'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400':
                year === viewYear && !get(yearsInRange)[index],
              'text-gray-700 bg-transparent hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600':
                year !== viewYear && get(yearsInRange)[index],
              'opacity-50 cursor-not-allowed bg-transparent hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent pointer-events-none text-gray-400 dark:text-gray-600':
                !get(yearsInRange)[index],
            },
          ]"
          :disabled="!get(yearsInRange)[index]"
          @click.stop="selectYear(year)"
        >
          {{ year }}
        </button>
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
