<script setup lang="ts">
import { useSlot } from '../../use/slots';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  name: CalendarSlotName;
}>();

export type CalendarSlotName =
  | 'day-content'
  | 'day-popover'
  | 'dp-footer'
  | 'footer'
  | 'header-title-wrapper'
  | 'header-title'
  | 'header-prev-button'
  | 'header-next-button'
  | 'nav'
  | 'nav-prev-button'
  | 'nav-next-button'
  | 'page'
  | 'time-header';

const slot = useSlot(props.name);
</script>

<template>
  <Component
    :is="slot"
    v-if="slot"
    v-bind="$attrs"
  />
  <slot v-else />
</template>
