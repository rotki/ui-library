<script setup lang="ts">
import type { Page } from '../../utils/page';
import { computed } from 'vue';
import { RuiIcon } from '~/src';
import { useCalendar } from '../../use/calendar';
import { popoverDirective as vPopover } from '../../utils/popovers';
import CalendarSlot from './CalendarSlot.vue';

const props = defineProps<{
  page: Page;
  layout?: string;
  isLg?: boolean;
  isXl?: boolean;
  is2xl?: boolean;
  hideTitle?: boolean;
  hideArrows?: boolean;
}>();

const {
  navPopoverId,
  navVisibility,
  canMovePrev,
  movePrev,
  canMoveNext,
  moveNext,
} = useCalendar();

const navPlacement = computed(() => {
  switch (props.page.titlePosition) {
    case 'left':
      return 'bottom-start';
    case 'right':
      return 'bottom-end';
    default:
      return 'bottom';
  }
});
const navPopoverOptions = computed(() => {
  const { page } = props;
  return {
    id: navPopoverId.value,
    visibility: navVisibility.value,
    placement: navPlacement.value,
    modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom'] } }],
    data: { page },
    isInteractive: true,
  };
});
const titleLeft = computed(() => props.page.titlePosition.includes('left'));
const titleRight = computed(() => props.page.titlePosition.includes('right'));
const layout_ = computed(() => {
  if (props.layout)
    return props.layout;
  if (titleLeft.value)
    return 'tu-pn';
  if (titleRight.value)
    return 'pn-tu';
  return 'p-tu-n;';
});
const show = computed(() => ({
  prev: layout_.value.includes('p') && !props.hideArrows,
  title: layout_.value.includes('t') && !props.hideTitle,
  next: layout_.value.includes('n') && !props.hideArrows,
}));
const gridStyle = computed(() => {
  const gridTemplateColumns = layout_.value
    .split('')
    .map((l) => {
      switch (l) {
        case 'p':
          return '[prev] auto';
        case 'n':
          return '[next] auto';
        case 't':
          return '[title] auto';
        case '-':
          return '1fr';
        default:
          return '';
      }
    })
    .join(' ');
  return { gridTemplateColumns };
});
</script>

<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <button
      v-if="show.prev"
      type="button"
      class="vc-arrow vc-prev vc-focus"
      :disabled="!canMovePrev"
      @click="movePrev()"
      @keydown.space.enter="movePrev()"
    >
      <CalendarSlot
        name="header-prev-button"
        :disabled="!canMovePrev"
      >
        <RuiIcon
          name="lu-chevron-left"
          size="24"
        />
      </CalendarSlot>
    </button>
    <div
      v-if="show.title"
      class="vc-title-wrapper"
    >
      <CalendarSlot name="header-title-wrapper">
        <button
          v-popover="navPopoverOptions"
          type="button"
          class="vc-title"
        >
          <CalendarSlot
            name="header-title"
            :title="page.title"
          >
            <span>{{ page.title }}</span>
          </CalendarSlot>
        </button>
      </CalendarSlot>
    </div>
    <button
      v-if="show.next"
      type="button"
      class="vc-arrow vc-next vc-focus"
      :disabled="!canMoveNext"
      @click="moveNext()"
      @keydown.space.enter="moveNext()"
    >
      <CalendarSlot
        name="header-next-button"
        :disabled="!canMoveNext"
      >
        <RuiIcon
          name="lu-chevron-right"
          size="24"
        />
      </CalendarSlot>
    </button>
  </div>
</template>
