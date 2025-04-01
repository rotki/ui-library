<script setup lang="ts">
import { useCalendar } from '../../use/calendar';
import { usePage } from '../../use/page';
import CalendarDay from './CalendarDay.vue';
import CalendarHeader from './CalendarHeader.vue';

defineOptions({
  inheritAttrs: false,
});

const { page } = usePage();
const { onWeeknumberClick } = useCalendar();
</script>

<template>
  <div
    class="vc-pane"
    :class="[
      `row-${page.row}`,
      `row-from-end-${page.rowFromEnd}`,
      `column-${page.column}`,
      `column-from-end-${page.columnFromEnd}`,
    ]"
  >
    <CalendarHeader
      :page="page"
      is-lg
      hide-arrows
    />
    <div
      class="vc-weeks"
      :class="{
        [`vc-show-weeknumbers-${page.weeknumberPosition}`]:
          page.weeknumberPosition,
      }"
    >
      <div class="vc-weekdays">
        <!-- Weekday labels -->
        <div
          v-for="({ weekday, label }, i) in page.weekdays"
          :key="i"
          :class="`vc-weekday vc-weekday-${weekday}`"
        >
          {{ label }}
        </div>
      </div>
      <!-- Weeks -->
      <div
        v-for="week in page.viewWeeks"
        :key="`weeknumber-${week.weeknumber}`"
        class="vc-week"
      >
        <!-- Weeknumber -->
        <div
          v-if="page.weeknumberPosition"
          class="vc-weeknumber"
          :class="[`is-${page.weeknumberPosition}`]"
        >
          <span
            class="vc-weeknumber-content"
            @click="onWeeknumberClick(week, $event)"
          >
            {{ week.weeknumberDisplay }}
          </span>
        </div>
        <!-- Week days -->
        <CalendarDay
          v-for="day in week.days"
          :key="day.id"
          :day="day"
        />
      </div>
    </div>
  </div>
</template>
