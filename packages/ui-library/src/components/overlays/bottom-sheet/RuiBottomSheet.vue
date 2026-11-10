<script setup lang="ts">
import RuiDialog, { type DialogSlots } from '@/components/overlays/dialog/RuiDialog.vue';

/** The sheet's props, which stay in step with RuiDialog's. */
export interface BottomSheetProps {
  persistent?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

/**
 * What the sheet forwards to its RuiDialog through `$attrs`: the dialog's other props and its events
 * (`click:esc`, `click:outside`, `closed`, `dismiss`), besides the HTML attributes.
 */
type DialogAttributes = Omit<InstanceType<typeof RuiDialog>['$props'], keyof BottomSheetProps | 'bottomSheet' | 'modelValue' | 'onUpdate:modelValue'>;

defineOptions({
  name: 'RuiBottomSheet',
  inheritAttrs: false,
});

const modelValue = defineModel<boolean>({ default: false });

const { persistent = false, width, maxWidth } = defineProps<BottomSheetProps & /* @vue-ignore */ DialogAttributes>();

defineSlots<{
  activator?: DialogSlots['activator'];
  default?: DialogSlots['default'];
}>();
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
    <template #activator="scope">
      <slot
        name="activator"
        v-bind="scope"
      />
    </template>
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
  </RuiDialog>
</template>
