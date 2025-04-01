<script setup lang="ts">
import { computed } from 'vue';

interface BaseOption {
  value: any;
  label: string;
  disabled?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  options: BaseOption[];
  modelValue: any;
  alignRight?: boolean;
  alignLeft?: boolean;
  showIcon?: boolean;
  fitContent?: boolean;
}>();

defineEmits(['update:modelValue']);

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue);
  return option?.label;
});
</script>

<template>
  <div
    class="vc-base-select"
    :class="{
      'vc-fit-content': fitContent,
      'vc-has-icon': showIcon,
    }"
  >
    <select
      v-bind="$attrs"
      :value="modelValue"
      class="vc-focus"
      :class="{
        'vc-align-right': alignRight,
        'vc-align-left': alignLeft,
      }"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <RuiIcon
      v-if="showIcon"
      name="lu-chevron-down"
      size="18"
    />
    <div
      v-if="fitContent"
      class="vc-base-sizer"
      aria-hidden="true"
    >
      {{ selectedLabel }}
    </div>
  </div>
</template>
