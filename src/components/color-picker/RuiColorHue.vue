<script lang="ts" setup>
import { clamp } from '@vueuse/shared';
import { roundTwoDecimal, useElementDrag } from './utils';

defineOptions({
  name: 'RuiColorHue',
  inheritAttrs: false,
});

const modelValue = defineModel<number>({ required: true });

const barElement = ref<HTMLElement>();

const cursorWidth = 16;

function getLimit(width: number) {
  const lowerLimit = cursorWidth / 2;
  const upperLimit = width - lowerLimit;
  const availableWidth = upperLimit - lowerLimit;

  return { lowerLimit, upperLimit, availableWidth };
}

const cursorLeft = ref<string>('');

function updatePosition() {
  set(cursorLeft, getCursorLeft().toString());
}

const cursorStyle = computed(() => ({
  left: get(cursorLeft),
}));

const instance = getCurrentInstance();

function getCursorLeft() {
  if (!instance)
    return 0;

  const el = instance.vnode.el;
  const rect = el?.getBoundingClientRect();

  if (!rect)
    return 0;

  const actualWidth = rect.width;
  const { lowerLimit, availableWidth } = getLimit(actualWidth);

  const hueVal = get(modelValue);
  const usedHue = hueVal === 360 ? 360 : hueVal % 360;

  const percentage = roundTwoDecimal((usedHue / 360) * (availableWidth / actualWidth) * 100);
  return `calc(${percentage}% + ${lowerLimit}px)`;
}

function emitHue(x: number) {
  if (!instance)
    return;

  const el = instance.vnode.el;
  const rect = el?.getBoundingClientRect();

  if (!rect)
    return;

  let calculatedX = x - rect.left;

  const { lowerLimit, upperLimit, availableWidth } = getLimit(rect.width);
  calculatedX = clamp(calculatedX, lowerLimit, upperLimit);

  set(modelValue, Math.round(((calculatedX - lowerLimit) / availableWidth) * 360));
}

const {
  handleClick,
  onMouseDown,
} = useElementDrag(emitHue);

onMounted(() => {
  updatePosition();
});

watch(modelValue, () => {
  updatePosition();
});
</script>

<template>
  <div
    ref="barElement"
    :class="$style.bar"
    class="rui-color-hue"
    v-bind="$attrs"
    @click="handleClick($event)"
    @mousedown="onMouseDown($event)"
  >
    <div
      :class="$style.cursor"
      :style="cursorStyle"
    />
  </div>
</template>

<style lang="scss" module>
.bar {
  @apply relative w-full h-3.5 rounded-full cursor-pointer;

  background: linear-gradient(
    to right,
    rgb(255, 0, 0) 0%,
    rgb(255, 255, 0) 16.66%,
    rgb(0, 255, 0) 33.33%,
    rgb(0, 255, 255) 50%,
    rgb(0, 0, 255) 66.66%,
    rgb(255, 0, 255) 83.33%,
    rgb(255, 0, 0) 100%
  );
}

.cursor {
  @apply absolute w-4 h-4 transform top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2 bg-white rounded-full;
}
</style>
