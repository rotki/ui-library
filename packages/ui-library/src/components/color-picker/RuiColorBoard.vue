<script lang="ts" setup>
import { clamp } from '@vueuse/shared';
import tinycolor from 'tinycolor2';
import { cn, tv } from '@/utils/tv';
import { type Color, useElementDrag } from './utils';

defineOptions({
  name: 'RuiColorBoard',
  inheritAttrs: false,
});

const { color } = defineProps<{
  color: Color;
}>();

const emit = defineEmits<{
  'update:board': [event: { saturation: number; brightness: number }];
}>();

const wrapper = useTemplateRef<HTMLElement>('wrapper');

const state = reactive({
  hexString: hueToHex(color.hue),
  saturation: color.saturation,
  brightness: color.brightness,
});

const cursorTop = ref<number>(0);
const cursorLeft = ref<number>(0);

const { handleClick, onMouseDown, onTouchStart } = useElementDrag(emitColor);

const cursorStyle = computed<{ top: string; left: string }>(() => ({
  top: `${get(cursorTop) * 100}%`,
  left: `${get(cursorLeft) * 100}%`,
}));

function hueToHex(hue: number): string {
  return tinycolor({ h: hue, s: 1, v: 1 }).toHexString();
}

function updatePosition(): void {
  set(cursorLeft, state.saturation);
  set(cursorTop, 1 - state.brightness);
}

function emitColor(x: number, y: number): void {
  const el = get(wrapper);
  if (!el)
    return;

  const rect = el.getBoundingClientRect();
  const { width, height, left, top } = rect;
  let calculatedX = x - left;
  let calculatedY = y - top;

  calculatedX = clamp(calculatedX, 0, width);
  calculatedY = clamp(calculatedY, 0, height);

  const saturation = calculatedX / width;
  const brightness = clamp(-(calculatedY / height) + 1, 0, 1);

  set(cursorLeft, calculatedX / width);
  set(cursorTop, calculatedY / height);

  state.saturation = saturation;
  state.brightness = brightness;

  emit('update:board', { saturation, brightness });
}

watch(
  () => [color.hue, color.saturation, color.brightness] as const,
  ([hue, saturation, brightness]) => {
    state.hexString = hueToHex(hue);
    state.saturation = saturation;
    state.brightness = brightness;
    updatePosition();
  },
);

onMounted(() => {
  updatePosition();
});

const rootStyle = tv({ base: 'relative w-full h-40 overflow-hidden cursor-pointer' });
</script>

<template>
  <div
    ref="wrapper"
    role="slider"
    aria-label="Color saturation and brightness"
    :aria-valuetext="`Saturation ${Math.round(state.saturation * 100)}%, Brightness ${Math.round(state.brightness * 100)}%`"
    data-id="color-board"
    :class="rootStyle({ class: cn($attrs.class) })"
    v-bind="{ ...$attrs, class: undefined }"
    :style="{ backgroundColor: state.hexString }"
    @click="handleClick($event)"
    @mousedown="onMouseDown($event)"
    @touchstart="onTouchStart($event)"
  >
    <div class="absolute inset-0 to-transparent bg-gradient-to-r from-white" />
    <div class="absolute inset-0 to-transparent bg-gradient-to-t from-black" />
    <div
      data-id="cursor"
      class="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow rounded-full after:content-[''] after:absolute after:inset-0 after:rounded-full after:border-2 after:border-black/15"
      :style="cursorStyle"
    />
  </div>
</template>
