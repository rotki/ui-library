<script setup lang="ts">
export interface Props {
  vertical?: boolean;
}

defineOptions({
  name: 'RuiDivider',
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), {
  vertical: false,
});
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
