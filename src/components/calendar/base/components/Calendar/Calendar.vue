<script lang="ts">
import { defineComponent } from 'vue';
import { createCalendar, emitsDef, propsDef } from '../../use/calendar';
import CalendarDayPopover from './CalendarDayPopover.vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarNavPopover from './CalendarNavPopover.vue';
import CalendarPage from './CalendarPage.vue';
import CalendarPageProvider from './CalendarPageProvider.vue';
import CalendarSlot from './CalendarSlot.vue';

export default defineComponent({
  components: {
    CalendarHeader,
    CalendarPage,
    CalendarNavPopover,
    CalendarDayPopover,
    CalendarPageProvider,
    CalendarSlot,
  },
  props: propsDef,
  emit: emitsDef,
  // eslint-disable-next-line vue/component-api-style
  setup(props, { emit, slots }) {
    return createCalendar(props, { emit, slots });
  },
});
</script>

<template>
  <div
    v-bind="$attrs"
    data-helptext="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
    class="vc-container"
    :class="[
      `vc-${view}`,
      `vc-${color}`,
      `vc-${displayMode}`,
      {
        'vc-expanded': expanded,
        'vc-bordered': !borderless,
        'vc-transparent': transparent,
      },
    ]"
    @mouseup.prevent
  >
    <!-- Calendar Container -->
    <div
      class="vc-pane-container"
      :class="[{ 'in-transition': inTransition }]"
    >
      <div class="vc-pane-header-wrapper">
        <CalendarHeader
          v-if="firstPage"
          :page="firstPage!"
          is-lg
          hide-title
        />
      </div>
      <Transition
        :name="`vc-${transitionName}`"
        @before-enter="onTransitionBeforeEnter()"
        @after-enter="onTransitionAfterEnter()"
      >
        <!-- Calendar Layout -->
        <div
          :key="pages[0].id"
          class="vc-pane-layout"
          :style="{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }"
        >
          <!-- Calendar pages -->
          <CalendarPageProvider
            v-for="page in pages"
            :key="page.id"
            :page="page"
          >
            <CalendarSlot
              name="page"
              :page="page"
            >
              <CalendarPage />
            </CalendarSlot>
          </CalendarPageProvider>
        </div>
      </Transition>
      <CalendarSlot name="footer" />
    </div>
  </div>
  <!-- Day popover -->
  <CalendarDayPopover />
  <!-- Nav popover -->
  <CalendarNavPopover />
</template>
