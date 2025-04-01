<script setup lang="ts">
import type { Attribute, PopoverConfig } from '../../utils/attribute';
import type { DateRangeCell } from '../../utils/date/range';
import type { CalendarDay } from '../../utils/page';
import { computed } from 'vue';
import { useCalendar } from '../../use/calendar';
import { useSlot } from '../../use/slots';
import { arrayHasItems, defaults, get, last } from '../../utils/helpers';
import { popoverDirective } from '../../utils/popovers';
import CalendarSlot from './CalendarSlot.vue';

defineOptions({
  directives: { popover: popoverDirective },
  components: { CalendarSlot },
});

const props = defineProps<{
  day: CalendarDay;
}>();

const {
  locale,
  theme,
  attributeContext,
  dayPopoverId,
  onDayClick,
  onDayMouseenter,
  onDayMouseleave,
  onDayFocusin,
  onDayFocusout,
  onDayKeydown,
} = useCalendar();

const day = computed(() => props.day);
const attributeCells = computed(() => attributeContext.value.getCells(day.value));
const attributes = computed(() =>
  attributeCells.value.map(cell => cell.data as Attribute),
);
const attributedDay = computed(() => ({
  ...day.value,
  attributes: attributes.value,
  attributeCells: attributeCells.value,
}));

function processPopover(
  { data: attribute }: DateRangeCell<Attribute>,
  { popovers }: { popovers: PopoverConfig[] },
) {
  const { key, customData, popover } = attribute;
  if (!popover)
    return;
  const resolvedPopover = defaults(
    {
      key,
      customData,
      attribute,
    },
    { ...popover },
    {
      visibility: popover.label ? 'hover' : 'click',
      placement: 'bottom',
      isInteractive: !popover.label,
    },
  );
  popovers.splice(0, 0, resolvedPopover);
}

const glyphs = computed(() => {
  const result = {
    ...theme.value.prepareRender({}),
    popovers: [],
  };
  attributeCells.value.forEach((cell) => {
    theme.value.render(cell, result);
    processPopover(cell, result);
  });
  return result;
});

const highlights = computed(() => glyphs.value.highlights);
const hasHighlights = computed(() => !!arrayHasItems(highlights.value));

const content = computed(() => glyphs.value.content);

const dots = computed(() => glyphs.value.dots);
const hasDots = computed(() => !!arrayHasItems(dots.value));

const bars = computed(() => glyphs.value.bars);
const hasBars = computed(() => !!arrayHasItems(bars.value));

const popovers = computed(() => glyphs.value.popovers);
const popoverAttrs = computed(() =>
  popovers.value.map((p: any) => p.attribute),
);

const dayContentSlot = useSlot('day-content');
const dayClasses = computed(() => [
  'vc-day',
  ...day.value.classes,
  { 'vc-day-box-center-center': !dayContentSlot },
  { 'is-not-in-month': !props.day.inMonth },
]);

const dayContentProps = computed(() => {
  let tabindex;
  if (day.value.isFocusable) {
    tabindex = '0';
  }
  else {
    tabindex = '-1';
  }
  const classes = [
    'vc-day-content vc-focusable vc-focus vc-attr',
    { 'vc-disabled': day.value.isDisabled },
    get(last(highlights.value), 'contentClass'),
    get(last(content.value), 'class') || '',
  ];
  const style = {
    ...get(last(highlights.value), 'contentStyle'),
    ...get(last(content.value), 'style'),
  };
  return {
    'class': classes,
    style,
    tabindex,
    'aria-label': day.value.ariaLabel,
    'aria-disabled': !!day.value.isDisabled,
    'role': 'button',
  };
});

const dayContentEvents = computed(() => ({
  click(event: MouseEvent) {
    onDayClick(attributedDay.value, event);
  },
  mouseenter(event: MouseEvent) {
    onDayMouseenter(attributedDay.value, event);
  },
  mouseleave(event: MouseEvent) {
    onDayMouseleave(attributedDay.value, event);
  },
  focusin(event: FocusEvent) {
    onDayFocusin(attributedDay.value, event);
  },
  focusout(event: FocusEvent) {
    onDayFocusout(attributedDay.value, event);
  },
  keydown(event: KeyboardEvent) {
    onDayKeydown(attributedDay.value, event);
  },
}));

const dayPopover = computed(() => {
  if (!arrayHasItems(popovers.value))
    return null;
  return defaults(
    {
      id: dayPopoverId.value,
      data: { day, attributes: popoverAttrs.value },
    },
    ...popovers.value,
  );
});
</script>

<template>
  <div :class="dayClasses">
    <!-- Highlights -->
    <div
      v-if="hasHighlights"
      class="vc-highlights vc-day-layer"
    >
      <div
        v-for="{ key, wrapperClass, class: bgClass, style } in highlights"
        :key="key"
        :class="wrapperClass"
      >
        <div
          :class="bgClass"
          :style="style"
        />
      </div>
    </div>
    <!-- Content -->
    <CalendarSlot
      name="day-content"
      :day="day"
      :attributes="attributes"
      :attribute-cells="attributeCells"
      :day-props="dayContentProps"
      :day-events="dayContentEvents"
      :locale="locale"
    >
      <div
        v-popover="dayPopover"
        v-bind="dayContentProps"
        v-on="dayContentEvents"
      >
        {{ day.label }}
      </div>
    </CalendarSlot>
    <!-- Dots -->
    <div
      v-if="hasDots"
      class="vc-day-layer vc-day-box-center-bottom"
    >
      <div class="vc-dots">
        <span
          v-for="{ key, class: bgClass, style } in dots"
          :key="key"
          :class="bgClass"
          :style="style"
        />
      </div>
    </div>
    <!-- Bars -->
    <div
      v-if="hasBars"
      class="vc-day-layer vc-day-box-center-bottom"
    >
      <div class="vc-bars">
        <span
          v-for="{ key, class: bgClass, style } in bars"
          :key="key"
          :class="bgClass"
          :style="style"
        />
      </div>
    </div>
  </div>
</template>
