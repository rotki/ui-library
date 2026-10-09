<script setup lang="ts">
import { type LabelPlacement, provideFieldDefaults } from '@/composables/defaults/field';

export interface FieldDefaultsProps {
  labelPlacement?: LabelPlacement;
}

defineOptions({
  name: 'RuiFieldDefaults',
});

const { labelPlacement } = defineProps<FieldDefaultsProps>();

defineSlots<{
  default?: () => any;
}>();

provideFieldDefaults(() => labelPlacement);
</script>

<template>
  <slot />
</template>
