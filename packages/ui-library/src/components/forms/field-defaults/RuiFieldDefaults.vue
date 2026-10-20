<script setup lang="ts">
import type { FormDetails } from '@/utils/form-text-detail';
import { type LabelPlacement, provideFieldDefaults } from '@/composables/defaults/field';

export interface FieldDefaultsProps {
  labelPlacement?: LabelPlacement;
  /** The details mode for every form control below; a control's own `details` still wins. */
  details?: FormDetails;
}

defineOptions({
  name: 'RuiFieldDefaults',
});

const { labelPlacement, details } = defineProps<FieldDefaultsProps>();

defineSlots<{
  default?: () => any;
}>();

provideFieldDefaults({
  labelPlacement: () => labelPlacement,
  details: () => details,
});
</script>

<template>
  <slot />
</template>
