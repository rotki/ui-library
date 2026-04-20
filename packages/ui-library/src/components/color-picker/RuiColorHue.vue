<script lang="ts" setup>
import { clamp } from '@vueuse/shared';
import { cn, tv } from '@/utils/tv';
import { roundTwoDecimal, useElementDrag } from './utils';

interface Limit {
  lowerLimit: number;
  upperLimit: number;
  availableWidth: number;
}

defineOptions({
  name: 'RuiColorHue',
  inheritAttrs: false,
});

const modelValue = defineModel<number>({ required: true });

const barElement = useTemplateRef<HTMLElement>('barElement');

const MAX_HUE = 360;
const CURSOR_WIDTH = 16;
const cursorLeft = ref<string>('');

const { handleClick, onMouseDown, onTouchStart } = useElementDrag(emitHue);

const cursorStyle = computed<{ left: string }>(() => ({
  left: get(cursorLeft),
}));

function getLimit(width: number): Limit {
  const lowerLimit = CURSOR_WIDTH / 2;
  const upperLimit = width - lowerLimit;
  const availableWidth = upperLimit - lowerLimit;

  return { lowerLimit, upperLimit, availableWidth };
}

function updatePosition(): void {
  set(cursorLeft, getCursorLeft());
}

function getCursorLeft(): string {
  const el = get(barElement);
  if (!el)
    return '0';

  const rect = el.getBoundingClientRect();
  const actualWidth = rect.width;
  const { lowerLimit, availableWidth } = getLimit(actualWidth);

  const hueVal = get(modelValue);
  const usedHue = hueVal === MAX_HUE ? MAX_HUE : hueVal % MAX_HUE;

  const percentage = roundTwoDecimal((usedHue / MAX_HUE) * (availableWidth / actualWidth) * 100);
  return `calc(${percentage}% + ${lowerLimit}px)`;
}

function emitHue(x: number): void {
  const el = get(barElement);
  if (!el)
    return;

  const rect = el.getBoundingClientRect();
  let calculatedX = x - rect.left;

  const { lowerLimit, upperLimit, availableWidth } = getLimit(rect.width);
  calculatedX = clamp(calculatedX, lowerLimit, upperLimit);

  set(modelValue, Math.round(((calculatedX - lowerLimit) / availableWidth) * MAX_HUE));
}

watch(modelValue, () => {
  updatePosition();
});

onMounted(() => {
  updatePosition();
});

const rootStyle = tv({ base: 'relative w-full h-3.5 rounded-full cursor-pointer bg-hue-spectrum' });
</script>

<template>
  <div
    ref="barElement"
    role="slider"
    aria-label="Hue"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    aria-valuemax="360"
    data-id="color-hue"
    :class="rootStyle({ class: cn($attrs.class) })"
    v-bind="{ ...$attrs, class: undefined }"
    @click="handleClick($event)"
    @mousedown="onMouseDown($event)"
    @touchstart="onTouchStart($event)"
  >
    <div
      data-id="cursor"
      class="absolute w-4 h-4 transform top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2 bg-white rounded-full"
      :style="cursorStyle"
    />
  </div>
</template>
