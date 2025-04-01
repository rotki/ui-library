<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useCalendar } from '../../use/calendar';
import { usePage } from '../../use/page';
import { head, last, onSpaceOrEnter } from '../../utils/helpers';
import CalendarSlot from './CalendarSlot.vue';

export type IQuerySelector = Pick<HTMLElement, 'querySelector'>;

const { masks, move } = useCalendar();
const { page, getMonthItems, getYearItems } = usePage();

const monthMode = ref(true);
const yearGroupCount = 12;

const selectedYear = ref(page.value.year);
const selectedYearGroup = ref(getYearGroupIndex(page.value.year));
const navContainer = ref<IQuerySelector | null>(null);

function focusFirstItem() {
  // Use setTimeout instead of $nextTick so it plays nice with popperjs
  setTimeout(() => {
    if (navContainer.value == null)
      return;
    // Set focus on the first enabled nav item
    const focusableEl = navContainer.value.querySelector(
      '.vc-nav-item:not(:disabled)',
    ) as HTMLElement;
    if (focusableEl) {
      focusableEl.focus();
    }
  }, 10);
}

function getYearGroupIndex(year: number) {
  return Math.floor(year / yearGroupCount);
}

function toggleMode() {
  monthMode.value = !monthMode.value;
}

function getStartYear(groupIndex: number) {
  return groupIndex * yearGroupCount;
}

function getEndYear(groupIndex: number) {
  return yearGroupCount * (groupIndex + 1) - 1;
}

// #region Move methods

function movePrevYear() {
  selectedYear.value--;
}

function moveNextYear() {
  selectedYear.value++;
}

function movePrevYearGroup() {
  selectedYearGroup.value--;
}

function moveNextYearGroup() {
  selectedYearGroup.value++;
}

// #endregion Move methods

const monthItems = computed(() =>
  getMonthItems(selectedYear.value, masks.value.navMonths).map(item => ({
    ...item,
    click: () =>
      move(
        { month: item.month, year: item.year },
        { position: page.value.position },
      ),
  })),
);

const prevMonthItems = computed(() =>
  getMonthItems(selectedYear.value - 1, masks.value.navMonths),
);

const prevMonthItemsEnabled = computed(() =>
  prevMonthItems.value.some(i => !i.isDisabled),
);

const nextMonthItems = computed(() =>
  getMonthItems(selectedYear.value + 1, masks.value.navMonths),
);

const nextMonthItemsEnabled = computed(() =>
  nextMonthItems.value.some(i => !i.isDisabled),
);

const yearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value),
    getEndYear(selectedYearGroup.value),
  ).map(item => ({
    ...item,
    click: () => {
      selectedYear.value = item.year;
      monthMode.value = true;
      focusFirstItem();
    },
  })),
);

const prevYearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value - 1),
    getEndYear(selectedYearGroup.value - 1),
  ),
);

const prevYearItemsEnabled = computed(() =>
  prevYearItems.value.some(i => !i.isDisabled),
);

const nextYearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value + 1),
    getEndYear(selectedYearGroup.value + 1),
  ),
);

const nextYearItemsEnabled = computed(() =>
  nextYearItems.value.some(i => !i.isDisabled),
);

const activeItems = computed(() =>
  monthMode.value ? monthItems.value : yearItems.value,
);

const prevItemsEnabled = computed(() =>
  monthMode.value ? prevMonthItemsEnabled.value : prevYearItemsEnabled.value,
);

const nextItemsEnabled = computed(() =>
  monthMode.value ? nextMonthItemsEnabled.value : nextYearItemsEnabled.value,
);

const firstYear = computed(() => head(yearItems.value.map(i => i.year)));

const lastYear = computed(() => last(yearItems.value.map(i => i.year)));

const title = computed(() => monthMode.value
  ? selectedYear.value
  : `${firstYear.value} - ${lastYear.value}`);

watchEffect(() => {
  selectedYear.value = page.value.year;
  focusFirstItem();
});

function movePrev() {
  if (!prevItemsEnabled.value)
    return;
  if (monthMode.value) {
    movePrevYear();
  }
  movePrevYearGroup();
}

function moveNext() {
  if (!nextItemsEnabled.value)
    return;
  if (monthMode.value) {
    moveNextYear();
  }
  moveNextYearGroup();
}

watch(
  () => selectedYear.value,
  val => (selectedYearGroup.value = getYearGroupIndex(val)),
);

onMounted(() => focusFirstItem());
</script>

<template>
  <!-- Nav panel -->
  <div
    ref="navContainer"
    class="vc-nav-container"
  >
    <!-- Nav header -->
    <div class="vc-nav-header">
      <!-- Move prev button -->
      <button
        type="button"
        class="vc-nav-arrow is-left vc-focus"
        :disabled="!prevItemsEnabled"
        @click="movePrev()"
        @keydown="onSpaceOrEnter($event, movePrev)"
      >
        <CalendarSlot
          name="nav-prev-button"
          :move="movePrev"
          :disabled="!prevItemsEnabled"
        >
          <RuiIcon
            name="lu-chevron-left"
            size="24"
          />
        </CalendarSlot>
      </button>
      <!-- Mode switch button -->
      <button
        type="button"
        class="vc-nav-title vc-focus"
        @click="toggleMode()"
        @keydown="onSpaceOrEnter($event, toggleMode)"
      >
        {{ title }}
      </button>
      <!-- Move next button -->
      <button
        type="button"
        class="vc-nav-arrow is-right vc-focus"
        :disabled="!nextItemsEnabled"
        @click="moveNext()"
        @keydown="onSpaceOrEnter($event, moveNext)"
      >
        <CalendarSlot
          name="nav-next-button"
          :move="moveNext"
          :disabled="!nextItemsEnabled"
        >
          <RuiIcon
            name="lu-chevron-right"
            size="24"
          />
        </CalendarSlot>
      </button>
    </div>
    <!-- Navigation items -->
    <div class="vc-nav-items">
      <button
        v-for="item in activeItems"
        :key="item.label"
        type="button"
        :data-id="item.id"
        :aria-label="item.ariaLabel"
        class="vc-nav-item vc-focus"
        :class="[
          item.isActive ? 'is-active' : item.isCurrent ? 'is-current' : '',
        ]"
        :disabled="item.isDisabled"
        @click="item.click"
        @keydown="onSpaceOrEnter($event, item.click)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
