<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { createDatePicker, emits, propsDef } from '../../use/date-picker';
import { omit } from '../../utils/helpers';
import DatePickerBase from './DatePickerBase.vue';
import DatePickerPopover from './DatePickerPopover.vue';

export default defineComponent({
  components: { DatePickerBase, DatePickerPopover },
  inheritAttrs: false,
  props: propsDef,
  emits,
  // eslint-disable-next-line vue/component-api-style
  setup(props, ctx) {
    const datePicker = createDatePicker(props, ctx);
    const slotCtx = reactive(omit(datePicker, 'calendarRef', 'popoverRef'));
    return { ...datePicker, slotCtx };
  },
});
</script>

<template>
  <template v-if="$slots.default">
    <slot v-bind="slotCtx" />
    <DatePickerPopover v-bind="$attrs" />
  </template>
  <DatePickerBase
    v-else
    v-bind="$attrs"
  />
</template>
