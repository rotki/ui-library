<script setup lang="ts">
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';

// keep these props in sync with Dialog props
export interface BottomSheetProps {
  modelValue?: boolean;
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

defineOptions({
  name: 'RuiBottomSheet',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BottomSheetProps>(), {
  modelValue: false,
  persistent: false,
});
</script>

<template>
  <RuiDialog
    bottom-sheet
    v-bind="{ ...props, ...$attrs }"
  >
    <template
      v-for="slot in Object.keys($slots)"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
      />
    </template>
  </RuiDialog>
</template>
