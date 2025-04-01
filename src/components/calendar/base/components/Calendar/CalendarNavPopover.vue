<script setup lang="ts">
import { useCalendar } from '../../use/calendar';
import Popover from '../Popover/Popover.vue';
import CalendarNav from './CalendarNav.vue';
import CalendarPageProvider from './CalendarPageProvider.vue';
import CalendarSlot from './CalendarSlot.vue';

const { navPopoverId, color, displayMode } = useCalendar();
</script>

<template>
  <Popover
    :id="navPopoverId"
    class="vc-nav-popover-container"
    :class="[`vc-${color}`, `vc-${displayMode}`]"
  >
    <template #default="{ data }">
      <CalendarPageProvider :page="data.page">
        <CalendarSlot name="nav">
          <CalendarNav />
        </CalendarSlot>
      </CalendarPageProvider>
    </template>
  </Popover>
</template>
