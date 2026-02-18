<script setup lang="ts">
import { computed, onMounted, ref, type StyleValue, watch } from 'vue';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { assert } from '@/utils/assert';

export type TimePickerSelection = 'hour' | 'minute' | 'second' | 'millisecond';

export interface RuiTimePickerProps {
  accuracy?: TimeAccuracy;
  borderless?: boolean;
}

const modelValue = defineModel<Date | undefined>({ required: true });

const selectedHour = defineModel<number | undefined>('hour');
const selectedMinute = defineModel<number | undefined>('minute');
const selectedSecond = defineModel<number | undefined>('second');
const selectedMillisecond = defineModel<number | undefined>('millisecond');
const editMode = defineModel<TimePickerSelection>('selection', { default: 'hour' });

const { accuracy = TimeAccuracy.MINUTE, borderless = false } = defineProps<RuiTimePickerProps>();

const FULL_CIRCLE = 360;
const TWELVE_HOURS = 12;

const totalItemsPerMode: Record<TimePickerSelection, number> = {
  hour: 12,
  minute: 60,
  second: 60,
  millisecond: 1000,
};

const intervals: Record<TimePickerSelection, number> = {
  hour: 1,
  minute: 5,
  second: 5,
  millisecond: 100,
};

const isDragging = ref<boolean>(false);
const clockFace = useTemplateRef<InstanceType<typeof HTMLDivElement>>('clockFace');

const showSecond = computed<boolean>(
  () => accuracy === TimeAccuracy.SECOND || accuracy === TimeAccuracy.MILLISECOND,
);
const showMillisecond = computed<boolean>(() => accuracy === TimeAccuracy.MILLISECOND);

const period = computed<'PM' | 'AM'>(() =>
  isDefined(selectedHour) && get(selectedHour) >= TWELVE_HOURS ? 'PM' : 'AM',
);

const displayHour = computed<number | undefined>(() => {
  if (!isDefined(selectedHour)) {
    return undefined;
  }
  const hourValue = get(selectedHour);
  const hour = hourValue % TWELVE_HOURS;
  return hour === 0 ? TWELVE_HOURS : hour;
});

const editedValue = computed<number | undefined>(() => {
  const mode = get(editMode);
  if (mode === 'hour') {
    return get(displayHour);
  }
  else if (mode === 'minute') {
    return get(selectedMinute);
  }
  else if (mode === 'second') {
    return get(selectedSecond);
  }
  else {
    return get(selectedMillisecond);
  }
});

const displayClockHandCircle = computed<boolean>(() => {
  const mode = get(editMode);
  if (mode === 'hour' || !isDefined(editedValue)) {
    return false;
  }
  else {
    const interval = intervals[mode];
    const value = get(editedValue);
    return value % interval !== 0;
  }
});

const dotStyle = computed<StyleValue>(() => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const clockHandStyle = computed<StyleValue>(() => {
  if (!isDefined(editedValue)) {
    return {};
  }
  const currentValue = get(editedValue);
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = currentValue * (FULL_CIRCLE / totalItems);

  return {
    height: '36%',
    top: '14%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    zIndex: 10,
  };
});

const clockHandCircleStyle = computed<StyleValue>(() => {
  if (!isDefined(editedValue)) {
    return {};
  }
  const radius = '38%';
  const currentValue = get(editedValue);
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = currentValue * (FULL_CIRCLE / totalItems);

  const radians = (angle * Math.PI) / 180;

  const x = 50 + parseFloat(radius) * Math.cos(radians - Math.PI / 2);
  const y = 50 + parseFloat(radius) * Math.sin(radians - Math.PI / 2);

  return {
    position: 'absolute',
    top: `${y}%`,
    left: `${x}%`,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 11,
  };
});

const clockNumbers = computed<number[]>(() => {
  const mode = get(editMode);
  const interval = intervals[mode];
  const total = totalItemsPerMode[mode];
  const numbers = generateNumbers(total, interval);
  if (mode === 'hour') {
    numbers[0] = 12;
  }
  return numbers;
});

function getModelHours(): number | undefined {
  return isDefined(modelValue) ? new Date(get(modelValue)).getHours() : undefined;
}

function getModelMinutes(): number | undefined {
  return isDefined(modelValue) ? new Date(get(modelValue)).getMinutes() : undefined;
}

function getModelSeconds(): number | undefined {
  const acceptedAccuracy: TimeAccuracy[] = [TimeAccuracy.SECOND, TimeAccuracy.MILLISECOND];
  return acceptedAccuracy.includes(accuracy) && isDefined(modelValue)
    ? new Date(get(modelValue)).getSeconds()
    : undefined;
}

function getModelMilliseconds(): number | undefined {
  return accuracy === TimeAccuracy.MILLISECOND && isDefined(modelValue)
    ? new Date(get(modelValue)).getMilliseconds()
    : undefined;
}

function generateNumbers(total: number, interval: number): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < total; i += interval) {
    numbers.push(i);
  }
  return numbers;
}

function formatValue(value?: number, padding = 2): string {
  return value !== undefined ? value.toString().padStart(padding, '0') : '-'.repeat(padding);
}

function numberStyle(num: number): StyleValue {
  const radius = '38%';
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = num * (FULL_CIRCLE / totalItems) - 90;

  const radians = (angle * Math.PI) / 180;
  const x = 50 + parseFloat(radius) * Math.cos(radians);
  const y = 50 + parseFloat(radius) * Math.sin(radians);

  return {
    top: `${y}%`,
    left: `${x}%`,
    transform: 'translate(-50%, -50%)',
  };
}

function isSelectedNumber(num: number): boolean {
  if (!isDefined(editedValue)) {
    return false;
  }
  const mode = get(editMode);
  if (mode === 'hour') {
    return get(displayHour) === num;
  }
  else {
    const value = get(editedValue);
    const interval = intervals[mode];
    return value === num || (value % interval === 0 && value === num);
  }
}

function toggleAmPm(): void {
  if (!isDefined(selectedHour)) {
    return;
  }
  if (get(selectedHour) < TWELVE_HOURS) {
    set(selectedHour, get(selectedHour) + TWELVE_HOURS);
  }
  else {
    set(selectedHour, get(selectedHour) - TWELVE_HOURS);
  }

  updateModelValue();
}

function startDrag(event: MouseEvent | TouchEvent): void {
  event.preventDefault();
  set(isDragging, true);

  if (!isDefined(clockFace))
    return;

  const rect = get(clockFace).getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  let rafId: number | null = null;

  const applyMove = (clientX: number, clientY: number): void => {
    const x = clientX - centerX;
    const y = clientY - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0)
      angle += FULL_CIRCLE;

    const mode = get(editMode);
    const unit =
      Math.round(angle / (FULL_CIRCLE / totalItemsPerMode[mode])) % totalItemsPerMode[mode];
    if (mode === 'hour') {
      let hour = unit;
      if (hour === 0)
        hour = TWELVE_HOURS;

      if (get(period) === 'PM' && hour < TWELVE_HOURS) {
        hour += TWELVE_HOURS;
      }
      else if (get(period) === 'AM' && hour === TWELVE_HOURS) {
        hour = 0;
      }

      set(selectedHour, hour);
    }
    else if (mode === 'minute') {
      set(selectedMinute, unit);
    }
    else if (mode === 'second') {
      set(selectedSecond, unit);
    }
    else {
      set(selectedMillisecond, unit);
    }

    updateModelValue();
  };

  const handleMove = (moveEvent: MouseEvent | TouchEvent): void => {
    if (!get(isDragging))
      return;

    if (rafId !== null)
      return;

    let clientX: number;
    let clientY: number;

    if ('touches' in moveEvent) {
      const touch = moveEvent.touches[0];
      assert(touch);
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
    else {
      clientX = moveEvent.clientX;
      clientY = moveEvent.clientY;
    }

    rafId = requestAnimationFrame(() => {
      applyMove(clientX, clientY);
      rafId = null;
    });
  };

  const handleEnd = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    set(isDragging, false);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);

    if (get(editMode) === 'hour') {
      set(editMode, 'minute');
    }
    else if (get(showSecond) && get(editMode) === 'minute') {
      set(editMode, 'second');
    }
    else if (get(showMillisecond) && get(editMode) === 'second') {
      set(editMode, 'millisecond');
    }
  };

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);

  // Apply initial position synchronously for immediate feedback
  const initialEvent = event;
  let clientX: number;
  let clientY: number;
  if ('touches' in initialEvent) {
    const touch = initialEvent.touches[0];
    assert(touch);
    clientX = touch.clientX;
    clientY = touch.clientY;
  }
  else {
    clientX = initialEvent.clientX;
    clientY = initialEvent.clientY;
  }
  applyMove(clientX, clientY);
}

function selectByClick(num: number): void {
  const mode = get(editMode);
  if (mode === 'hour') {
    let newHour = num;

    if (get(period) === 'PM' && newHour < TWELVE_HOURS) {
      newHour += TWELVE_HOURS;
    }

    set(selectedHour, newHour);
    set(editMode, 'minute');
  }
  else if (mode === 'minute') {
    set(selectedMinute, num);
    if (get(showSecond))
      set(editMode, 'second');
  }
  else if (mode === 'second') {
    set(selectedSecond, num);
    if (get(showMillisecond)) {
      set(editMode, 'millisecond');
    }
  }
  else if (mode === 'millisecond') {
    set(selectedMillisecond, num);
  }

  updateModelValue();
}

function updateModelValue(): void {
  if (!(isDefined(selectedHour) && isDefined(selectedMinute))) {
    return;
  }
  nextTick(() => {
    const date = isDefined(modelValue) ? new Date(get(modelValue)) : new Date();
    date.setHours(get(selectedHour));
    date.setMinutes(get(selectedMinute));
    date.setSeconds(get(selectedSecond) ?? 0);
    date.setMilliseconds(get(selectedMillisecond) ?? 0);
    set(modelValue, date);
  });
}

watch(
  modelValue,
  () => {
    set(selectedHour, getModelHours());
    set(selectedMinute, getModelMinutes());
    set(selectedSecond, getModelSeconds());
    set(selectedMillisecond, getModelMilliseconds());
  },
  { deep: true },
);

onMounted(() => {
  set(selectedHour, getModelHours());
  set(selectedMinute, getModelMinutes());
  set(selectedSecond, getModelSeconds());
  set(selectedMillisecond, getModelMilliseconds());
});
</script>

<template>
  <div
    role="group"
    aria-label="Time picker"
    :class="{
      [$style['rui-timepicker']]: true,
      [$style.bordered]: !borderless,
    }"
  >
    <div :class="$style['rui-digital-display']">
      <div class="flex justify-center items-center gap-1">
        <div
          role="button"
          aria-label="Select hours"
          :class="{
            [$style['rui-digit']]: true,
            [$style.active]: editMode === 'hour',
          }"
          @click="editMode = 'hour'"
        >
          {{ formatValue(displayHour) }}
        </div>
        <div class="text-2xl font-semibold">
          :
        </div>
        <div
          role="button"
          aria-label="Select minutes"
          :class="{
            [$style['rui-digit']]: true,
            [$style.active]: editMode === 'minute',
          }"
          @click="editMode = 'minute'"
        >
          {{ formatValue(selectedMinute) }}
        </div>
        <div
          v-if="showSecond"
          class="text-2xl font-semibold"
        >
          :
        </div>
        <div
          v-if="showSecond"
          role="button"
          aria-label="Select seconds"
          :class="{
            [$style['rui-digit']]: true,
            [$style.active]: editMode === 'second',
          }"
          @click="editMode = 'second'"
        >
          {{ formatValue(selectedSecond) }}
        </div>

        <div
          v-if="showMillisecond"
          class="text-lg font-semibold"
        >
          .
        </div>

        <div
          v-if="showMillisecond"
          role="button"
          aria-label="Select milliseconds"
          class="!text-lg"
          :class="{
            [$style.active]: editMode === 'millisecond',
            [$style['rui-digit']]: true,
          }"
          @click="editMode = 'millisecond'"
        >
          {{ formatValue(selectedMillisecond, 3) }}
        </div>
        <div class="text-xl">
          <div
            role="button"
            aria-label="Toggle AM/PM"
            class="rui-time-picker-period cursor-pointer"
            @click="toggleAmPm()"
          >
            {{ period }}
          </div>
        </div>
      </div>
    </div>

    <div
      ref="clockFace"
      role="listbox"
      :aria-label="`Select ${editMode}`"
      :class="$style['rui-clock-face']"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"
    >
      <div
        :class="$style['rui-center-dot']"
        :style="dotStyle"
      />

      <div
        :class="$style['rui-clock-hand']"
        :style="clockHandStyle"
      />

      <div
        v-if="displayClockHandCircle"
        :class="$style['rui-clock-hand-circle']"
        :style="clockHandCircleStyle"
      />

      <div
        v-for="num in clockNumbers"
        :key="`num-${num}`"
        role="option"
        :aria-selected="isSelectedNumber(num)"
        :class="{
          [$style['rui-clock-number']]: true,
          [$style['is-selected']]: isSelectedNumber(num),
          [`rui-${editMode}-${num.toString().padStart(2, '0')}`]: true,
        }"
        :style="numberStyle(num)"
        @click="selectByClick(num)"
      >
        {{ num }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.rui-timepicker {
  @apply bg-white overflow-hidden text-rui-text p-3;

  &.bordered {
    @apply rounded-md shadow-sm border border-rui-grey-200;
  }
}

.rui-digital-display {
  @apply mb-2 text-center;
}

.rui-digit {
  @apply text-2xl font-semibold cursor-pointer;

  &.active {
    @apply text-rui-primary;
  }
}

.rui-clock-face {
  @apply relative rounded-full w-64 h-64 mx-auto border border-rui-grey-200;
}

.rui-center-dot {
  @apply absolute rounded-full bg-rui-primary w-3 h-3;
}

.rui-clock-hand {
  @apply absolute w-[1.5px] bg-rui-primary rounded-full;
}

.rui-clock-hand-circle {
  @apply absolute border-2 border-rui-primary;
}

.rui-clock-number {
  @apply absolute text-center text-sm font-medium w-8 h-8 flex items-center justify-center hover:bg-rui-primary-lighter cursor-pointer rounded-full;

  &.is-selected {
    @apply bg-rui-primary text-rui-dark-text dark:text-rui-light-text z-10 font-bold;
  }
}

:global(.dark) {
  .rui-timepicker {
    @apply bg-rui-grey-900;

    &.bordered {
      @apply border-rui-grey-800;
    }
  }

  .rui-clock-face {
    @apply border-rui-grey-800;
  }
}
</style>
