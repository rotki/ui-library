<script lang="ts" setup>
import type { StyleValue } from 'vue';

export interface SliderTicksProps {
  count: number;
  containerClass: string;
  containerStyle: StyleValue;
  tickClass: string;
  tickStyle: StyleValue;
  hideTrack: boolean;
  highlightClass: string;
  tickClassOverride: string | undefined;
  isHighlighted: (index: number) => boolean;
}

const {
  containerClass,
  containerStyle,
  count,
  hideTrack,
  highlightClass,
  isHighlighted,
  tickClass,
  tickClassOverride,
  tickStyle,
} = defineProps<SliderTicksProps>();

/**
 * A track-less slider paints every tick the same way; with a track, the ticks
 * up to the current value are highlighted and the rest keep the override.
 */
function classesFor(index: number): (string | undefined | false)[] {
  if (hideTrack)
    return [tickClass, tickClassOverride];

  return [
    tickClass,
    isHighlighted(index) && highlightClass,
    !isHighlighted(index) && tickClassOverride,
  ];
}
</script>

<template>
  <div
    :class="containerClass"
    :style="containerStyle"
    data-id="slider-ticks"
  >
    <span
      v-for="i in count + 1"
      :key="i"
      :class="classesFor(i - 1)"
      :style="tickStyle"
    />
  </div>
</template>
