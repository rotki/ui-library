<script lang="ts" setup>
import type { Color } from './utils';
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

const inputType = ref<'hex' | 'rgb'>('hex');
const state = reactive({
  color: get(modelValue),
  hex: get(modelValue).hex,
  rgb: get(modelValue).rgb,
});

const onBlurChange = useDebounceFn((inputType: string, event: Event, key?: number) => {
  if (!state.color)
    return;

  const target = event.target;
  if (!(target instanceof HTMLInputElement))
    return;

  const value = target.value;
  if (inputType === 'hex') {
    const _hex = value.replace('#', '');
    if (tinycolor(_hex).isValid() && [3, 4, 6].includes(_hex.length))
      state.color.hex = _hex;
    else state.color.hex = '000000';
  }
  else if (key !== undefined && state.rgb && state.color) {
    let valueInNumber = Number(value);
    valueInNumber = clamp(valueInNumber, 0, 255);

    state.rgb[key] = valueInNumber;
    const [r, g, b] = state.rgb;
    state.color.hex = tinycolor({ r, g, b }).toHex();
  }
}, 100);

const onInputChange = useDebounceFn((inputType: string, value: string, key?: number) => {
  if (!value)
    return;

  if (inputType === 'hex') {
    const _hex = value.replace('#', '');
    if (tinycolor(_hex).isValid() && state.color && _hex.length === 6)
      state.color.hex = _hex;
  }
  else if (key !== undefined && state.rgb && state.color) {
    let valueInNumber = Number(value);
    valueInNumber = clamp(valueInNumber, 0, 255);

    state.rgb[key] = valueInNumber;
    const [r, g, b] = state.rgb;
    state.color.hex = tinycolor({ r, g, b }).toHex();
  }

  set(modelValue, state.color);
}, 300);

function onInputTypeChange(): void {
  set(inputType, get(inputType) === 'rgb' ? 'hex' : 'rgb');
}

whenever(
  modelValue,
  (value) => {
    state.color = value;
    state.hex = state.color.hex;
    state.rgb = state.color.rgb;
  },
  { deep: true },
);
</script>

<template>
  <div
    class="rui-color-input flex justify-center gap-2"
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
