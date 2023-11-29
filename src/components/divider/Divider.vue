<script setup lang="ts">
export interface Props {
  vertical?: boolean;
}

defineOptions({
  name: 'RuiDivider',
});

withDefaults(defineProps<Props>(), {
  vertical: false,
});
</script>

<template>
  <div :class="vertical ? 'border-l' : 'border-t'" class="border-default" />
</template>
