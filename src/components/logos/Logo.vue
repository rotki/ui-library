<script setup lang="ts">
export interface Props {
  text?: boolean;
}

defineOptions({
  name: 'RuiLogo',
});

withDefaults(defineProps<Props>(), {
  text: false,
});
</script>

<template>
  <div class="h-12 space-x-4 flex items-center">
    <img class="h-full" src="./logo.svg" alt="Rotki" />
    <div v-if="text" class="text-h4 text-rui-light-primary">rotki</div>
  </div>
</template>
