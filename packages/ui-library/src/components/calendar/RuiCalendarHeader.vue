<script setup lang="ts">
import { get, isDefined, set } from '@vueuse/core';
import { computed, inject, ref } from 'vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import {
  CalendarStateSymbol,
  type MonthYearSelection,
  type RuiCalendarState,
} from '@/components/calendar/state';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiCalendarMenu from './RuiCalendarMenu.vue';

defineOptions({
  name: 'RuiCalendarHeader',
  inheritAttrs: false,
});

const isMenuOpen = defineModel<boolean>('menu-open', { required: true });

const { viewMonth, viewYear } = defineProps<{
  title: string;
  viewMonth: number;
  viewYear: number;
}>();

const emit = defineEmits<{
  'prev-month': [];
  'next-month': [];
  'select-month': [MonthYearSelection];
}>();

const anchorEl = ref<HTMLElement>();

const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

const canGoToNext = computed<boolean>(() => {
  const { maxDate } = calendarState;
  if (!isDefined(maxDate)) {
    return true;
  }

  const date = new Date(viewYear, viewMonth);
  return date.getTime() < get(maxDate).getTime();
});

const canGoToPrev = computed<boolean>(() => {
  const { minDate } = calendarState;
  if (!isDefined(minDate)) {
    return true;
  }

  const date = new Date(viewYear, viewMonth);
  return date.getTime() > get(minDate).getTime();
});

function handleTitleClick(e: Event): void {
  set(anchorEl, e.currentTarget instanceof HTMLElement ? e.currentTarget : undefined);
  set(isMenuOpen, true);
}

function handleDateSelection(selection: MonthYearSelection): void {
  emit('select-month', selection);
}
</script>

<template>
  <div class="flex items-center justify-between px-3 py-2">
    <RuiButton
      type="button"
      icon
      size="sm"
      data-id="nav-prev"
      aria-label="Previous month"
      :disabled="!canGoToPrev"
      variant="text"
      @click.stop="emit('prev-month')"
    >
      <RuiIcon name="lu-chevron-left" />
    </RuiButton>

    <!--
      The title and its picker share the middle, so the picker's own wrapper is not a fourth flex item
      that pulls the title off center. The month and year open the picker, so they are a button.
    -->
    <div class="flex min-w-0 flex-1 justify-center">
      <button
        type="button"
        class="flex items-center gap-1 rounded-rui-control px-2 py-1 text-sm font-medium text-rui-text transition-colors hover:bg-rui-hover outline-hidden focus-visible:focus-ring"
        data-id="header-title"
        aria-haspopup="dialog"
        :aria-expanded="isMenuOpen"
        @click.stop="handleTitleClick($event)"
      >
        {{ title }}
        <RuiIcon
          name="lu-chevron-down"
          size="14"
          class="text-rui-text-secondary"
        />
      </button>

      <RuiCalendarMenu
        v-model="isMenuOpen"
        :anchor-el="anchorEl"
        :view-month="viewMonth"
        :view-year="viewYear"
        @select="handleDateSelection($event)"
      />
    </div>

    <RuiButton
      type="button"
      variant="text"
      icon
      size="sm"
      data-id="nav-next"
      aria-label="Next month"
      :disabled="!canGoToNext"
      @click.stop="emit('next-month')"
    >
      <RuiIcon name="lu-chevron-right" />
    </RuiButton>
  </div>
</template>
