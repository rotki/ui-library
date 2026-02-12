<script setup lang="ts">
import RuiDialog from '@/components/overlays/dialog/RuiDialog.vue';

// keep these props in sync with Dialog props
export interface BottomSheetProps {
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

defineOptions({
  name: 'RuiBottomSheet',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const { persistent = false, width, maxWidth } = defineProps<BottomSheetProps>();
</script>

<template>
  <RuiDialog
    v-model="modelValue"
    bottom-sheet
    v-bind="$attrs"
    :persistent="persistent"
    :width="width"
    :max-width="maxWidth"
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
