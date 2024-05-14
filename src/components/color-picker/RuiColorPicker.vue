<script lang="ts" setup>
// Inspired by https://github.com/aesoper101/vue3-colorpicker/
import RuiColorBoard from '@/components/color-picker/RuiColorBoard.vue';
import RuiColorHue from '@/components/color-picker/RuiColorHue.vue';
import RuiColorInput from '@/components/color-picker/RuiColorInput.vue';
import RuiColorDisplay from '@/components/color-picker/RuiColorDisplay.vue';
import { getRootAttrs } from '@/utils/helpers';
import { Color } from './utils';

export interface Props {
  modelValue?: string;
}

defineOptions({
  name: 'RuiColorPicker',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), { modelValue: '' });

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

const { modelValue } = toRefs(props);

const state = reactive({
  color: new Color(get(modelValue)),
});

function onBoardChange({ saturation, brightness }: { saturation: number; brightness: number }) {
  state.color.saturation = saturation;
  state.color.brightness = brightness;
}

whenever(
  modelValue,
  (value: string) => {
    if (state.color.hex !== value)
      state.color = new Color(value);
  },
  { deep: true },
);

watch(state, (state) => {
  emit('update:model-value', state.color.hex);
}, { immediate: true, deep: true });

const attrs = useAttrs();
</script>

<template>
  <div
    class="rui-color-picker relative select-none bg-initial"
    v-bind="getRootAttrs(attrs)"
  >
    <RuiColorBoard
      :color="state.color"
      @input="onBoardChange($event)"
    />
    <div class="flex flex-col gap-5 p-4">
      <div class="flex items-center gap-4">
        <RuiColorDisplay :color="state.color.hexString" />
        <RuiColorHue
          v-model="state.color.hue"
          class="flex-1"
        />
      </div>

      <RuiColorInput v-model="state.color" />
    </div>
  </div>
</template>
