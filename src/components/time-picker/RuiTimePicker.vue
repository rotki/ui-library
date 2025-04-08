<script setup lang="ts">
import { TimeAccuracy } from '@/consts/time-accuracy';
import { computed, onMounted, ref, type StyleValue, watch } from 'vue';

type TimePickerEditMode = 'hour' | 'minute' | 'second' | 'millisecond';

export interface RuiTimePickerProps {
  accuracy?: TimeAccuracy;
  borderless?: boolean;
}

const modelValue = defineModel<Date | undefined>({ required: true });

const props = withDefaults(defineProps<RuiTimePickerProps>(), {
  accuracy: TimeAccuracy.MINUTE,
  borderless: false,
});

const FULL_CIRCLE = 360;
const TWELVE_HOURS = 12;

const totalItemsPerMode: Record<TimePickerEditMode, number> = {
  hour: 12,
  minute: 60,
  second: 60,
  millisecond: 1000,
};

const intervals: Record<TimePickerEditMode, number> = {
  hour: 1,
  minute: 5,
  second: 5,
  millisecond: 100,
};

const selectedHour = ref<number>(getModelHours());
const selectedMinute = ref<number>(getModelMinutes());
const selectedSecond = ref<number>(getModelSeconds());
const selectedMillisecond = ref<number>(getModelMilliseconds());
const editMode = ref<TimePickerEditMode>('hour');
const isDragging = ref<boolean>(false);
const clockFace = useTemplateRef<InstanceType<typeof HTMLDivElement>>('clockFace');

const showSecond = computed<boolean>(() => props.accuracy === TimeAccuracy.SECOND || props.accuracy === TimeAccuracy.MILLISECOND);
const showMillisecond = computed<boolean>(() => props.accuracy === TimeAccuracy.MILLISECOND);

const period = computed<'PM' | 'AM'>(() => get(selectedHour) >= TWELVE_HOURS ? 'PM' : 'AM');

const displayHour = computed<number>(() => {
  const hour = get(selectedHour) % TWELVE_HOURS;
  return hour === 0 ? TWELVE_HOURS : hour;
});

const editedValue = computed<number>(() => {
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
  if (mode === 'hour') {
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
  const currentValue = get(editedValue);
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = (currentValue * (FULL_CIRCLE / totalItems));

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
  const radius = '38%';
  const currentValue = get(editedValue);
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = (currentValue * (FULL_CIRCLE / totalItems));

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

function getModelHours() {
  return isDefined(modelValue) ? new Date(get(modelValue)).getHours() : 0;
}

function getModelMinutes() {
  return isDefined(modelValue) ? new Date(get(modelValue)).getMinutes() : 0;
}

function getModelSeconds() {
  const acceptedAccuracy: TimeAccuracy[] = [TimeAccuracy.SECOND, TimeAccuracy.MILLISECOND];
  return acceptedAccuracy.includes(props.accuracy) && isDefined(modelValue)
    ? new Date(get(modelValue)).getSeconds()
    : 0;
}

function getModelMilliseconds() {
  return props.accuracy === TimeAccuracy.MILLISECOND && isDefined(modelValue)
    ? new Date(get(modelValue)).getMilliseconds()
    : 0;
}

function generateNumbers(total: number, interval: number): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < total; i += interval) {
    numbers.push(i);
  }
  return numbers;
}

function formatValue(value: number, padding = 2): string {
  return value.toString().padStart(padding, '0');
}

function numberStyle(num: number): StyleValue {
  const radius = '38%';
  const totalItems = totalItemsPerMode[get(editMode)];
  const angle = (num * (FULL_CIRCLE / totalItems)) - 90;

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

function toggleAmPm() {
  if (get(selectedHour) < TWELVE_HOURS) {
    set(selectedHour, get(selectedHour) + TWELVE_HOURS);
  }
  else {
    set(selectedHour, get(selectedHour) - TWELVE_HOURS);
  }

  updateModelValue();
}

function startDrag(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  set(isDragging, true);

  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!get(isDragging) || !isDefined(clockFace))
      return;

    const rect = get(clockFace).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;

    if ('touches' in moveEvent) {
      clientX = moveEvent.touches[0].clientX;
      clientY = moveEvent.touches[0].clientY;
    }
    else {
      clientX = moveEvent.clientX;
      clientY = moveEvent.clientY;
    }

    const x = clientX - centerX;
    const y = clientY - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0)
      angle += FULL_CIRCLE;

    const mode = get(editMode);
    const unit = Math.round(angle / (FULL_CIRCLE / totalItemsPerMode[mode])) % totalItemsPerMode[mode];
    if (mode === 'hour') {
      let hour;

      hour = unit;
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

  const handleEnd = (): void => {
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

  handleMove(event);
}

function selectByClick(num: number) {
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

function updateModelValue() {
  const model = get(modelValue);
  if (!model) {
    return;
  }

  const date = new Date(model);
  date.setHours(get(selectedHour));
  date.setMinutes(get(selectedMinute));
  date.setSeconds(get(selectedSecond));
  date.setMilliseconds(get(selectedMillisecond));
  set(modelValue, date);
}

onMounted(() => {
  set(selectedHour, getModelHours());
  set(selectedMinute, getModelMinutes());
  set(selectedSecond, getModelSeconds());
  set(selectedMillisecond, getModelMilliseconds());
  set(editMode, 'hour');
});

watch(modelValue, () => {
  set(selectedHour, getModelHours());
  set(selectedMinute, getModelMinutes());
  set(selectedSecond, getModelSeconds());
  set(selectedMillisecond, getModelMilliseconds());
}, { deep: true });
</script>

<template>
  <div
    :class="{
      [$style['rui-timepicker']]: true,
      [$style.bordered]: !borderless,
    }"
  >
    <div :class="$style['rui-digital-display']">
      <div class="flex justify-center items-center gap-1">
        <div
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
