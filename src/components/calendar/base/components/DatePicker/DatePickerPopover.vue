<script setup lang="ts">
import { useDatePicker } from '../../use/date-picker';
import Popover from '../Popover/Popover.vue';
import DatePickerBase from './DatePickerBase.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  datePickerPopoverId,
  color,
  displayMode,
  popoverRef,
  onPopoverBeforeShow,
  onPopoverAfterShow,
  onPopoverBeforeHide,
  onPopoverAfterHide,
} = useDatePicker();
</script>

<template>
  <Popover
    :id="datePickerPopoverId"
    ref="popoverRef"
    placement="bottom-start"
    :class="`vc-date-picker-content vc-${color} vc-${displayMode}`"
    @before-show="onPopoverBeforeShow($event)"
    @after-show="onPopoverAfterShow($event)"
    @before-hide="onPopoverBeforeHide($event)"
    @after-hide="onPopoverAfterHide($event)"
  >
    <DatePickerBase v-bind="$attrs" />
  </Popover>
</template>
