<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { VueClassValue } from '@/types/class-value';
import { HIGHLIGHT_COLOR_MAP, HIGHLIGHT_DEFAULT, SliderInteraction, sliderStyles } from '@/components/forms/slider/slider-styles';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { cn } from '@/utils/tv';

export interface RuiSliderClassNames {
  root?: VueClassValue;
  slider?: VueClassValue;
  tick?: VueClassValue;
}

export interface Props {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showThumbLabel?: boolean;
  showTicks?: boolean;
  hideTrack?: boolean;
  tickSize?: number;
  vertical?: boolean;
  color?: ContextColorsType;
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  classNames?: RuiSliderClassNames;
  /** @deprecated Use `classNames.slider` instead */
  sliderClass?: string;
  /** @deprecated Use `classNames.tick` instead */
  tickClass?: string;
  required?: boolean;
}

defineOptions({
  name: 'RuiSlider',
  inheritAttrs: false,
});

const modelValue = defineModel<number>({ default: 0 });

const {
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showThumbLabel = false,
  showTicks = false,
  hideTrack = false,
  vertical = false,
  tickSize = 2,
  color = 'primary',
  label = '',
  hint = '',
  errorMessages = [],
  successMessages = [],
  hideDetails = false,
  classNames,
  sliderClass = '',
  tickClass = '',
  required = false,
} = defineProps<Props>();

const BIG_TICK_THRESHOLD = 4;

const isHovered = ref<boolean>(false);
const isFocused = ref<boolean>(false);
const isActive = ref<boolean>(false);

const outer = useTemplateRef<HTMLDivElement>('outer');

const { hasError, validation } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const { width, height } = useElementBounding(outer);

const bigTick = computed<boolean>(() => tickSize > BIG_TICK_THRESHOLD);

useEventListener(document, 'mouseup', () => set(isActive, false));

const interaction = computed<SliderInteraction>(() => {
  if (disabled)
    return SliderInteraction.idle;
  if (get(isActive))
    return SliderInteraction.active;
  if (get(isFocused))
    return SliderInteraction.focus;
  if (get(isHovered))
    return SliderInteraction.hover;
  return SliderInteraction.idle;
});

// Layout ui: stable props only (not interaction), used for wrapper/label/outer/inner/input
const ui = computed<ReturnType<typeof sliderStyles>>(() => sliderStyles({
  disabled,
  vertical,
  validation: get(validation),
  color,
  bigTick: get(bigTick),
}));

// Track ui: includes interaction state, used for slider/thumb/ticks (changes on hover/focus/active)
const trackUi = computed<ReturnType<typeof sliderStyles>>(() => sliderStyles({
  disabled,
  vertical,
  interaction: get(interaction),
  color,
  bigTick: get(bigTick),
}));

const totalTicks = computed<number>(() => (max - min) / step);

const currentTick = computed<number>(() => Math.round((get(modelValue) - min) / step));

const trackWidth = computed<string>(() => {
  const percentage = Math.min(100, Math.max(0, Math.round((get(currentTick) / get(totalTicks)) * 100)));
  return `${percentage}%`;
});

const innerStyle = computed<Record<string, string>>(() => {
  const w = `${get(width)}px`;
  const h = `${get(height)}px`;
  const style: Record<string, string> = { width: vertical ? h : w, height: vertical ? w : h };
  if (vertical) {
    style['transform-origin'] = '0 0';
    style['--tw-translate-y'] = h;
  }
  return style;
});

const tickSizePx = computed<string>(() => `${tickSize}px`);

const ticksStyle = computed<Record<string, string>>(() => {
  const size = get(tickSizePx);
  return { margin: `0 calc(${size} / -2)`, width: `calc(100% + ${size})` };
});

const tickStyle = computed<Record<string, string>>(() => {
  const size = get(tickSizePx);
  return { width: size, height: size };
});

const highlightClass = computed<string>(() => get(bigTick) ? HIGHLIGHT_COLOR_MAP[color] : HIGHLIGHT_DEFAULT);

const tickClassOverride = computed<string | undefined>(() => cn(classNames?.tick) ?? (tickClass || undefined));

function isHighlightedTick(index: number): boolean {
  return index <= get(currentTick);
}
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <label
      :class="ui.wrapper()"
      :data-error="hasError ? '' : undefined"
    >
      <div
        v-if="label"
        :class="ui.label()"
      >
        {{ label }}
        <span
          v-if="required"
          class="text-rui-error"
        >
          ﹡
        </span>
      </div>
      <div
        ref="outer"
        :class="ui.outer()"
      >
        <div
          :class="ui.inner()"
          :style="innerStyle"
        >
          <input
            v-model="modelValue"
            :class="ui.input()"
            type="range"
            :max="max"
            :min="min"
            :step="step"
            :disabled="disabled"
            :aria-invalid="hasError"
            :aria-label="label || undefined"
            :aria-valuetext="String(modelValue)"
            v-bind="getNonRootAttrs($attrs)"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @mousedown="isActive = true"
            @mouseup="isActive = false"
          />
          <div :class="trackUi.slider()">
            <div :class="trackUi.sliderInner()">
              <div :class="trackUi.container({ class: cn(classNames?.slider) ?? sliderClass })">
                <div
                  v-if="!hideTrack"
                  :class="trackUi.track()"
                  :style="{ width: trackWidth }"
                  data-id="slider-track"
                />
                <div
                  v-if="showTicks && !disabled"
                  :class="trackUi.ticks()"
                  :style="ticksStyle"
                  data-id="slider-ticks"
                >
                  <span
                    v-for="i in totalTicks + 1"
                    :key="i"
                    :class="[
                      trackUi.tick(),
                      hideTrack
                        ? tickClassOverride
                        : [
                          isHighlightedTick(i - 1) && highlightClass,
                          !isHighlightedTick(i - 1) && tickClassOverride,
                        ],
                    ]"
                    :style="tickStyle"
                  />
                </div>
              </div>
              <div
                :class="[trackUi.thumb(), trackUi.thumbRipple()]"
                :style="{ left: trackWidth }"
                data-id="slider-thumb"
              />
              <div
                v-if="showThumbLabel && !disabled"
                :class="trackUi.thumbLabel()"
                :style="{ left: trackWidth }"
                data-id="slider-thumb-label"
              >
                {{ modelValue }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </label>
    <RuiFormTextDetail
      v-if="!hideDetails"
      class="pt-1"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
