<script setup lang="ts">
export interface Props {
  vertical?: boolean;
}

defineOptions({
  name: 'RuiDivider',
  inheritAttrs: false,
});

const { vertical = false } = defineProps<Props>();
</script>

<template>
  <div
    :class="vertical ? 'border-l' : 'border-t'"
    class="border-default"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    v-bind="$attrs"
  />
</template>
