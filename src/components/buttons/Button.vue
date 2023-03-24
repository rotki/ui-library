<script setup lang="ts">
import { type ComputedRef } from 'vue-demi';

const props = withDefaults(
  defineProps<{
    label?: string;
    color?: string;
    outlined?: boolean;
  }>(),
  {
    label: 'Button',
    color: 'brown',
    outlined: false
  }
);

const { outlined, color } = toRefs(props);

const commonClasses = 'py-2 px-4 rounded';

const classes: ComputedRef<string> = computed(() => {
  const colorVal = get(color);
  if (outlined.value) {
    return `border border-${colorVal} text-${colorVal}`;
  }

  return `bg-${colorVal} text-white`;
});
</script>
<template>
  <button :class="[commonClasses, classes]">
    {{ label }}
  </button>
</template>
