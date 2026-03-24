<script lang="ts" setup>
import type { Color, ColorFormat } from './utils';
import { clamp } from '@vueuse/shared';
import tinycolor from 'tinycolor2';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

defineOptions({
  name: 'RuiColorInput',
  inheritAttrs: false,
});

const modelValue = defineModel<Color>({ required: true });

const MAX_RGB = 255;
const VALID_HEX_LENGTHS = [3, 4, 6];
const DEFAULT_HEX = '000000';

const inputType = ref<ColorFormat>('hex');
const state = reactive({
  color: get(modelValue),
  hex: get(modelValue).hex,
  rgb: get(modelValue).rgb,
});

function applyRgbValue(value: string, key: number): void {
  if (!state.rgb || !state.color)
    return;

  const clamped = clamp(Number(value), 0, MAX_RGB);
  state.rgb[key] = clamped;
  const [r, g, b] = state.rgb;
  state.color.hex = tinycolor({ r, g, b }).toHex();
}

const onBlurChange = useDebounceFn((format: ColorFormat, event: Event, key?: number) => {
  if (!state.color)
    return;

  const target = event.target;
  if (!(target instanceof HTMLInputElement))
    return;

  const value = target.value;
  if (format === 'hex') {
    const hex = value.replace('#', '');
    if (tinycolor(hex).isValid() && VALID_HEX_LENGTHS.includes(hex.length))
      state.color.hex = hex;
    else state.color.hex = DEFAULT_HEX;
  }
  else if (key !== undefined) {
    applyRgbValue(value, key);
  }

  set(modelValue, state.color);
}, 100);

const onInputChange = useDebounceFn((format: ColorFormat, value: string, key?: number) => {
  if (!value)
    return;

  if (format === 'hex') {
    const hex = value.replace('#', '');
    if (tinycolor(hex).isValid() && state.color && hex.length === 6)
      state.color.hex = hex;
  }
  else if (key !== undefined) {
    applyRgbValue(value, key);
  }

  set(modelValue, state.color);
}, 300);

function onInputTypeChange(): void {
  set(inputType, get(inputType) === 'rgb' ? 'hex' : 'rgb');
}

watch(
  () => {
    const color = get(modelValue);
    return [color.hex, ...color.rgb] as const;
  },
  () => {
    const color = get(modelValue);
    state.color = color;
    state.hex = color.hex;
    state.rgb = color.rgb;
  },
);
</script>

<template>
  <div
    data-id="color-input"
    class="flex justify-center gap-2"
    v-bind="$attrs"
  >
    <div class="flex flex-col items-center gap-1 w-[16rem]">
      <div class="w-full">
        <RuiTextField
          v-if="inputType === 'hex'"
          v-model="state.hex"
          variant="outlined"
          class="flex-1 w-full [&_input]:uppercase"
          maxlength="6"
          color="primary"
          dense
          hide-details
          @update:model-value="onInputChange(inputType, $event)"
          @blur="onBlurChange(inputType, $event)"
        >
          <template #prepend>
            <span class="text-rui-text"> # </span>
          </template>
        </RuiTextField>
        <div
          v-else
          class="flex flex-1 gap-1"
        >
          <RuiTextField
            v-for="(v, i) in state.rgb"
            :key="i"
            :model-value="v.toString()"
            variant="outlined"
            class="[&_input]:text-center w-full"
            maxlength="3"
            color="primary"
            dense
            hide-details
            @update:model-value="onInputChange(inputType, $event, i)"
            @blur="onBlurChange(inputType, $event, i)"
          />
        </div>
      </div>

      <div class="uppercase text-rui-text-secondary text-sm">
        {{ inputType }}
      </div>
    </div>
    <RuiButton
      class="h-10"
      variant="text"
      @click="onInputTypeChange()"
    >
      <RuiIcon name="lu-chevrons-up-down" />
    </RuiButton>
  </div>
</template>
